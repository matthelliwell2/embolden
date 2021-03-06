import * as svgIntersections from "svg-intersections"
import { Intersection, Intersections, Point, Shape } from "../../models"
import * as Lib from "../../lib/lib"
import { Renderer2 } from "@angular/core"

const intersect = svgIntersections.intersect
const intersectShape = svgIntersections.selectedShape

/**
 * This generates a series of horizontal lines that run the width of the shape. Each line is referred to as a scan line.
 * The scan lines are defined as parths so that in the future we can generalise this and make them curved paths etc.
 */
export const generateScanLines = (shape: Shape, heightMM: number, minStitchLengthMM: number, scaling: number, renderer: Renderer2): Intersections[][] => {
    const elementBBox = shape.element.getBBox()
    const minStitchLength = minStitchLengthMM * scaling

    const intersections = generateFullWidthScanLinePaths(heightMM * scaling, elementBBox)
        .map(path => stringToSVGElement(path, renderer))
        .map(scanLine => getIntersections(shape, scanLine))
        .filter(intersections => intersections.length > 1)
        .map(intersections => calculateDistancesAlongScanlinePath(intersections))
        .map(sortIntersections)
        .map(intersections => calculateDistancesAlongElementPath(shape, intersections))
        .map(intersections => dealWithSpikyBits(shape, intersections))
        .filter(intersections => intersections.length > 1)
        .map(toRowOfIntersections)
        .map(intersections => removeSmallStitches(intersections, minStitchLength))
        .filter(i => i.intersectionPoints.length > 0)

    return sortIntoColumns(intersections)
}

/**
 *  Some intersections may be on the vertex of a concave part of the path. Therefore if we just sewed from one of these point we would end up
 *  sewing outside the shape. To deal with this, we check around the intersection point and see if it is inside or outside the shape.
 */
const dealWithSpikyBits = (shape: Shape, intersections: (Intersection & { scanLine: SVGPathElement })[]): (Intersection & { scanLine: SVGPathElement })[] => {
    let prevPointInsideShape = false
    const results = [] as (Intersection & { scanLine: SVGPathElement })[]

    const shapeElement = (shape.element as unknown) as SVGGeometryElement
    intersections.forEach((intersection, i) => {
        const point = intersection.scanLine.getPointAtLength(intersection.scanlineDistance + 1)
        const newPointInsideShape = shapeElement.isPointInFill(point)
        if (i === 0) {
            prevPointInsideShape = newPointInsideShape
            if (newPointInsideShape) {
                results.push(intersection)
            }
        } else {
            if (prevPointInsideShape !== newPointInsideShape) {
                results.push(intersection)
            }

            prevPointInsideShape = newPointInsideShape
        }
    })

    return results
}

/**
 * Takes an array of intersections and pairs them up to form lines
 * @param intersects
 */
const toRowOfIntersections = (intersects: (Intersection & { scanLine: SVGPathElement })[]): RowOfIntersections => {
    const pairs: IntersectionPair[] = []
    for (let i = 0; i < intersects.length; i += 2) {
        const start = toIntersection(intersects[i])
        const end = toIntersection(intersects[i + 1])
        pairs.push({ start: start, end: end })
    }

    return {
        intersectionPoints: pairs,
        scanline: intersects[0].scanLine // These should all be for the same scanline
    }
}

const toIntersection = (intersection: Intersection): Intersection => {
    return {
        point: intersection.point,
        scanlineDistance: intersection.scanlineDistance,
        segmentNumber: intersection.segmentNumber,
        segmentTValue: intersection.segmentTValue
    }
}

/**
 * If the start and end point are too close together remove them as we can't stitch them together
 */
const removeSmallStitches = (row: RowOfIntersections, minStitchLength: number): RowOfIntersections => {
    row.intersectionPoints = row.intersectionPoints.filter(pair => Math.abs(pair.start.scanlineDistance - pair.end.scanlineDistance) >= minStitchLength)
    return row
}

/**
 *  Adds the T value for the intersection point  and the segment of the path to the structure
 */
const calculateDistancesAlongElementPath = (
    shape: Shape,
    intersections: { point: Point; segmentNumber: number; scanLine: SVGPathElement; scanlineDistance: number }[]
): (Intersection & { scanLine: SVGPathElement })[] => {
    return intersections.map(i => {
        return { segmentTValue: Lib.calculateTValueForPoint(shape.pathParts[i.segmentNumber].segment, i.point), ...i }
    })
}

/**
 *  Adds the distance along the scanline path of the intersect to the structure
 */
const calculateDistancesAlongScanlinePath = (
    intersections: { point: Point; segmentNumber: number; scanLine: SVGPathElement }[]
): { point: Point; segmentNumber: number; scanLine: SVGPathElement; scanlineDistance: number }[] => {
    return intersections.map(i => {
        return { scanlineDistance: Lib.calculateTValueForPoint(i.scanLine, i.point) * i.scanLine.getTotalLength(), ...i }
    })
}

const stringToSVGElement = (path: string, renderer: Renderer2): SVGPathElement => {
    const element = renderer.createElement("path", "svg") as SVGPathElement
    element.setAttribute("d", path)
    element.setAttribute("class", "scanline")
    return element
}

/**
 * The lines are initially generated a row at a time. To make them easier to stitch in order we want to organise them
 * by columns that can be stitched and before moving to another column. eg scanlines like this
 *
 * -------------------------------------------
 * -------------------------------------------
 * -------------            ------------------
 * -------------            ------------------
 * -------------            ------------------
 *
 * would be grouped together like
 *
 * AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
 * AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
 * BBBBBBBBBBBBB            CCCCCCCCCCCCCCCCCC
 * BBBBBBBBBBBBB            CCCCCCCCCCCCCCCCCC
 * BBBBBBBBBBBBB            CCCCCCCCCCCCCCCCCC
 *
 *  giving intersections like
 * AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
 * AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
 * BBBBBBBBBBBBB
 * BBBBBBBBBBBBB
 * BBBBBBBBBBBBB
 * CCCCCCCCCCCCCCCCCC
 * CCCCCCCCCCCCCCCCCC
 * CCCCCCCCCCCCCCCCCC
 */
const sortIntoColumns = (rowsOfIntersections: RowOfIntersections[]): Intersections[][] => {
    const results: Intersections[][] = []

    // Get the max number of columns across all the rows
    const maxColumns = rowsOfIntersections
        .map(row => row.intersectionPoints.length)
        .reduce((maxColumns, length): number => {
            return length > maxColumns ? length : maxColumns
        }, 0)

    for (let col = 0; col < maxColumns; ++col) {
        // Accumulate intersections into a column. We will start a new column when the count of columns changes
        let column: Intersections[] = []
        rowsOfIntersections.forEach((row, i) => {
            // We've got some intersections so store them into the collection of rows for the current column
            if (row.intersectionPoints[col]) {
                const pair = row.intersectionPoints[col]
                column.push({ start: pair.start, end: pair.end, scanline: row.scanline })
            }

            // We need to start storing into a new column if this column has finished or the next row has a different number of columns
            const currentColCount = row.intersectionPoints.length
            const nextColCount = rowsOfIntersections[i + 1] ? rowsOfIntersections[i + 1].intersectionPoints.length : 0
            if (!row.intersectionPoints[col] || currentColCount !== nextColCount) {
                if (column.length > 0) {
                    results.push(column)
                    column = []
                }
            }
        })

        // We're starting a new column so push any results that haven't been stored so far.
        if (column.length > 0) {
            results.push(column)
        }
    }

    return results
}

/**
 * Generates paths that go from xmin to xmax across the width of the shape. We do this as a path rather than a line so that in the future we can generalise it
 * to use any path as a scanline
 */
const generateFullWidthScanLinePaths = (separation: number, bbox: DOMRect): string[] => {
    const paths: string[] = []
    const startX = bbox.x
    const endX = bbox.x + bbox.width

    // We want the scanlines to be horizontally aligned across all shapes so adjust the first scanline position
    const startY = Math.floor(bbox.y / separation) * separation
    const numLines = (bbox.height + bbox.y - startY) / separation + 1
    for (let i = 0; i < numLines; ++i) {
        const y = i * separation + startY
        const line = `M${startX - 1},${y} L${endX + 1},${y}`
        paths.push(line)
    }

    return paths
}

/**
 * Sorts an array of intersections of that they are in order along the scan lines. This ensures that we sew between successive points
 * and not jump around at random along the scanline
 */
const sortIntersections = (
    intersects: { point: Point; segmentNumber: number; scanLine: SVGPathElement; scanlineDistance: number }[]
): { point: Point; segmentNumber: number; scanLine: SVGPathElement; scanlineDistance: number }[] => {
    return intersects.sort((i1, i2) => i1.scanlineDistance - i2.scanlineDistance)
}

/**
 * Calculates the intersection of a scanline and the shape we want to fill. Includes the segment number of where the intersect lies on the
 * shape path as we need that in later calculations.
 */
const getIntersections = (shape: Shape, scanLine: SVGPathElement): { point: Point; segmentNumber: number; scanLine: SVGPathElement }[] => {
    type Intersect = {
        status: string
        points: Point[]
    }

    return (
        shape.pathParts
            .map(part => part.segment)
            .map((segment, i) => {
                // Find the intersection between the path segment and the scanline. This lets us track the segment number of the intersection.
                const result = intersect(intersectShape("path", { d: segment.getAttribute("d") }), intersectShape("path", { d: scanLine.getAttribute("d") })) as Intersect
                return { points: result.points, segmentNumber: i }
            })

            // If we didn't get any intersections, throw away the results
            .filter(intersect => intersect.points.length > 0)

            // Flatten the arrays of points in a single array of points, each with the segment number
            .reduce(
                (acc, intersect) => {
                    intersect.points.forEach(point => acc.push({ point: point, segmentNumber: intersect.segmentNumber }))
                    return acc
                },
                [] as { point: Point; segmentNumber: number }[]
            )
            .map(intersect => {
                return { point: intersect.point, segmentNumber: intersect.segmentNumber, scanLine: scanLine }
            })
    )
}

interface IntersectionPair {
    start: Intersection
    end: Intersection
}

interface RowOfIntersections {
    intersectionPoints: IntersectionPair[]
    scanline: SVGPathElement
}
