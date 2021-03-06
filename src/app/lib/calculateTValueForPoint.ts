import { Point } from "../models"
import { getControlPointsFromPath } from "./getControlPointsFromPath"

const Bezier = require("bezier-js")

/**
 * Given a path and a point this calculates the distance along the curve to the point, ie the inverse of SVGPathElement.getPointAtLength. This asumes that the element
 * passed into has a move command and either a line or curve command afterwards. Anything else will throw an error
 */
export const calculateTValueForPoint = (element: SVGPathElement, point: Point): number => {
    const coords: Point[] = getControlPointsFromPath(element)

    if (coords.length == 4) {
        const b = new Bezier(coords)
        return b.project(point).t!
    } else if (coords.length === 2) {
        // We've got a line so we can do the calculation here.
        const tx = (point.x - coords[0].x) / (coords[1].x - coords[0].x)
        if (!isFinite(tx) || isNaN(tx)) {
            const ty = (point.y - coords[0].y) / (coords[1].y - coords[0].y)
            if (ty > 1) {
                console.log("t value", ty)
                throw new Error("t value > 1)")
            }
            return ty
        } else {
            if (tx > 1) {
                console.log("t value", tx)
                throw new Error("t value > 1)")
            }
            return tx
        }
    } else {
        throw new Error(`Unsupport path ${element.getAttribute("d")}`)
    }
}
