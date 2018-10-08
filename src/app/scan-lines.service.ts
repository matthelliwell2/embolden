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
     * @param bbox Bounding box of the element. This is passed in to avoid recalculating it all over the place.
     */
    generateScanLines(heightMM: number, element: Snap.Element, bbox: Snap.BBox): ScanLine[][] {

        const separation = this.calculateLineSeparation(element, bbox, heightMM)
        const elementPath = this.svgService.elementPathToElementCoords(element)
        const lengthsToEndOfSegments = this.getLengthsToEndOfSegments(element)

        const intersections = this.generateFullWidthScanPaths(separation, bbox)
            .map(scanLinePath => this.getIntersections(elementPath, scanLinePath, heightMM))
            .filter(intersections => intersections.intersections.length > 1)
            .map(intersections => this.toScanLines(intersections, lengthsToEndOfSegments))

        console.log("intersections", intersections)

        const sortedLines = this.sortIntoColumns(intersections)
        return this.svgService.elementToViewBoxCoords(element, sortedLines)
    }

    /**
     * This takes a series of intersections and converts them to scan lines. It assumes that sequential pairs of intersections form a scan line.
     */
    private toScanLines(intersections: IntersectionsWithScanLine, lengthsToEndOfSegments: number[]): ScanLine[] {
        const result: ScanLine[] = []
        for (let i = 0; i < intersections.intersections.length; i += 2) {
            result.push(this.toScanLine(intersections.intersections[i], intersections.intersections[i + 1], intersections.scanLinePath, lengthsToEndOfSegments))
        }

        return result
    }

    /**
     * This takes a pair of intersections and creates a scanline between the two of them. In the IntersectionDot t1/segment1 refers to the element and t2/segment2 refers to the
     * scanline. This is due to passing the element as the first argument to Path.Intersection when we calculated the intersection points.
     */
    private toScanLine(start: Snap.IntersectionDot, end: Snap.IntersectionDot, scanLinePath: string, lengthsToEndOfSegments: number[]): ScanLine {
        return {
            scanLinePath: scanLinePath,
            start: this.getIntersection(start, lengthsToEndOfSegments, scanLinePath),
            end: this.getIntersection(end, lengthsToEndOfSegments, scanLinePath),
        }
    }

    /**
     * Returns an Intersection object. This is just an intersection point with some additional info about path distances that will make it easier to traverse between the
     * intersection points we are trying to add stitches.
     */
    private getIntersection(intersectionDot: Snap.IntersectionDot, lengthsToEndOfSegments: number[], scanLinePath: string): Intersection {
        return {
            point: {x: intersectionDot.x, y: intersectionDot.y},
            distanceAlongElementPath: lengthsToEndOfSegments[intersectionDot.segment1 - 1] + this.segmentLength(lengthsToEndOfSegments, intersectionDot.segment1) * intersectionDot.t1,
            distanceAlongScanLinePath: Path.getTotalLength(scanLinePath) * intersectionDot.t2
        }
    }

    /**
     * Returns the length of an individual segment of a path given the incremental lengths of the path segments.
     */
    private segmentLength(lengthsToEndOfSegments: number[], index: number): number {
        return lengthsToEndOfSegments[index] - lengthsToEndOfSegments[index - 1]
    }

    /**
     * This calculates the length from the start of the path to the end of each segment in a path. It is used to calculate the length along the element path of an intersection point.
     */
    private getLengthsToEndOfSegments(element: Snap.Element): number[] {
        const matrix = SnapCjs.matrix() as Snap.Matrix

        // Applying a null transform returns an array of path segments, not a string as the docs say
        const segments = <string[]><any>Path.map(element.attr("d"), matrix)

        // This will give us the length along the path from the path start to the end of the segment
        let segmentFromPathStart = ""
        return segments.map((seg) => {

            // We can get a length from path start to the end of the current segment
            segmentFromPathStart += seg
            return Path.getTotalLength(segmentFromPathStart)
        })
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
     */
    private calculateLineSeparation(element: Snap.Element, bbox: Snap.BBox, heightMM: number): number {
        const seperation = this.svgService.mmToElementLength(element, heightMM)
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

        let offset = dy
        do {
            intersections = Path.intersection(elementPath, scanLinePath)
            const matrix = SnapCjs.matrix() as Snap.Matrix
            if (intersections.length % 2 !== 0) {
                Path.map(scanLinePath, matrix.translate(0, offset))
                offset += dy
            }
        } while (intersections.length % 2 !== 0)

        // Reset the Y coord so that the intersections are at the correct height.
        // intersections.forEach(intersection => intersection.y = originalY)

        // As we don't know the order in which the intersections will be returned, sort them by increasing x value. Not sure what will happen if we ever have a vertical
        // path of stitches
        intersections.sort((i1, i2) => i1.x - i2.x)

        return {intersections: intersections, scanLinePath: scanLinePath}
    }

    /**
     * Converts pairs of intersection points into lines. This assumes we've already made sure that we've got an even
     * number of intersections.
     */
    /*
        private toLines(intersections: IntersectionDot[]): Line[] {
            const result: Line[] = []
            for (let i = 0; i < intersections.length; i += 2) {
                result.push({
                    start: {x: intersections[i].x, y: intersections[i].y},
                    end: {x: intersections[i + 1].x, y: intersections[i + 1].y}
                })
            }

            return result
        }
    */
}
