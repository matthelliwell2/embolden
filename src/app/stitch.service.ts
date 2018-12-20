import { Injectable } from "@angular/core"
import { ScanLineService } from "./scan-line.service"
import { Intersection, Intersections, Point, SatinFillType, Shape } from "./models"
import * as Lib from "./lib/lib"
import { OptimiserService } from "./optimiser.service"
import { PubSubService } from "./pub-sub.service"

const Bezier = require("bezier-js")

/**
 * This class generates stitches for elements acccording to the specified style, fill type etc. It just returns
 * stitches without attempting to draw them or store them.
 */
@Injectable({
    providedIn: "root"
})
export class StitchService {
    // private static readonly ROW_HEIGHT = 0.4
    private static readonly ROW_HEIGHT = 4.3
    private static readonly STITCH_LENGTH = 3.5
    private static readonly MIN_STITCH_LENGTH = 1.5

    private scaling: number

    constructor(private scanLineService: ScanLineService, private optimiserService: OptimiserService, private pubSubService: PubSubService) {
        this.pubSubService.subscribe(this)
    }

    onFileLoaded(file: { svg: SVGSVGElement; scaling: number }) {
        this.scaling = file.scaling
    }

    fill(shape: Shape): void {
        if (shape.fillType === SatinFillType.None) {
            shape.stitches = []
            return
        }

        this.closePath(shape.element)

        const scanLines = this.scanLineService.generateScanLines(StitchService.ROW_HEIGHT, shape, StitchService.MIN_STITCH_LENGTH)
        this.optimiserService.optimise(scanLines)

        this.generateStitches(shape, scanLines)

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

    private generateStitches(shape: Shape, allScanLines: Intersections[][]) {
        let allStitches: Point[] = []
        const stitchLength = StitchService.STITCH_LENGTH * this.scaling
        const minStitchLength = StitchService.MIN_STITCH_LENGTH * this.scaling

        let previousColumnOfScanLines: Intersections[] | undefined = undefined
        let count = 0
        allScanLines.forEach(columnOfScanLines => {
            const stitchesForColumn = this.generateStitchesForScanLines(shape, columnOfScanLines, stitchLength, minStitchLength)

            // Generate stitches from the end of the last column to the start of this column
            if (previousColumnOfScanLines !== undefined && previousColumnOfScanLines!.length > 0 && stitchesForColumn.length > 0) {
                const from: Intersection = previousColumnOfScanLines[previousColumnOfScanLines!.length - 1].end

                const to = columnOfScanLines[0].start
                const joinStitches = this.generateStitchesAlongShape(shape, from, to, stitchLength)
                if (joinStitches.length > 0) {
                    console.log("join stitches:", joinStitches.length)
                    allStitches.push(...joinStitches)
                }
            }

            if (stitchesForColumn.length > 0) {
                previousColumnOfScanLines = columnOfScanLines
            }

            // if (count === 0) {
            allStitches.push(...stitchesForColumn)
            // }
            // ++count
        })

        console.log("Num columns", count)

        shape.stitches = allStitches
    }

    /**
     * Generates stitches for a single column of scan lines.
     */
    private generateStitchesForScanLines(shape: Shape, scanLines: Intersections[], stitchLength: number, minStitchLength: number): Point[] {
        const allStitches: Point[] = []
        let previousScanline: Intersections | undefined
        scanLines.forEach(scanLine => {
            if (previousScanline) {
                allStitches.push(...this.generateStitchesAlongShape(shape, previousScanline.end, scanLine.start, stitchLength))
            }

            // Generate stitches along the scan line
            const stitches = this.generateStitchesForScanLine(scanLine, stitchLength, minStitchLength)

            if (stitches.length > 0) {
                allStitches.push(...stitches)
                previousScanline = scanLine
            }
        })

        return allStitches
    }

    /**
     * Generates stitches along the edge of the element between the two coorinates. If the points are close enough together not to need intermediate stitches then it returns an
     * empty array. It generates stitches either forwards or backwards along the path, which ever way is shorter. It uses the compute function in bezier-js as this natuarally
     * ends up giving points that are closer together on sharper parts of the curve.
     */
    private generateStitchesAlongShape(shape: Shape, from: Intersection, to: Intersection, stitchLength: number): Point[] {
        // If the intersections are on different subpaths then we can't stitch from one to the other along a continous part of the path. Therefore we need to stop the stitching
        // and move to a new point. In the list of stitches we'll represent a break like this with NaN
        if (shape.pathParts[from.segmentNumber].subPath !== shape.pathParts[to.segmentNumber].subPath) {
            return [{ x: NaN, y: NaN }]
        }

        const fromDistance = this.calculateDistanceAlongPath(shape, from)
        const toDistance = this.calculateDistanceAlongPath(shape, to)
        const totalLen = shape.element.getTotalLength()

        // Decide if it is shorter to move between the points either forwards or backwards along the path
        const forwardDistance = this.calculateDistanceBetweenPointsOnPath(totalLen, fromDistance, toDistance)
        const backwardDistance = this.calculateDistanceBetweenPointsOnPath(totalLen, toDistance, fromDistance)

        const forward = forwardDistance <= backwardDistance
        const increment = forward ? 1 : -1

        // we need to work out over which segments we'll stitch. As this may involving past the start of the curve, we have to use modulo arithmetic.
        const subpath = shape.pathParts[from.segmentNumber].subPath
        const segmentIndexes: number[] = []
        let segmentNum = from.segmentNumber
        do {
            // We need to make sure that we only go over segments on the same subpath
            if (shape.pathParts[segmentNum].subPath === subpath) {
                segmentIndexes.push(segmentNum)
            }
            if (segmentNum === to.segmentNumber) {
                break
            }

            segmentNum += increment
            segmentNum = segmentNum % shape.pathParts.length
            if (segmentNum < 0) {
                segmentNum += shape.pathParts.length
            }
        } while (true)

        const stitches: Point[] = []
        if (segmentIndexes.length === 1) {
            // The from and to points are on the same segment so we can just stitch from one to the other
            const currentSegment = segmentIndexes[0]
            stitches.push(...this.generateStitchesAlongElement(shape.pathParts[currentSegment].segment, from.segmentTValue, to.segmentTValue, stitchLength))
        } else if (forward) {
            // We need to move across more than one segment so start by stitching to the end of the first segment
            stitches.push(...this.generateStitchesAlongElement(shape.pathParts[from.segmentNumber].segment, from.segmentTValue, 1, stitchLength))
            for (let i = 1; i < segmentIndexes.length - 1; ++i) {
                // Stitch all the way along any segments inbetween the first and last segments
                const currentSegment = segmentIndexes[i]
                stitches.push(...this.generateStitchesAlongElement(shape.pathParts[currentSegment].segment, 0, 1, stitchLength))
            }

            // Finally stitch from the start of the last segment to our final point
            stitches.push(...this.generateStitchesAlongElement(shape.pathParts[to.segmentNumber].segment, 0, to.segmentTValue, stitchLength))
        } else {
            // This is the same as above but we are moving in the other direction. We could combine this with the code above but that ends up making the code even harder
            // to follow than it is now.
            stitches.push(...this.generateStitchesAlongElement(shape.pathParts[from.segmentNumber].segment, from.segmentTValue, 0, stitchLength))
            for (let i = 1; i < segmentIndexes.length - 1; ++i) {
                const currentSegment = segmentIndexes[i]
                stitches.push(...this.generateStitchesAlongElement(shape.pathParts[currentSegment].segment, 1, 0, stitchLength))
            }
            stitches.push(...this.generateStitchesAlongElement(shape.pathParts[to.segmentNumber].segment, 1, to.segmentTValue, stitchLength))
        }

        return stitches
    }

    /**
     * Calculate distance along the element path to the intersection
     */
    private calculateDistanceAlongPath(shape: Shape, intersection: Intersection): number {
        return (
            Lib.getTotalLength(shape.pathParts.slice(0, intersection.segmentNumber).map(part => part.segment)) +
            intersection.segmentTValue * shape.pathParts[intersection.segmentNumber].segment.getTotalLength()
        )
    }

    /**
     * Calculates the distance along a path of two points on the path, moving forwards on the path, allowing for the fact that this might go over the start of the path
     */
    private calculateDistanceBetweenPointsOnPath(totalLen: number, from: number, to: number): number {
        if (from < to) {
            return to - from
        } else {
            return totalLen - from + to
        }
    }

    private generateStitchesAlongElement(element: SVGPathElement, fromTValue: number, toTValue: number, stitchLength: number): Point[] {
        const distance = element.getTotalLength() * Math.abs(fromTValue - toTValue)
        const numStitches = Math.ceil(distance / stitchLength) + 1

        const stitches: Point[] = []
        const coords = Lib.getControlPointsFromPath(element)
        if (coords.length == 4) {
            const b = new Bezier(coords)

            for (let i = 1; i < numStitches - 1; ++i) {
                if (fromTValue < toTValue) {
                    // forwards
                    const fraction = ((toTValue - fromTValue) / (numStitches - 1)) * i
                    stitches.push(b.compute(fromTValue + fraction))
                } else {
                    // backwards
                    const fraction = ((fromTValue - toTValue) / (numStitches - 1)) * i
                    stitches.push(b.compute(fromTValue - fraction))
                }
            }
        } else if (coords.length === 2) {
            for (let i = 1; i < numStitches - 1; ++i) {
                const fraction = ((toTValue - fromTValue) / (numStitches - 1)) * i
                if (fromTValue < toTValue) {
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
     * Generates stitches between any two points. It will generate stitches all of the same length.
     * @param scanLine The line of stitches
     * @param stitchLength Length of stitches
     * @param minStitchLength Min stitch length. If scanline is shorter than this no stitches wil be generated. However these short scanline should've been filtered out already
     */
    private generateStitchesForScanLine(scanLine: Intersections, stitchLength: number, minStitchLength: number): Point[] {
        const results: Point[] = []

        const start = scanLine.start
        const end = scanLine.end

        const totalLength = end.scanlineDistance - start.scanlineDistance

        if (Math.abs(totalLength) <= stitchLength) {
            if (Math.abs(totalLength) >= minStitchLength) {
                results.push(start.point)
                results.push(end.point)
            }
        } else {
            const numStitches = Math.floor(Math.abs(totalLength) / stitchLength)

            const actualStitchLength = totalLength / numStitches
            for (let i = 0; i <= numStitches; ++i) {
                // Note actualStitchLength can be negative
                const d = start.scanlineDistance + actualStitchLength * i
                const point = scanLine.scanline.getPointAtLength(d)
                results.push(point)
            }
        }

        return results
    }
}
