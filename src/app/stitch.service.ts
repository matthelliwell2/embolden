import * as Snap from 'snapsvg'
import {Injectable} from '@angular/core'
import {Coord, Line, SvgService} from "./svg.service"
import {ScanLinesService} from "./scan-lines.service"
import {FillType} from "./models"

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


    fill(element: Snap.Element, type: FillType): Coord[] {
        if (type === FillType.NONE) {
            return []
        }

        if (element.type !== 'path') {
            throw new Error(`Elements of type ${element.type} are not supported`)
        }

        const bbox = element.getBBox()
        const scanLines = this.scanLineService.generateScanLines({x: bbox.x, y: bbox.y}, StitchService.ROW_HEIGHT, element, bbox)

        const stitchPoints = this.generateAllStitchPoints(scanLines)

        return stitchPoints
    }

    // TODO sew along edge between columns
    private generateAllStitchPoints(scanLines: Line[][]): Coord[] {
        let allStitches: Coord[] = []
        let forwards = true
        const stitchLength = this.svgService.mmToViewBoxLength(StitchService.STITCH_LENGTH)
        const minStitchLength = this.svgService.mmToViewBoxLength(StitchService.MIN_STITCH_LENGTH)
        scanLines.forEach(columnOfLines => {
            columnOfLines.forEach((line, i, lines) => {
                // const stitches = this.generateStitchPointsForLine(line, forwards, stitchLength, minStitchLength)

                // Generate stitches along the scan line
                const stitches = this.generateStitchesBetweenPoints(line.start, line.end, forwards, stitchLength, minStitchLength)
                if (stitches.length > 0) {
                    allStitches = allStitches.concat(stitches)
                }

/*                const nextLine = lines[i + 1]
                if (nextLine !== undefined) {
                    // We've got another line to do after this one so make sure we stitch between them. If they are widely
                    // separated horizontally then we'll need to add some stitches between them
                    let joiningStitches: Coord[]
                    if (forwards) {
                        joiningStitches = this.generateStitchesBetweenPoints(line.end, nextLine.end, true, stitchLength, minStitchLength)
                    } else {
                        joiningStitches = this.generateStitchesBetweenPoints(line.start, nextLine.start, true, stitchLength, minStitchLength)
                    }

                    // We don't need to include the first and last stitches as these are the ends of the scan lines so will
                    // already have stitches defined for them
                    joiningStitches = joiningStitches.slice(1, joiningStitches.length - 1)
                    if (joiningStitches !== undefined) {
                        allStitches.push(... joiningStitches)
                    }
                }*/

                forwards = !forwards
            })
        })

        return allStitches
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
            const xlength = (end.x - start.x)/numStitches
            const ylength = (end.y - start.y)/numStitches

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

/*    private generateStitchPointsForLine(line: Line, forwards: boolean, stitchLength: number, minStitchLength: number): Coord[] {
        const results: Coord[] = []

        const y = line.start.y

        if (line.end.x - line.start.x < stitchLength) {
            // There's not enough space for a standard width stitch so reduce the stitch length. This makes sure that
            // narrow sections like points get filled in
            if (line.end.x - line.start.x >= minStitchLength) {
                if (forwards) {
                    results.push({x: line.start.x, y: line.start.y})
                    results.push({x: line.end.x, y: line.end.y})
                } else {
                    results.push({x: line.end.x, y: line.end.y})
                    results.push({x: line.start.x, y: line.start.y})
                }
            }
        } else {
            if (forwards) {
                for (let x = line.start.x; x <= line.end.x; x += stitchLength) {
                    results.push({x: x, y: y})
                }
            } else {
                for (let x = line.end.x; x >= line.start.x; x -= stitchLength) {
                    results.push({x: x, y: y})
                }
            }
        }

        return results
    }*/
}
