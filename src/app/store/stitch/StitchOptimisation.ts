import { Intersection, Intersections, Shape } from "../../models"
import * as Lib from "../../lib/lib"

enum Corner {
    TOP_LEFT,
    TOP_RIGHT,
    BOTTOM_LEFT,
    BOTTOM_RIGHT
}

type ColIndexAndCorner = { colIndex: number; corner: Corner }

export const optimiseStitchingOrder = (shape: Shape, remainingCols: Intersections[][]): Intersections[][] => {
    // return remainingCols.slice(1,2)

    const optimisedOrdering: Intersections[][] = []

    // We'll start sewing in the top left of the first col. We could improve this later by
    // 1. Starting with a different col
    // 2. Starting with a different corner
    let currentCol = remainingCols[0]
    remainingCols.splice(0, 1)
    let startCornerOfCurrentCol = Corner.TOP_LEFT
    updateDirectionGivenStartCorner(currentCol, startCornerOfCurrentCol)

    optimisedOrdering.push(currentCol)

    while (remainingCols.length > 0) {
        const closestCol = findClosestColumnToEnd(shape, currentCol, remainingCols)
        if (closestCol) {
            currentCol = remainingCols[closestCol.colIndex]
            startCornerOfCurrentCol = closestCol.corner

            remainingCols.splice(closestCol.colIndex, 1)
        } else {
            // There's no column on the same subpath so just move onto the next element
            currentCol = remainingCols[0]
            startCornerOfCurrentCol = Corner.TOP_LEFT

            remainingCols.splice(0, 1)
        }

        updateDirectionGivenStartCorner(currentCol, startCornerOfCurrentCol)
        optimisedOrdering.push(currentCol)
    }

    // return optimisedOrdering.slice(0, 2)
    return optimisedOrdering
}

const updateDirectionGivenStartCorner = (col: Intersections[], firstCorner: Corner): void => {
    let leftToRight: boolean
    let topToBottom: boolean
    switch (firstCorner) {
        case Corner.TOP_LEFT:
            leftToRight = true
            topToBottom = true
            break
        case Corner.TOP_RIGHT:
            leftToRight = false
            topToBottom = true
            break
        case Corner.BOTTOM_LEFT:
            leftToRight = true
            topToBottom = false
            break
        case Corner.BOTTOM_RIGHT:
            leftToRight = false
            topToBottom = false
            break
        default:
            assertUnreachable(firstCorner)
            return
    }

    if (!topToBottom) {
        col = col.reverse()
    }

    col.forEach(scanLine => {
        if (!leftToRight) {
            const temp = scanLine.start
            scanLine.start = scanLine.end
            scanLine.end = temp
        }

        leftToRight = !leftToRight
    })
}

const findClosestColumnToEnd = (shape: Shape, from: Intersections[], otherCols: Intersections[][]): ColIndexAndCorner | undefined => {
    const startIntersection = from[from.length - 1].end

    const fromSubpath = shape.pathParts[startIntersection!.segmentNumber].subPath

    let minDistance: number | undefined = undefined
    let cornerAtMinDistance = Corner.TOP_LEFT
    let colAtMinDistance = 0
    otherCols.forEach((otherCol, colIndex) => {
        const corners = getCornerPointsOfColumn(otherCol)
        corners.forEach((corner, cornerIndex) => {
            const toSubpath = shape.pathParts[corner.segmentNumber].subPath
            if (toSubpath === fromSubpath) {
                const dist = calculateDistanceBetweenIntersections(shape, startIntersection!, corner)
                if (minDistance) {
                    if (dist < minDistance) {
                        minDistance = dist
                        cornerAtMinDistance = cornerIndex
                        colAtMinDistance = colIndex
                    }
                } else {
                    minDistance = dist
                    cornerAtMinDistance = cornerIndex
                    colAtMinDistance = colIndex
                }
            }
        })
    })

    if (minDistance) {
        return { colIndex: colAtMinDistance, corner: cornerAtMinDistance }
    } else {
        return undefined
    }
}

/**
 * Returns the intersections at the start and end of the column.
 */
const getCornerPointsOfColumn = (col: Intersections[]): Intersection[] => {
    return [col[0].start, col[0].end, col[col.length - 1].start, col[col.length - 1].end]
}

const calculateDistanceBetweenIntersections = (shape: Shape, a: Intersection, b: Intersection): number => {
    const totalLen = shape.element.getTotalLength()

    const aDist = Lib.calculateDistanceAlongPath(shape, a)
    const bDist = Lib.calculateDistanceAlongPath(shape, b)

    const forwardDistance = calculateDistanceBetweenPointsOnPath(totalLen, aDist, bDist)
    const backwardDistance = calculateDistanceBetweenPointsOnPath(totalLen, bDist, aDist)

    return Math.min(forwardDistance, backwardDistance)
}

const calculateDistanceBetweenPointsOnPath = (totalLen: number, from: number, to: number): number => {
    if (from < to) {
        return to - from
    } else {
        return totalLen - from + to
    }
}

const assertUnreachable = (x: never): never => {
    throw new Error(`Didn't expect to get here for value ${x}`)
}
