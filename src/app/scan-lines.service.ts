import * as SnapCjs from 'snapsvg-cjs'
import {Injectable} from '@angular/core'
import * as Snap from "snapsvg"
import {IntersectionDot} from "snapsvg"
import {SvgService} from "./svg.service/svg.service"
import {Coord, Line} from "./svg.service/models"

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
     * This generates a series of horizontal lines that run the width of the shape.
     * @param start Coordinate from where we start generating scan line. Subsequent lines will have a greater Y value.
     * @param heightMM The distance between scan lines in user coordinates.
     * @param element The element for which we need to generate scan lines.
     * @param bbox Bounding box of the element. This is passed in to avoid recalculating it all over the place.
     */
    generateScanLines(start: Coord, heightMM: number, element: Snap.Element, bbox: Snap.BBox): Line[][] {

        const separation = this.calculateLineSeparation(element, bbox, heightMM)
        const elementPath = this.svgService.elementPathToElementCoords(element)

        const lines = this.generateFullWidthScanlines(start, separation, bbox)
            .map(scanLine => this.getIntersections(scanLine, heightMM, elementPath))
            .filter(intersections => intersections.length > 1)
            .map(this.toLines)

        const sortedLines = this.sortIntoColumns(lines)
        return this.svgService.elementToViewBoxCoords(element, sortedLines)
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
    private sortIntoColumns(lines: Line[][]): Line[][] {
        const results: Line[][] = []

        // Get the max number of columns across all the rows
        const maxColumns = lines
            .map(row => row.length)
            .reduce((maxColumns, length): number => {
                return length > maxColumns ? length : maxColumns
            }, 0)

        for (let col = 0; col < maxColumns; ++col) {
            // Move up a column. Push each line into an array until we reach the end of the column
            let column: Line[] = []
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
     * Generates scanlines that go from xmin to xmax across the width of the shape.
     */
    private generateFullWidthScanlines(start: Coord, separation: number, bbox: Snap.BBox): Line[] {
        const lines: Line[] = []
        for (let y = start.y; y <= bbox.y + bbox.height; y += separation) {
            const line = {
                start: {x: start.x - 1, y: y},
                end: {x: bbox.x + bbox.width + 1, y: y}
            }
            lines.push(line)
        }

        return lines
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
    private getIntersections(scanLine: Line, separation: number, elementPath: string): Array<IntersectionDot> {
        const originalY = scanLine.start.y
        const dy = -separation * 0.02
        // const dy = -separation * 1.234
        let intersections: IntersectionDot[]

        do {
            const scanLinePath = this.toPath(scanLine)
            intersections = SnapCjs.path.intersection(scanLinePath, elementPath)
            if (intersections.length % 2 !== 0) {
                scanLine.start.y += dy
                scanLine.end.y += dy
            }
        } while (intersections.length % 2 !== 0)

        // Reset the Y coord so that the intersections are at the correct height.
        intersections.forEach(intersection => intersection.y = originalY)

        // As we don't know the order in which the intersections will be returned, sort them by increasing x value
        intersections.sort((a, b) => a.x - b.x)

        return intersections
    }

    /**
     * Converts pairs of intersection points into lines. This assumes we've already made sure that we've got an even
     * number of intersections.
     */
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

    /**
     * Converts a line to an SVG path
     */
    private toPath(line: Line): string {
        return `M${line.start.x}, ${line.start.y} L${line.end.x}, ${line.end.y}`
    }
}
