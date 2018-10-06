import * as Snap from 'snapsvg'
import {Injectable} from '@angular/core'
import {SvgService} from "./svg.service/svg.service"
import {ScanLinesService} from "./scan-lines.service"
import {SatinFillType} from "./models"
import {Coord, Line} from "./svg.service/models"

/**
 * This class generates stitches for elements acccording to the specified style, fill type etc. It just returns
 * stitches without attempting to draw them or store them.
 */
@Injectable({
    providedIn: 'root'
})
export class StitchService {

    private static readonly ROW_HEIGHT = 0.4
    private static readonly STITCH_LENGTH = 3.5
    private static readonly MIN_STITCH_LENGTH = 1.5

    constructor(private svgService: SvgService,
                private scanLineService: ScanLinesService) {
    }


    fill(element: Snap.Element, type: SatinFillType): Coord[] {
        if (type === SatinFillType.None) {
            return []
        }

        // TODO support more than paths
        if (element.type !== 'path') {
            throw new Error(`Elements of type ${element.type} are not supported`)
        }

        this.closePath(element)

        const bbox = element.getBBox()
        const scanLines = this.scanLineService.generateScanLines({
            x: bbox.x,
            y: bbox.y
        }, StitchService.ROW_HEIGHT, element, bbox)

        const stitches = this.generateStitches(element, scanLines)

        console.log("Num stitches =", stitches.length)
        return stitches
    }

    private generateStitches(element: Snap.Element, scanLines: Line[][]): Coord[] {
        let allStitches: Coord[] = []
        const stitchLength = this.svgService.mmToViewBoxLength(StitchService.STITCH_LENGTH)
        const minStitchLength = this.svgService.mmToViewBoxLength(StitchService.MIN_STITCH_LENGTH)

        let previousColumnStitches: Coord[] | undefined = undefined
        scanLines.forEach(columnOfLines => {

            let columnStitches: Coord[] = []
            columnStitches = this.generateStitchesForColumn(columnOfLines, stitchLength, minStitchLength, columnStitches)

            // Generate stitches from the end of the last column to the start of this column
            if (previousColumnStitches !== undefined && previousColumnStitches!.length > 0  && columnStitches.length > 0) {
                const joinStitches = this.generateStitchesAlongPath(element, previousColumnStitches[previousColumnStitches!.length - 1], columnStitches[0], stitchLength, minStitchLength)
                if (joinStitches.length > 0) {
                    console.log("join stitches:", joinStitches.length)
                    allStitches = allStitches.concat(joinStitches)
                }
            }

            if (columnStitches.length > 0) {
                previousColumnStitches = columnStitches
            }

            allStitches = allStitches.concat(columnStitches)
        })

        return allStitches
    }

    /**
     * Generates stitches for a single column of scan lines.
     */
    private generateStitchesForColumn(columnOfLines: Line[], stitchLength: number, minStitchLength: number, columnStitches: Coord[]) {
        let forwards = true
        columnOfLines.forEach((line) => {
            // Generate stitches along the scan line
            const stitches = this.generateStitchesBetweenPoints(line.start, line.end, forwards, stitchLength, minStitchLength)

            if (stitches.length > 0) {
                columnStitches = columnStitches.concat(stitches)
            }

            forwards = !forwards
        })

        return columnStitches
    }

    /**
     * Generates stitches along the edge of the element between the two coorinates. If the points are close enough together not to need intermediate stitches then it returns an
     * empty array.
     */
    private generateStitchesAlongPath(element: Snap.Element, from: Coord, to: Coord, stitchLength: number, minStitchLength: number): Coord[] {
        /*
        const fromDistance = SnapCjs.closestPoint(element, from.x, from.y).length
        const toDistance = SnapCjs.closestPoint(element, to.x, to.y).length

        // TODO Work out which way around the path is the shortest distance
        const distance = Math.abs(toDistance - fromDistance)
        const numStitches = Math.round(distance / stitchLength)
        const actualStitchLength = distance / numStitches

        const path = SnapCjs.path as Snap.Path
        const pathStr = element.attr("d")
        const stitches: Coord[] = []
        for (let i = 0; i < numStitches; ++i) {
            const stitch = path.getPointAtLength(pathStr, fromDistance + i * actualStitchLength) as Coord
            stitches.push({x: stitch.x, y: stitch.y})
        }

        // Remove the first and last stitches as they are already included in the start and end points passed in
        return stitches.slice(1, stitches.length - 1)*/

        this.svgService.distanceAlongPath(element, from)

        return []
    }

    /**
     * Make's sure that the path is closed otherwise it can't be filled properly
     */
    private closePath(element: Snap.Element) {
        const path = element.attr("d").trim()
        if (!path.endsWith("Z") && !path.endsWith("z")) {
            element.attr(({d: path + "Z"}))
        }
    }

    /**
     * Generates stitches between any two points. It will generate stitches all of the same length.
     * @param start Start point of stitches
     * @param end End point of stitches
     * @param forwards Whether we stitch start to end or end to start
     * @param stitchLength Length of stitches
     * @param minStitchLength Stitch length can be reduced to this size for small lines.
     */
    private generateStitchesBetweenPoints(start: Coord, end: Coord, forwards: boolean, stitchLength: number, minStitchLength: number): Coord[] {
        const results: Coord[] = []

        if (!forwards) {
            const temp = end
            end = start
            start = temp
        }

        const totalLength = this.getCoordDistance(start, end)

        const numStitches = Math.floor(totalLength / stitchLength)
        if (numStitches < 1) {
            if (totalLength >= minStitchLength) {
                results.push(start)
                results.push(end)
            }
        } else {
            const xlength = (end.x - start.x) / numStitches
            const ylength = (end.y - start.y) / numStitches

            // We add 1 to the number of stitches as we need a stitch at the end point
            for (let i = 0; i <= numStitches; ++i) {
                results.push({x: xlength * i + start.x, y: ylength * i + start.y})
            }
        }

        return results
    }

    /**
     * Returns distance between two coordinates
     */
    private getCoordDistance(a: Coord, b: Coord): number {
        const x = a.x - b.x
        const y = a.y - b.y
        return Math.sqrt(x * x + y * y)
    }
}
