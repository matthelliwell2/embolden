/**
 * Given a list of paths, this finds the element on which the point lies. It calculates this using the bounding box for each path and therefore only works with simple paths.
 */
import { Point } from "../models"

export const findElementIndexForPoint = (elements: SVGPathElement[], point: Point): number => {
    const matches = elements
        .map((element, i) => {
            return { element: element, index: i }
        })
        .filter(element => pointInBBox(point, element.element))
        .reduce(smallestBoundingBox, undefined)

    if (matches) {
        return matches.index
    } else {
        throw new Error(`No matching element found for point ${point}`)
    }
}

const smallestBoundingBox = (a: ElementWithIndex | undefined, b: ElementWithIndex): ElementWithIndex | undefined => {
    if (!a) {
        return b
    }

    const areaA = a.element.getBBox().width * a.element.getBBox().height
    const areaB = b.element.getBBox().width * b.element.getBBox().height

    return areaA <= areaB ? a : b
}

const pointInBBox = (point: Point, element: SVGPathElement): boolean => {
    const bbox = element.getBBox()

    // Due to rounding we need to expand the box a bit
    const expandBy = 0.01
    if (bbox.width < 1) {
        bbox.x = bbox.x - expandBy
        bbox.width = bbox.width + expandBy * 2
    }

    if (bbox.height < 1) {
        bbox.y = bbox.y - expandBy
        bbox.height = bbox.height + expandBy * 2
    }

    return (
        roundTo3DP(point.x) >= roundTo3DP(bbox.x) &&
        roundTo3DP(point.x) <= roundTo3DP(bbox.x + bbox.width) &&
        roundTo3DP(point.y) >= roundTo3DP(bbox.y) &&
        roundTo3DP(point.y) <= roundTo3DP(bbox.y + bbox.height)
    )
}

const roundTo3DP = (n: number): number => {
    return Math.round(n * 1000) / 1000
}

interface ElementWithIndex {
    element: SVGPathElement
    index: number
}
