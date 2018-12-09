import { Injectable, Renderer2 } from "@angular/core"
import { PathPart, Shape } from "./models"
import * as svgpath from "svgpath"
import { PubSubService } from "./pub-sub.service"
import Point = SvgPanZoom.Point

/**
 * This service keeps track of which elements are filled with which stitches. It just hold state without any logic.
 */
@Injectable({
    providedIn: "root"
})
export class ShapeService {
    /**
     * A map of element id to the stitching properties of that element. This acts as the central control structure for
     * the stitching
     */
    readonly shapes: Map<string, Shape> = new Map()

    constructor(private pubSubService: PubSubService) {
        this.pubSubService.subscribe(this)
    }

    getShape(element: SVGPathElement, renderer: Renderer2): Shape {
        const id = element.getAttribute("id") as string
        if (!this.shapes.has(id)) {
            const pathParts = this.getPathParts(element, renderer)

            this.shapes.set(id, new Shape(element, pathParts))
        }

        return this.shapes.get(id)!
    }

    /**
     * Make's sure that the path is closed otherwise it can't be filled properly. We don't do this when we load the file as we might not be filling the shape
     */
    closePath(shape: Shape, renderer: Renderer2) {
        const path = shape.element.getAttribute("d")!.trim()
        if (!path.endsWith("Z") && !path.endsWith("z")) {
            shape.element.setAttribute("d", path + "Z")
            shape.pathParts = this.getPathParts(shape.element, renderer)
        }
    }

    onFileLoaded() {
        // We've loaded a new file so clear down the cache of shapes from the previous file
        this.shapes.clear()
    }

    /**
     * This breaks the paths into a series of L and M comnands that makes up the complete path. We'll call these segments.
     *
     * In addition the path may be made up of a number of discontiguous parts that are separated by Move commands. We've calls these subpaths. We need to know in which subpath
     * a segment is in so that we can work out if we can move from one segment to another along the edge of the path.
     */
    private getPathParts(element: SVGPathElement, renderer: Renderer2): PathPart[] {
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
                    const segmentElement = this.stringToPathElement(path, renderer)
                    this.renderElement(segmentElement, element, renderer)
                    pathParts.push({ segment: segmentElement, subPath: subPathNumber })
                } else if (segment[0] !== "M") {
                    // We've got an L or C command that forms a segment. Add a move command to the start  of the segment so it starts from the right place
                    const path = `M${x},${y} ${segment.join(" ")}`

                    const segmentElement = this.stringToPathElement(path, renderer)
                    this.renderElement(segmentElement, element, renderer)
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

    /**
     * We have to actually render the elements otherwise calls to getBBox etc don't work.
     */
    private renderElement(element: SVGPathElement, parent: SVGPathElement, renderer: Renderer2) {
        element.setAttribute("visibility", "hidden")
        renderer.appendChild(parent.parentNode, element)
    }

    private stringToPathElement(path: string, renderer: Renderer2): SVGPathElement {
        const element = renderer.createElement("path", "svg") as SVGPathElement
        element.setAttribute("d", path)
        return element
    }
}
