import * as Path from "./lib/path"
import { Injectable, Renderer2 } from "@angular/core"
import { ScanLineService } from "./scan-line.service"
import { Intersection, Intersections, Point, SatinFillType, Shape } from "./models"

const Bezier = require("bezier-js")

/**
 * This class generates stitches for elements acccording to the specified style, fill type etc. It just returns
 * stitches without attempting to draw them or store them.
 */
@Injectable({
    providedIn: "root"
})
export class StitchService {
    private static readonly ROW_HEIGHT = 0.4
    // private static readonly ROW_HEIGHT = 5
    private static readonly STITCH_LENGTH = 3.5
    private static readonly MIN_STITCH_LENGTH = 1.5

    constructor(private scanLineService: ScanLineService) {}

    fill(shape: Shape, scaling: number, renderer: Renderer2): void {
        if (shape.fillType === SatinFillType.None) {
            shape.stitches = []
            return
        }

        this.closePath(shape.element)

        const scanLines = this.scanLineService.generateScanLines(StitchService.ROW_HEIGHT, shape, scaling, renderer, StitchService.MIN_STITCH_LENGTH)

        this.generateStitches(shape, scanLines, scaling)

        console.log("Num stitches =", shape.stitches.length)
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

    private generateStitches(shape: Shape, scanLines: Intersections[][], scaling: number) {
        let allStitches: Point[] = []
        const stitchLength = StitchService.STITCH_LENGTH * scaling
        const minStitchLength = StitchService.MIN_STITCH_LENGTH * scaling

        let previousColumnOfLines: Intersections[] | undefined = undefined
        // let insert = false
        scanLines.forEach(columnOfLines => {
            let columnStitches: Point[] = []
            columnStitches = this.generateStitchesForColumn(columnOfLines, stitchLength, minStitchLength, columnStitches)

            // Generate stitches from the end of the last column to the start of this column
            if (previousColumnOfLines !== undefined && previousColumnOfLines!.length > 0 && columnStitches.length > 0) {
                let from: Intersection
                if (previousColumnOfLines.length % 2 === 0) {
                    from = previousColumnOfLines[previousColumnOfLines!.length - 1].intersectionPoints.start
                } else {
                    from = previousColumnOfLines[previousColumnOfLines!.length - 1].intersectionPoints.end
                }

                const to = columnOfLines[0].intersectionPoints.start
                const joinStitches = this.generateStitchesAlongShape(shape, from, to, minStitchLength)
                if (joinStitches.length > 0) {
                    console.log("join stitches:", joinStitches.length)
                    allStitches.push(...joinStitches)
                }
            }

            if (columnStitches.length > 0) {
                previousColumnOfLines = columnOfLines
            }

            // if (insert) {
            allStitches.push(...columnStitches)
            // insert = false
            // }
            // insert = true
        })

        shape.stitches = allStitches
    }

    /**
     * Generates stitches for a single column of scan lines.
     */
    private generateStitchesForColumn(columnOfLines: Intersections[], stitchLength: number, minStitchLength: number, columnStitches: Point[]) {
        let forwards = true
        columnOfLines.forEach(line => {
            // Generate stitches along the scan line
            const stitches = this.generateStitchesBetweenPoints(line, forwards, stitchLength, minStitchLength)

            if (stitches.length > 0) {
                columnStitches = columnStitches.concat(stitches)
            }

            forwards = !forwards
        })

        return columnStitches
    }

    /**
     * Generates stitches along the edge of the element between the two coorinates. If the points are close enough together not to need intermediate stitches then it returns an
     * empty array. It generates stitches either forwards or backwards along the path, which ever way is shorter. It uses the compute function in bezier-js as this natuarally
     * ends up giving points that are closer together on sharper parts of the curve.
     * TODO simplify all this path calculation stuff. Elements and scanlines should be treated the same in calculations.
     */
    private generateStitchesAlongShape(shape: Shape, from: Intersection, to: Intersection, stitchLength: number): Point[] {
        const fromDistance = from.elementDistance
        const toDistance = to.elementDistance
        const totalLen = shape.element.getTotalLength()

        const forwardDistance = this.forwardDistance(totalLen, fromDistance, toDistance)
        const backwardDistance = this.backwardDistance(totalLen, fromDistance, toDistance)

        // const distance = Math.min(forwardDistance, backwardDistance)
        const forward = forwardDistance <= backwardDistance

        const stitches: Point[] = []
        if (from.segmentNumber !== to.segmentNumber) {
            if (forward) {
                stitches.push(...this.generateStitchesAlongElement(shape.elementSegments[from.segmentNumber], from.segmentTValue, 1, stitchLength))

                for (let i = from.segmentNumber + 1; i < to.segmentNumber; ++i) {
                    stitches.push(...this.generateStitchesAlongElement(shape.elementSegments[i], 0, 1, stitchLength))
                }

                stitches.push(...this.generateStitchesAlongElement(shape.elementSegments[to.segmentNumber], 0, to.segmentTValue, stitchLength))
            } else {
                stitches.push(...this.generateStitchesAlongElement(shape.elementSegments[from.segmentNumber], from.segmentTValue, 0, stitchLength))

                for (let i = from.segmentNumber - 1; i > to.segmentNumber; --i) {
                    stitches.push(...this.generateStitchesAlongElement(shape.elementSegments[i], 1, 0, stitchLength))
                }

                stitches.push(...this.generateStitchesAlongElement(shape.elementSegments[to.segmentNumber], 1, to.segmentTValue, stitchLength))
            }
        } else {
            if (forward) {
                stitches.push(...this.generateStitchesAlongElement(shape.elementSegments[from.segmentNumber], from.segmentTValue, to.segmentTValue, stitchLength))
            } else {
                stitches.push(...this.generateStitchesAlongElement(shape.elementSegments[to.segmentNumber], to.segmentTValue, from.segmentTValue, stitchLength))
            }
        }

        return stitches
        /*


        const numStitches = Math.round(distance / stitchLength) + 1
        if (numStitches === 0) {
            return []
        }
        const adjustedStitchLength = distance / numStitches

        const stitches: Point[] = []
        for (let i = 1; i < numStitches - 1; ++i) {
            const distance = fromDistance + i * adjustedStitchLength * direction
            stitches.push(shape.element.getPointAtLength(distance))
        }

        return stitches
*/
    }

    private generateStitchesAlongElement(element: SVGPathElement, from: number, to: number, stitchLength: number): Point[] {
        const distance = element.getTotalLength() * Math.abs(from - to)
        const numStitches = Math.round(distance / stitchLength) + 1
        if (numStitches < 2) {
            return []
        }

        const stitches: Point[] = []
        const coords = Path.getCoordsFromPath(element)
        if (coords.length == 4) {
            const b = new Bezier(coords)

            for (let i = 0; i < numStitches; ++i) {
                if (from < to) {
                    // forwards
                    const fraction = ((to - from) / (numStitches - 1)) * i
                    stitches.push(b.compute(from + fraction))
                } else {
                    // backwards
                    const fraction = ((from - to) / (numStitches - 1)) * i
                    stitches.push(b.compute(from - fraction))
                }
            }
        } else if (coords.length === 2) {
            for (let i = 0; i < numStitches; ++i) {
                const fraction = ((to - from) / (numStitches - 1)) * i
                if (from < to) {
                    stitches.push({ x: coords[0].x + (coords[1].x - coords[0].x) * fraction, y: coords[0].y + (coords[1].y - coords[0].y) * fraction })
                } else {
                    stitches.push({ x: coords[1].x + (coords[1].x - coords[0].x) * fraction, y: coords[1].y + (coords[1].y - coords[0].y) * fraction })
                }
            }
        } else {
            throw new Error(`Unsupport command in path ${element.getAttribute("d")}`)
        }

        return stitches
    }

    /**
     * Calculates the distance along a path of two points on the path, moving forwards on the path, allowing for the fact that this might go over the start of the path
     */
    private forwardDistance(totalLen: number, from: number, to: number): number {
        if (from < to) {
            return to - from
        } else {
            return totalLen - from + to
        }
    }

    /**
     * Calculates the distance along a path of two points on the path, moving backwards on the path, allowing for the fact that this might go over the start of the path
     */
    private backwardDistance(totalLen: number, from: number, to: number): number {
        if (from < to) {
            return from + totalLen - to
        } else {
            return from - to
        }
    }

    /**
     * Generates stitches between any two points. It will generate stitches all of the same length.
     * @param line The line of stitches
     * @param forwards Whether we stitch start to end or end to start
     * @param stitchLength Length of stitches
     * @param minStitchLength Stitch length can be reduced to this size for small lines.
     */
    private generateStitchesBetweenPoints(line: Intersections, forwards: boolean, stitchLength: number, minStitchLength: number): Point[] {
        const results: Point[] = []

        const end = line.intersectionPoints.end
        const start = line.intersectionPoints.start
        const totalLength = Math.abs(end.scanlineDistance - start.scanlineDistance)
        const numStitches = Math.floor(totalLength / stitchLength)
        if (numStitches <= 2) {
            if (totalLength >= minStitchLength) {
                if (forwards) {
                    results.push(start.point)
                    results.push(end.point)
                } else {
                    results.push(end.point)
                    results.push(start.point)
                }
            }
        } else {
            const stitchLength = totalLength / numStitches
            for (let i = 0; i <= numStitches; ++i) {
                let d: number
                if (forwards) {
                    if (start.scanlineDistance < end.scanlineDistance) {
                        d = start.scanlineDistance + stitchLength * i
                    } else {
                        d = start.scanlineDistance - stitchLength * i
                    }
                } else {
                    if (end.scanlineDistance < start.scanlineDistance) {
                        d = end.scanlineDistance + stitchLength * i
                    } else {
                        d = end.scanlineDistance - stitchLength * i
                    }
                }

                const point = line.scanline.getPointAtLength(d)
                results.push(point)
            }
        }

        return results
    }
}
