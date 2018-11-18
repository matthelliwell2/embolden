import { Point } from "../models"
import * as svgpath from "svgpath"

const Bezier = require("bezier-js")

/**
 * Given a list of paths, this finds the path on which the point lies. It calculates this using the bounding box for each path and therefore only works with simple paths.
 */
export const findElementForPoint = (elements: SVGPathElement[], point: Point): number => {
    // Check which bounding boxes the point is inside
    const matchingIndexes: number[] = []
    elements.reduce((acc: number[], segment: SVGPathElement, index: number) => {
        if (pointInBBox(point, segment.getBBox())) {
            acc.push(index)
        }

        return acc
    }, matchingIndexes)

    if (matchingIndexes.length === 0) {
        throw new Error(`Point ${point} not inside any segments`)
    } else if (matchingIndexes.length == 1) {
        return matchingIndexes[0]
    } else {
        // if its in more than one then we choose the smallest box because this is due to one part of the path being within another part
        return matchingIndexes.reduce((smallestSegment, i) => {
            const bbox = elements[i].getBBox()
            const area = bbox.width * bbox.height

            const prevBbox = elements[smallestSegment].getBBox()
            const prevArea = prevBbox.width * prevBbox.height

            if (area > prevArea) {
                return i
            } else {
                return smallestSegment
            }
        }, 0)
    }
}

/**
 * Given a Bezier curve and a point this calculates the distance along the curve to the point, ie the inverse of SVGPathElement.getPointAtLength. This asumes that the element
 * passed into has a move command and either a line or curve command afterwards. Anything else will return the wrong results.
 */
export const getTValueAtPoint = (element: SVGPathElement, target: Point): number => {
    const path = svgpath(element.getAttribute("d") as string)
    const coords: Point[] = []
    path.iterate(
        (segment, index, startX, startY): void => {
            if (segment[0] === "C") {
                coords.push({ x: startX, y: startY })
                coords.push({ x: segment[1], y: segment[2] })
                coords.push({ x: segment[3], y: segment[4] })
                coords.push({ x: segment[5], y: segment[6] })
            } else if (segment[0] === "L") {
                coords.push({ x: startX, y: startY })
                coords.push({ x: segment[1], y: segment[2] })
            } else if (segment[0] !== "M") {
                throw new Error(`Unsupport command ${segment[0]} in path ${element.getAttribute("d")}`)
            }
        }
    )

    if (coords.length == 4) {
        const b = new Bezier(coords)
        return b.project(target).t!
    } else if (coords.length === 2) {
        // We've got a line so we can do the calculation here.
        const t = (target.x - coords[0].x) / (coords[0].x - coords[1].x)
        if (!isFinite(t) || isNaN(t)) {
            return (target.y - coords[0].y) / (coords[0].y - coords[1].y)
        } else {
            return t
        }
    } else {
        console.log("Unsupport path ", element.getAttribute("d"))
        return 0
    }
}

/**
 * Is the point inside the box?
 */
const pointInBBox = (point: Point, bbox: DOMRect): boolean => {
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

    return point.x >= bbox.x && point.x <= bbox.x + bbox.width && point.y >= bbox.y && point.y <= bbox.y + bbox.height
}
