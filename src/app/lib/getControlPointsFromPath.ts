import { Point } from "../models"
import * as svgpath from "svgpath"

/**
 * Given an svg path, this iterates over the path and returns the coordinates that are the inputs into each command.
 * It only works with commands M, L and C
 */
export const getControlPointsFromPath = (element: SVGPathElement): Point[] => {
    const path = svgpath(element.getAttribute("d") as string)
    const points: Point[] = []
    path.iterate(
        (segment, index, startX, startY): void => {
            if (isCurveCommand(segment)) {
                points.push({ x: startX, y: startY })
                points.push({ x: segment[1], y: segment[2] })
                points.push({ x: segment[3], y: segment[4] })
                points.push({ x: segment[5], y: segment[6] })
            } else if (isLineCommand(segment)) {
                points.push({ x: startX, y: startY })
                points.push({ x: segment[1], y: segment[2] })
            } else if (!isMoveCommand(segment)) {
                throw new Error(`Unsupport command ${segment[0]} in path ${element.getAttribute("d")}`)
            }
        }
    )

    return points
}

const isCurveCommand = (segment: any[]): boolean => {
    return segment[0] === "C"
}

const isLineCommand = (segment: any[]): boolean => {
    return segment[0] === "L"
}

const isMoveCommand = (segment: any[]): boolean => {
    return segment[0] === "M"
}
