import { FileActions, FileActionTypes } from "./file.actions"
import { PathPart, Shape } from "../../models"
import * as svgpath from "svgpath"
import { Renderer2 } from "@angular/core"
import * as uuid from "uuid/v4"
import Point = SvgPanZoom.Point

export interface DesignState {
    name: string
    shapes: Map<string, Shape>
}

export interface RenderState {
    root: SVGSVGElement
    scaling: number
}

export const renderReducer = (state: RenderState, action: FileActions): RenderState => {
    switch (action.type) {
        case FileActionTypes.SVG_FILE_RENDERED:
            console.log("renderReducer: SVG_FILE_RENDERED")
            return { scaling: calculateScalingFactor(action.payload.root), root: action.payload.root }

        default:
            return state
    }
}

export const designReducer = (state: DesignState, action: FileActions): DesignState => {
    switch (action.type) {
        case FileActionTypes.SVG_FILE_RENDERED:
            console.log("designReducer: SVG_FILE_RENDERED")
            // The SVG file has been rendered in the container so we can do our post-rendering processing before updating the shape. We could do this processing in an effect
            // but then we'd have to add another event to store it in the state which seem an unnecessary complexity.
            deleteMarkerDefs(action.payload.root)
            deleteCssDefs(action.payload.root)

            const shapes = getShapes(action.payload.root, action.payload.renderer)
            addIdToAllElements(shapes)
            adjustPathsForIntersectionLibrary(shapes)
            removeStylesApartFromFill(shapes)

            return { name: action.payload.name, shapes: shapes }
        default:
            return state
    }
}

const calculateScalingFactor = (root: SVGSVGElement): number => {
    const viewBox = root.viewBox.baseVal
    const scalingWidth = viewBox.width / root.width.baseVal.valueInSpecifiedUnits
    const scalingHeight = viewBox.height / root.height.baseVal.valueInSpecifiedUnits
    if (Math.abs(scalingHeight - scalingWidth) > 0.01) {
        throw new Error(`Cannot support different x and y scaling factors. Width ${scalingWidth} Height ${scalingHeight}`)
    }

    return scalingWidth
}
/**
 * Deletes the CSS definitions that appear in the defs section of the svg file. This is so that they don't interfer with the rendering. We have to do this before adding the
 * pan/zoom controls as this updates the defs section itself.
 */
const deleteCssDefs = (root: SVGSVGElement): void => {
    const defs = root.querySelector("defs")
    if (defs) {
        const style = defs.querySelector('style[type="text/css"]')
        if (style) {
            defs.removeChild(style)
        }
    }
}

/**
 * Deletes the marker definitions that appear in the defs section of the svg file. This is so that they don't interfer with the rendering
 */
const deleteMarkerDefs = (svg: SVGSVGElement): void => {
    const defs = svg.querySelector("defs")
    if (defs) {
        const markers = defs.querySelectorAll("marker")
        if (markers) {
            markers.forEach(marker => defs.removeChild(marker))
        }
    }
}

/**
 * Removes all style attributes apart from fill. The fill colour can then be used to select a default thread colour. The fill won't be visible as the opacity will be set to 0
 * in the CSS so it is just used as a colour reference when selecting threads.
 */
const removeStylesApartFromFill = (shapes: Map<string, Shape>) => {
    shapes.forEach(shape => {
        const element = shape.element
        const fillColor = element.style.fill
        element.style.cssText = `fill: ${fillColor}`
    })
}

/**
 * Add a unique id to anything that doesn't have one already.
 */
const addIdToAllElements = (shapes: Map<string, Shape>) => {
    shapes.forEach(shape => {
        const element = shape.element
        if (element.id === "") {
            element.id = uuid()
        }
    })
}

/**
 * Converts paths to use absolute commands.
 * 1. svg-intersections doesn't support the 'h' command for some reason so convert to absoluate coords
 * 2. svg-intersections sometimes misses out intersections for paths contains H and V commands so convert these to L
 */
const adjustPathsForIntersectionLibrary = (shapes: Map<string, Shape>): void => {
    shapes.forEach(shape => {
        const element = shape.element
        let path = svgpath(element.getAttribute("d") as string).abs()

        path = path.iterate(
            (segment, index, startX, startY): void => {
                if (segment[0] === "H") {
                    const newX = segment[1]
                    const newY = startY
                    segment[0] = "L"
                    segment[1] = newX
                    segment.push(newY)
                } else if (segment[0] === "V") {
                    const newX = startX
                    const newY = segment[1]
                    segment[0] = "L"
                    segment[1] = newX
                    segment.push(newY)
                }
            }
        )

        element.setAttribute("d", path.toString().toString())
    })
}

const getShapes = (root: Node, renderer: Renderer2): Map<string, Shape> => {
    const results = new Map<string, Shape>()
    root.childNodes.forEach(node => {
        if (node instanceof SVGPathElement) {
            if (node.classList.contains("stitchableShape")) {
                const id = node.getAttribute("id") as string
                results.set(id, new Shape(node, getPathParts(node, renderer)))
            }
        } else if (node.childNodes) {
            getShapes(node, renderer).forEach((shape, key) => results.set(key, shape))
        }
    })

    return results
}

/**
 * This breaks the paths into a series of L and M comnands that makes up the complete path. We'll call these segments.
 *
 * In addition the path may be made up of a number of discontiguous parts that are separated by Move commands. We've calls these subpaths. We need to know in which subpath
 * a segment is in so that we can work out if we can move from one segment to another along the edge of the path.
 */
const getPathParts = (element: SVGPathElement, renderer: Renderer2): PathPart[] => {
    const path = svgpath(element.getAttribute("d") as string)
    const pathParts: PathPart[] = []
    let startOfSubpath: Point
    let subPathNumber = -1
    let previousSegment: SVGPathElement
    path.iterate(
        (segment, index, x, y): void => {
            if (segment[0] === "Z") {
                // To close the path we move from the end of the previous segment to the start of the first segment
                const len = previousSegment!.getTotalLength()
                const end = previousSegment!.getPointAtLength(len)
                const path = `M${end.x},${end.y}L${startOfSubpath.x},${startOfSubpath.y}`
                const segmentElement = stringToPathElement(path, renderer)
                renderElement(segmentElement, element, renderer)
                pathParts.push({ segment: segmentElement, subPath: subPathNumber })
            } else if (segment[0] !== "M") {
                // We've got an L or C command that forms a segment. Add a move command to the start  of the segment so it starts from the right place
                const path = `M${x},${y} ${segment.join(" ")}`

                const segmentElement = stringToPathElement(path, renderer)
                renderElement(segmentElement, element, renderer)
                pathParts.push({ segment: segmentElement, subPath: subPathNumber })

                previousSegment = segmentElement
            } else if (segment[0] === "M") {
                // A series of commands are separated by moves. Keep track of the move at the start of the commands so that if we get a Z command, we can close the path
                // path to this point.
                startOfSubpath = { x: segment[1], y: segment[2] }
                ++subPathNumber
            }
        }
    )

    return pathParts
}

const stringToPathElement = (path: string, renderer: Renderer2): SVGPathElement => {
    const element = renderer.createElement("path", "svg") as SVGPathElement
    element.setAttribute("d", path)
    return element
}

/**
 * We have to actually render the elements otherwise calls to getBBox etc don't work.
 */
const renderElement = (element: SVGPathElement, parent: SVGPathElement, renderer: Renderer2) => {
    element.setAttribute("visibility", "hidden")
    renderer.appendChild(parent.parentNode, element)
}
