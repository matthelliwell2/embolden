import { Point } from "../models"
import { getControlPointsFromPath } from "./getControlPointsFromPath"

const Bezier = require("bezier-js")

/**
 * Given a list of paths, this finds the element on which the point lies. It calculates this by projecting the point onto the curve and finding how far the point is from the
 * projection point. It returns the index number of the closest element.
 */
export const findElementIndexForPoint = (elements: SVGPathElement[], point: Point): number => {
    let closestDistance = Infinity
    let closestIndex = -1
    for (let i = 0; i < elements.length; ++i) {
        const bbox = elements[i].getBBox()
        if (point.x >= bbox.x && point.x <= bbox.x + bbox.width && point.y >= bbox.y && point.y <= bbox.y + bbox.height) {
            console.log("in bounding box")
        }

        const coords: Point[] = getControlPointsFromPath(elements[i])
        let projection: Point | undefined
        if (coords.length == 4) {
            const b = new Bezier(coords)
            projection = b.project(point) as Point
        } else if (coords.length === 2) {
            projection = pointLineIntersection(point.x, point.y, coords[0].x, coords[0].y, coords[1].x, coords[1].y)

            // Make sure the project is within the bounding box of the line otherwise it doesn't count
            if (!pointInBoundingBox(projection, coords)) {
                projection = undefined
            }
        } else {
            throw new Error("Unknown path type")
        }

        if (projection) {
            const distance = distanceBetweenPoints(point, projection)
            if (distance < closestDistance) {
                closestDistance = distance
                closestIndex = i
            }
        }
    }

    console.log("closest distance", closestDistance)
    return closestIndex
}

const pointInBoundingBox = (point: Point, coords: Point[]): boolean => {
    let minX = Math.min(coords[0].x, coords[1].x)
    let maxX = Math.max(coords[0].x, coords[1].x)
    let minY = Math.min(coords[0].y, coords[1].y)
    let maxY = Math.max(coords[0].y, coords[1].y)

    if (maxX - minX < 0.01) {
        maxX += 0.5
        minX -= 0.5
    }

    if (maxY - minY < 0.01) {
        maxY += 0.5
        minY -= 0.5
    }
    return point.x >= minX && point.x <= maxX && point.y >= minY && point.y <= maxY
}
const distanceBetweenPoints = (p1: Point, p2: Point): number => {
    const x = p1.x - p2.x
    const y = p1.y - p2.y
    return Math.sqrt(x * x + y * y)
}

// From http://jsfromhell.com/math/dot-line-intersection
const pointLineIntersection = (x, y, x0, y0, x1, y1): Point => {
    if (!(x1 - x0)) return { x: x0, y: y }
    else if (!(y1 - y0)) return { x: x, y: y0 }

    let left,
        tg = -1 / ((y1 - y0) / (x1 - x0))
    return { x: left = (x1 * (x * tg - y + y0) + x0 * (x * -tg + y - y1)) / (tg * (x1 - x0) + y0 - y1), y: tg * left - tg * x + y }
}
