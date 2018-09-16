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

        const stitchPoints = this.generateAllStitchPoints(element, scanLines)

        return stitchPoints
    }

    // TODO sew along edge between columns
    private generateAllStitchPoints(element: Snap.Element, scanLines: Line[][]): Coord[] {
        let allStitches: Coord[] = []
        let leftToRight = true
        const stitchLength = this.svgService.mmToViewBoxLength(StitchService.STITCH_LENGTH)
        const minStitchLength = this.svgService.mmToViewBoxLength(StitchService.MIN_STITCH_LENGTH)
        scanLines.forEach(columnOfLines => {
            columnOfLines.forEach(line => {
                const stitches = this.generateStitchPointsForLine(line, leftToRight, stitchLength, minStitchLength)
                if (stitches.length > 1) {
                    allStitches = allStitches.concat(stitches)
                }
                leftToRight = !leftToRight
            })
        })

        return allStitches
    }

    private generateStitchPointsForLine(line: Line, leftToRight: boolean, stitchLength: number, minStitchLength: number): Coord[] {
        const results: Coord[] = []

        const y = line.start.y

        if (line.end.x - line.start.x < stitchLength) {
            // There's not enough space for a standard width stitch so reduce the stitch length. This makes sure that
            // narrow sections like points get filled in
            if (line.end.x - line.start.x >= minStitchLength) {
                if (leftToRight) {
                    results.push({x: line.start.x, y: line.start.y})
                    results.push({x: line.end.x, y: line.end.y})
                } else {
                    results.push({x: line.end.x, y: line.end.y})
                    results.push({x: line.start.x, y: line.start.y})
                }
            }
        } else {
            if (leftToRight) {
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
    }
}
