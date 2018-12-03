import { Injectable, Renderer2 } from "@angular/core"
import * as svgIntersections from "svg-intersections"
import { Intersection, Intersections, Point, Shape } from "./models"
import * as Lib from "./lib/lib"

/**
 * This class is responsible for generate scan lines across an arbitrary shape.
 */
@Injectable({
    providedIn: "root"
})
export class ScanLineService {
    constructor() {}

    private readonly intersect = svgIntersections.intersect
    private readonly shape = svgIntersections.shape

    /**
     * This generates a series of horizontal lines that run the width of the shape. Each line is referred to as a scan line.
     * The scan lines are defined as parths so that in the future we can generalise this and make them curved paths etc.
     */
    generateScanLines(heightMM: number, shape: Shape, scaling: number, renderer: Renderer2, minStitchLength: number): Intersections[][] {
        const elementBBox = shape.element.getBBox()

        const scanLineSeparation = this.calculateLineSeparation(elementBBox, heightMM * scaling)

        const intersections = this.generateFullWidthScanLinePaths(scanLineSeparation, elementBBox)
            .map(path => this.stringToSVGElement(path, renderer, shape.element))
            .map(scanLine => this.getIntersectionRow(shape.element, scanLine, scanLineSeparation))
            .filter(intersectionRow => intersectionRow !== undefined)
            .map(intersectionRow => this.calculateDistancesAlongElementPath(shape, intersectionRow!))
            .map(intersectionRow => this.calculateDistancesAlongScanlinePath(intersectionRow))
            .map(intersectionRow => this.removeSmallStitches(intersectionRow!, minStitchLength))
            .filter(i => i.intersectionPoints.length > 0)

        return this.sortIntoColumns(intersections)
    }

    /**
     * If the start and end point are too close together remove them as we can't stitch them together
     */
    private removeSmallStitches(row: RowOfIntersections, minStitchLength: number): RowOfIntersections {
        row.intersectionPoints = row.intersectionPoints.filter(pair => Math.abs(pair.start.scanlineDistance - pair.end.scanlineDistance) >= minStitchLength)
        return row
    }

    /**
     * Converts the intersection coordinate into distance along the path. This is needed because when we stitch we navigate along the path using the getPointAtLength method rather
     * than the actually coords.
     */
    private calculateDistancesAlongElementPath = (shape: Shape, intersections: RowOfIntersections): RowOfIntersections => {
        intersections.intersectionPoints.forEach(pair => {
            this.calcuateDistanceAlongElementPath(shape, pair.start)
            this.calcuateDistanceAlongElementPath(shape, pair.end)
        })

        return intersections
    }

    private calcuateDistanceAlongElementPath(shape: Shape, intersection: Intersection) {
        const segmentNumber = Lib.findElementIndexForPoint(shape.pathParts.map(part => part.segment), intersection.point)
        intersection.segmentNumber = segmentNumber

        intersection.segmentTValue = Lib.calculateTValueForPoint(shape.pathParts[segmentNumber].segment, intersection.point)
    }

    private calculateDistancesAlongScanlinePath = (intersections: RowOfIntersections): RowOfIntersections => {
        intersections.intersectionPoints.forEach(pair => {
            pair.start.scanlineDistance = Lib.calculateTValueForPoint(intersections.scanline, pair.start.point) * intersections.scanline.getTotalLength()
            pair.end.scanlineDistance = Lib.calculateTValueForPoint(intersections.scanline, pair.end.point) * intersections.scanline.getTotalLength()
        })

        return intersections
    }

    private stringToSVGElement(path: string, renderer: Renderer2, parent: SVGPathElement): SVGPathElement {
        const element = renderer.createElement("path", "svg") as SVGPathElement
        element.setAttribute("d", path)
        renderer.appendChild(parent.parentNode, element)
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
    private sortIntoColumns(rowsOfIntersections: RowOfIntersections[]): Intersections[][] {
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
     * Adjusts the line seperation so that it fits evenly between the top and bottom of the space otherwise you can
     * get an gap on the top edge.
     */
    private calculateLineSeparation(bbox: DOMRect, height: number): number {
        const counts = Math.floor(bbox.height / height)
        return bbox.height / counts
    }

    /**
     * Generates paths that go from xmin to xmax across the width of the shape. We do this as a path rather than a line so that in the future we can generalise it
     * to use any path as a scanline
     */
    private generateFullWidthScanLinePaths(separation: number, bbox: DOMRect): string[] {
        const paths: string[] = []
        const startX = bbox.x
        const endX = bbox.x + bbox.width
        const numLines = bbox.height / separation + 1
        for (let i = 0; i < numLines; ++i) {
            const y = i * separation + bbox.y
            const line = `M${startX - 1},${y} L${endX + 1},${y}`
            paths.push(line)
        }

        return paths
    }

    /**
     * Calculates the intersection of a scanline and the shape we want to fill. If the shape has a horizontal line
     * exactly on the scan line, we can end up with an odd number of intersections due to rounding errors which means
     * we can't split the scan line into a number of lines. If we find we've got an odd number of intersections,
     * adjust the scanline a little and try again. Hopefully this will avoid it falling exactly on the horizontal
     * line of the shape.
     *
     * This can still have problems with weird intersections but these are harder to detect.
     */
    private getIntersectionRow(element: SVGPathElement, scanLine: SVGPathElement, separation: number): RowOfIntersections | undefined {
        const intersect = this.intersect(this.shape("path", { d: element.getAttribute("d") }), this.shape("path", { d: scanLine.getAttribute("d") })) as Intersect

        // TODO handle odd number of intersections and single intersection
        if (intersect.points.length % 2 !== 0) {
            console.log("TODO odd number of intersections")
            intersect.points = intersect.points.slice(0, intersect.points.length - 1)
        }

        if (intersect.points.length === 0) {
            return undefined
        }

        intersect.points = intersect.points.sort((p1, p2) => p1.x - p2.x)

        const intersections: IntersectionPair[] = []
        for (let i = 0; i < intersect.points.length; i += 2) {
            const start: Intersection = { point: intersect.points[i], scanlineDistance: -1, segmentNumber: -1, segmentTValue: -1 }
            const end: Intersection = { point: intersect.points[i + 1], scanlineDistance: -1, segmentNumber: -1, segmentTValue: -1 }
            intersections.push({ start: start, end: end })
        }

        return {
            intersectionPoints: intersections,
            scanline: scanLine
        }

        /*
        const dy = -separation * 0.01
        let intersections: IntersectionDot[]
        let originalY: number | undefined
        const originalPath = scanLinePath
        let offset = dy
        do {
            intersections = Path.intersection(element, scanLinePath)

            const matrix = SnapCjs.matrix() as Snap.Matrix
            if (intersections.length % 2 !== 0) {
                if (originalY === undefined) {
                    originalY = intersections[0].y
                }

                scanLinePath = (<string[]><any>Path.map(originalPath, matrix.translate(0, offset))).join()
                offset += dy
            }
        } while (intersections.length % 2 !== 0)

        // Reset the Y coord so that the intersections are at the correct height.
        if (originalY !== undefined) {
            intersections.forEach(intersection => intersection.y = originalY!)
            // const matrix = SnapCjs.matrix() as Snap.Matrix
            // scanLinePath = (<string[]><any>Path.map(scanLinePath, matrix.translate(0, -offset))).join()
        }

        // As we don't know the order in which the intersections will be returned, sort them by increasing x value. Not sure what will happen if we ever have a vertical
        // path of stitches
        intersections.sort((i1, i2) => i1.x - i2.x)

        return {intersections: intersections, scanLinePath: originalPath}*/
    }
}

interface Intersect {
    status: string
    points: Point[]
}

interface IntersectionPair {
    start: Intersection
    end: Intersection
}

interface RowOfIntersections {
    intersectionPoints: IntersectionPair[]
    scanline: SVGPathElement
}
