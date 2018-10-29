import * as SnapCjs from 'snapsvg-cjs'
import {Injectable} from '@angular/core'
import * as Snap from "snapsvg"
import {IntersectionDot} from "snapsvg"
import {SvgService} from "./svg.service/svg.service"
import {Intersection, ScanLine} from "./svg.service/models"

const Path = SnapCjs.path as Snap.Path

interface IntersectionsWithScanLine {
    intersections: Snap.IntersectionDot[]
    scanLinePath: string
}


/**
 * This class is responsible for generate scan lines across an arbitrary shape. Internally it works with element
 * coordinates. However all values returned will be in user coordinates.
 */
@Injectable({
    providedIn: 'root'
})
export class ScanLinesService {

    constructor(private svgService: SvgService) {
    }

    /**
     * This generates a series of horizontal lines that run the width of the shape. Each line is referred to as a scan line.
     * The scan lines are defined as parths so that in the future we can generalise this and make them curved paths etc.
     * @param heightMM The distance between scan lines in user coordinates.
     * @param element The element for which we need to generate scan lines.
     */
    generateScanLines(heightMM: number, element: Snap.Element): ScanLine[][] {

        // Use viewbox coords everywhere to avoid problems apply transforms further down the line
        const elementPath = this.svgService.elementPathToViewBoxCoords(element)
        const elementBBox = Path.getBBox(elementPath)

        const scanLineSeparation = this.calculateLineSeparation(elementBBox, heightMM)

        const elementSegments = this.getPathSegments(elementPath)
        const elementSegmentLengths = elementSegments.map(seg => Path.getTotalLength(seg.join()))
        const lengthsToEndOfElementSegments = elementSegmentLengths.map((len, i) => {
            if (i > 0) {
                return len + elementSegmentLengths[i - i]
            } else {
                return len
            }
        })

        const intersections = this.generateFullWidthScanPaths(scanLineSeparation, elementBBox)
            .map(scanLinePath => this.getIntersections(elementPath, scanLinePath, scanLineSeparation))
            .filter(intersections => intersections.intersections.length > 1)
            .map(intersections => this.patchTValues(elementSegments, elementSegmentLengths, intersections))
            .map(intersections => this.toScanLines(intersections, elementSegmentLengths, lengthsToEndOfElementSegments))

        return this.sortIntoColumns(intersections)
    }

    private getPathSegments(path: string): string[][] {
        const matrix = SnapCjs.matrix() as Snap.Matrix

        // This actually returns an array of segments. Each segment is an array of strings and each string is part of a command
        const segments = (<string[][]><any>Path.map(path, matrix))
            segments.forEach((segment, i) => {
                if (segment[0] === "C") {
                    segments[i] = ['M', segment[1], segment[2], ...segment]
                }
            })

        return segments
    }

    /**
     * The T values in the IntersectionDot class are meant to be the proportion of the way along the segment length where the intersection occurs. Howver due to the
     * nature of cubic bezier curves these t values are only approximate. We need accurate values to allow us to stitch along a path. This value calculates the T values
     * accurately.
     */
    private patchTValues(elementPathSegments: string[][], elementSegmentLengths: number[], intersections: IntersectionsWithScanLine): IntersectionsWithScanLine {

        const scanlinePathSegments = this.getPathSegments(intersections.scanLinePath)
        const scanLinePathSegmentsLengths = scanlinePathSegments.map(seg => Path.getTotalLength(seg.join()))

        intersections.intersections.forEach(inter => {
            inter.t1 = this.findTValueOfPoint(elementSegmentLengths[inter.segment1], elementPathSegments[inter.segment1], inter.x, inter.y)
            inter.t2 = this.findTValueOfPoint(scanLinePathSegmentsLengths[inter.segment2], scanlinePathSegments[inter.segment2], inter.x, inter.y)
        })

        return intersections
    }

    private findTValueOfPoint(pathLength: number, path: string[], x: number, y: number): number {
        const len = this.findLengthAlongPathOfPoint(path, x, y, 0, pathLength)

        return len / pathLength
    }

    private findLengthAlongPathOfPoint(path: string[], x: number, y: number, startLength: number, endLength: number): number {
        const midLength = (endLength + startLength) / 2
        if (this.pointIsBetween(x, y, path, startLength, midLength)) {
            // If the path length is short enough then we are close enough to the point
            // TODO define precision we need
            if (midLength - startLength < 0.01) {
                return startLength + (midLength - startLength) / 2
            } else {
                return  this.findLengthAlongPathOfPoint(path, x, y, startLength, midLength)
            }
        } else {
            if (endLength - midLength < 0.01) {
                return midLength + (endLength - midLength) / 2
            } else {
                return this.findLengthAlongPathOfPoint(path, x, y, midLength, endLength)
            }
        }
    }

    /**
     * Are the given x and y coords between the start and end coords on the path
     */
    private pointIsBetween(x: number, y: number, path: string[], start: number, end: number): boolean {
        const subpath = Path.getSubpath(path.join(), start, end)
        const bbox = Path.getBBox(subpath)

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
        return Path.isPointInsideBBox(bbox, x, y)
    }

    /**
     * This takes a series of intersections and converts them to scan lines. It assumes that sequential pairs of intersections form a scan line.
     */
    private toScanLines(intersections: IntersectionsWithScanLine, elementSegmentLengths: number[], lengthsToEndOfElementSegments: number[]): ScanLine[] {
        const result: ScanLine[] = []
        for (let i = 0; i < intersections.intersections.length; i += 2) {
            result.push(this.toScanLine(intersections.intersections[i], intersections.intersections[i + 1], intersections.scanLinePath, elementSegmentLengths, lengthsToEndOfElementSegments))
        }

        return result
    }

    /**
     * This takes a pair of intersections and creates a scanline between the two of them. In the IntersectionDot t1/segment1 refers to the element and t2/segment2 refers to the
     * scanline. This is due to passing the element as the first argument to Path.Intersection when we calculated the intersection points.
     */
    private toScanLine(start: Snap.IntersectionDot, end: Snap.IntersectionDot, scanLinePath: string, elementSegmentLengths: number[], lengthsToEndOfElementSegments: number[]): ScanLine {
        return {
            scanLinePath: scanLinePath,
            start: this.newIntersection(start, elementSegmentLengths, lengthsToEndOfElementSegments, scanLinePath),
            end: this.newIntersection(end, elementSegmentLengths, lengthsToEndOfElementSegments, scanLinePath),
        }
    }

    /**
     * Returns an Intersection object. This is just an intersection point with some additional info about path distances that will make it easier to traverse between the
     * intersection points we are trying to add stitches.
     */
    private newIntersection(intersectionDot: Snap.IntersectionDot, elementSegmentLengths: number[], lengthsToEndOfElementSegments: number[], scanLinePath: string): Intersection {

        const scanlinePathSegments = this.getPathSegments(scanLinePath)
        const scanLinePathSegmentsLengths = scanlinePathSegments.map(seg => Path.getTotalLength(seg.join()))
        const lengthsToEndOfScanLineSegments = scanLinePathSegmentsLengths.map((len, i) => {
            if (i > 0) {
                return len + scanLinePathSegmentsLengths[i - i]
            } else {
                return len
            }
        })


        return {
            point: {x: intersectionDot.x, y: intersectionDot.y},
            distanceAlongElementPath: lengthsToEndOfElementSegments[intersectionDot.segment1 - 1] + elementSegmentLengths[intersectionDot.segment1] * intersectionDot.t1,

            // TODO use the scanlinepath segments array calculated in PatchTValues so it works with complex scanline paths
            // distanceAlongScanLinePath: Path.getTotalLength(scanLinePath) * intersectionDot.t2
            distanceAlongScanLinePath: lengthsToEndOfScanLineSegments[intersectionDot.segment2 - 1] + scanLinePathSegmentsLengths[intersectionDot.segment2] * intersectionDot.t2,
        }
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
     * would be split grouped together like
     *
     * AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
     * AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
     * AAAAAAAAAAAAA            BBBBBBBBBBBBBBBBBB
     * AAAAAAAAAAAAA            BBBBBBBBBBBBBBBBBB
     * AAAAAAAAAAAAA            BBBBBBBBBBBBBBBBBB
     *
     * We do this in multiple passes because trying to do it in a single pass is a bit quicker but much harder to
     * understand.
     */
    private sortIntoColumns(lines: ScanLine[][]): ScanLine[][] {
        const results: ScanLine[][] = []

        // Get the max number of columns across all the rows
        const maxColumns = lines
            .map(row => row.length)
            .reduce((maxColumns, length): number => {
                return length > maxColumns ? length : maxColumns
            }, 0)

        for (let col = 0; col < maxColumns; ++col) {
            // Move up a column. Push each line into an array until we reach the end of the column
            let column: ScanLine[] = []
            lines.forEach(row => {
                if (row[col] === undefined) {
                    if (column.length > 0) {
                        results.push(column)
                        column = []
                    }
                } else {
                    column.push(row[col])
                }
            })

            if (column.length > 0) {
                results.push(column)
            }
        }

        return results
    }

    /**
     * Adjusts the line seperation so that it fits evenly between the top and bottom of the space otherwise you can
     * get an gap on the top edge.
     * TODO this isn't quite right? - check it covers whole of element. Always need a scanline at the top and bottom
     * TODO calculate separation outside loop
     */
    private calculateLineSeparation(bbox: Snap.BBox, heightMM: number): number {
        const seperation = this.svgService.mmToViewBoxLength(heightMM)
        const numLines = Math.floor(bbox.height / seperation)
        return bbox.height / numLines
    }

    /**
     * Generates paths that go from xmin to xmax across the width of the shape.
     */
    private generateFullWidthScanPaths(separation: number, bbox: Snap.BBox): string[] {
        const paths: string[] = []
        for (let y = bbox.y; y <= bbox.y + bbox.height; y += separation) {
            const line = `M${bbox.x - 1},${y} L${bbox.x + bbox.width + 1},${y}`
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
    private getIntersections(elementPath: string, scanLinePath: string, separation: number): IntersectionsWithScanLine {
        const dy = -separation * 0.01
        let intersections: IntersectionDot[]
        let originalY: number | undefined
        const originalPath = scanLinePath
        let offset = dy
        do {
            intersections = Path.intersection(elementPath, scanLinePath)

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

        return {intersections: intersections, scanLinePath: originalPath}
    }
}
