import { Injectable, Renderer2 } from "@angular/core"
import { ScanLineService } from "./scan-line.service"
import { SatinFillType, Shape } from "./models"
import { Coord } from "./svg.service/models"

/**
 * This class generates stitches for elements acccording to the specified style, fill type etc. It just returns
 * stitches without attempting to draw them or store them.
 */
@Injectable({
    providedIn: "root"
})
export class StitchService {
    private static readonly ROW_HEIGHT = 0.4
    // private static readonly STITCH_LENGTH = 3.5
    // private static readonly MIN_STITCH_LENGTH = 1.5

    constructor(private scanLineService: ScanLineService) {}

    fill(shape: Shape, scaling: number, renderer: Renderer2): Coord[] {
        if (shape.fillType === SatinFillType.None) {
            return []
        }

        this.closePath(shape.element)

        const scanlines = this.scanLineService.generateScanLines(StitchService.ROW_HEIGHT, shape, scaling, renderer)
        console.log("columns=", scanlines.length)

        /*
        const stitches = this.generateStitches(element, scanLines)

        console.log("Num stitches =", stitches.length)
        return stitches
*/
        return []
    }

    /**
     * Make's sure that the path is closed otherwise it can't be filled properly. We don't do this when we load the file as we might not be filling the shape
     */
    private closePath(element: SVGPathElement) {
        const path = element.getAttribute("d")!.trim()
        if (!path.endsWith("Z") && !path.endsWith("z")) {
            element.setAttribute("d", path + "Z")
        }
    }

    /*
    private generateStitches(element: Snap.Element, scanLines: ScanLine[][]): Coord[] {
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

    /!**
     * Generates stitches for a single column of scan lines.
     *!/
    private generateStitchesForColumn(columnOfLines: ScanLine[], stitchLength: number, minStitchLength: number, columnStitches: Coord[]) {
        let forwards = true
        columnOfLines.forEach((line) => {
            // Generate stitches along the scan line
            const stitches = this.generateStitchesBetweenPoints(line, forwards, stitchLength, minStitchLength)

            if (stitches.length > 0) {
                columnStitches = columnStitches.concat(stitches)
            }

            forwards = !forwards
        })

        return columnStitches
    }

    /!**
     * Generates stitches along the edge of the element between the two coorinates. If the points are close enough together not to need intermediate stitches then it returns an
     * empty array.
     *!/
    private generateStitchesAlongPath(element: Snap.Element, from: Coord, to: Coord, stitchLength: number, minStitchLength: number): Coord[] {

        return []
    }

    /!**
     * Generates stitches between any two points. It will generate stitches all of the same length.
     * @param line The line of stitches
     * @param forwards Whether we stitch start to end or end to start
     * @param stitchLength Length of stitches
     * @param minStitchLength Stitch length can be reduced to this size for small lines.
     *!/
    private generateStitchesBetweenPoints(line: ScanLine, forwards: boolean, stitchLength: number, minStitchLength: number): Coord[] {
        const results: Coord[] = []

        const totalLength = Math.abs(line.end.distanceAlongScanLinePath - line.start.distanceAlongScanLinePath)
        const numStitches = Math.floor(totalLength / stitchLength)
        if (numStitches <= 2) {
            if (totalLength >= minStitchLength) {
                if (forwards) {
                    results.push(line.start.point)
                    results.push(line.end.point)
                } else {
                    results.push(line.end.point)
                    results.push(line.start.point)
                }
            }
        } else {
            const stitchLength = totalLength / numStitches
            for (let i = 0; i <= numStitches; ++i) {
                let d: number
                if (forwards) {
                    if (line.start.distanceAlongScanLinePath < line.end.distanceAlongScanLinePath) {
                        d = line.start.distanceAlongScanLinePath + stitchLength * i
                    } else {
                        d = line.start.distanceAlongScanLinePath - stitchLength * i
                    }
                } else {
                    if (line.end.distanceAlongScanLinePath < line.start.distanceAlongScanLinePath) {
                        d = line.end.distanceAlongScanLinePath + stitchLength * i
                    } else {
                        d = line.end.distanceAlongScanLinePath - stitchLength * i
                    }
                }
                const point = Path.getPointAtLength(line.scanLinePath, d) as Coord
                results.push(point)
            }
        }

        return results
    }
*/
}
