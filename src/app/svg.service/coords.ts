import * as Snap from "snapsvg"
import * as SnapCjs from 'snapsvg-cjs'
import {Coord, Line, Rectangle} from "./models"
import {getPaper} from "./util"

/**
 * Converts the 'd' attribute on the element to the user coord space
 *
 * The path defined on the 'd' attribute in the element does not include any transformation defined inside the
 * element so to get the actual path we need to apply these transforms to the path on the attribute.
 */
export const elementPathToElementCoords = (element: Snap.Element): string => {
    const path = SnapCjs.path as Snap.Path
    const localMatrix = element.transform().localMatrix

    return path.map(element.attr("d"), localMatrix)
}


/**
 * Given lines that are in the element coordinate space this converts them to the user/viewbox coordinate space.
 * the lines are updated with the new coords. Returned array is the same as the array that was passed in.
 */
export const elementToViewBoxCoords = (element: Snap.Element, lines: Line[][]): Line[][] => {
    // The lines are already in element coords so have had the local matrix applied. To get back to viewbox coords
    // we need to know all transforms applied to the element.
    const matrix = getElementToViewBoxMatrix(element)

    lines.forEach(row => {
        return row.forEach(line => {
            line.start = {x: matrix.x(line.start.x, line.start.y), y: matrix.y(line.start.x, line.start.y)}
            line.end = {x: matrix.x(line.end.x, line.end.y), y: matrix.y(line.end.x, line.end.y)}
        })
    })

    return lines
}

export const viewBoxCoordToElementCoords = (element: Snap.Element, point: Coord): Coord => {
    const matrix = getViewBoxToElementMatrix(element)
    return {
        x: matrix.x(point.x, point. y),
        y: matrix.y(point.x, point. y)
    }
}

/**
 * Converts a bounding box in element coords to the corresponding rectangle in viewbox coords
 */
export const bboxToViewBoxRect = (element: Snap.Element, bbox: Snap.BBox): Rectangle =>{
    const matrix = getElementToViewBoxMatrix(element)

    const x = matrix.x(bbox.x, bbox.y)
    const y = matrix.y(bbox.x, bbox.y)
    const x2 = matrix.x(bbox.x + bbox.width, bbox.y + bbox.height)
    const y2 = matrix.y(bbox.x + bbox.width, bbox.y + bbox.height)
    const width = Math.abs(x2 - x)
    const height = Math.abs(y2 - y)

    return {
        x: x,
        y: y,
        width: width,
        height: height
    }
}

/**
 * The distance between stitch rows is defined in mm. To be able to generatet the scanlines, which are in element
 * coords, we need to convert mm to element coords. The viewport is defined in mm but may have been resized due
 * to zooming so we need to know the original viewport size in mm to do the calculation.
 */
export const mmToElementLength = (container: Snap.Element, element: Snap.Element, mm: number, unzoomedViewportWidth: number): number => {
    const viewboxMM = mmToViewBoxLength(container, mm, unzoomedViewportWidth)
    const matrix = getViewBoxToElementMatrix(element)

    const width = matrix.x(0, viewboxMM) - matrix.x(0, 0)
    const length = matrix.y(0, viewboxMM) - matrix.y(0, 0)

    const number = Math.sqrt(width * width + length * length)
    return number
}

export const mmToViewBoxLength = (container: Snap.Element, mm: number, unzoomedViewportWidth: number): number => {
    const paper = getPaper(container)
    if (paper !== undefined) {
        const width = paper.attr('width')

        const viewBox = paper.attr('viewBox')

        const scalingWidth = viewBox.width / Number(width.slice(0, width.length - 2))

        const scaledValue = scalingWidth * mm * zoomScalingFactor(paper, unzoomedViewportWidth)

        return scaledValue
    } else {
        return 1
    }
}


const getViewBoxToElementMatrix = (element: Snap.Element): Snap.Matrix => {
    return getElementToViewBoxMatrix(element).invert()
}

/**
 * Converts from element coords to viewbox coords. If there is no scaling applied this should return just a simple
 * 1:1 scaling factor.
 *
 * To do this we get the global transform applied to the element and
 * then subtract the global transform applied to the paper itself, eg the paper may have been scaled to fit inside
 * the containing div which doesn't affect the coords we are using.
 */
const getElementToViewBoxMatrix = (element: Snap.Element): Snap.Matrix => {
    const matrix = element.paper!.transform().globalMatrix.invert()
    matrix.add(element.transform().globalMatrix)

    return matrix
}

const zoomScalingFactor = (paper: Snap.Paper, unzoomedViewportWidth: number): number => {
    const viewportWidthMM = paper.attr('width')
    const currentViewportWidth = Number(viewportWidthMM.slice(0, viewportWidthMM.length - 2))
    return currentViewportWidth / unzoomedViewportWidth
}
