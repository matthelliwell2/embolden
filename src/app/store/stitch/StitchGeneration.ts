import { Intersection, Intersections, Point, Shape } from "../../models"
import * as Lib from "../../lib/lib"

const Bezier = require("bezier-js")

export const generateStitches = (shape: Shape, allScanLines: Intersections[][], stitchLengthMM: number, minStitchLengthMM: number, scaling: number) => {
    let allStitches: Point[] = []
    const stitchLength = stitchLengthMM * scaling
    const minStitchLength = minStitchLengthMM * scaling

    let previousColumnOfScanLines: Intersections[] | undefined = undefined
    let count = 0
    allScanLines.forEach(columnOfScanLines => {
        const stitchesForColumn = generateStitchesForScanLines(shape, columnOfScanLines, stitchLength, minStitchLength)

        // Generate stitches from the end of the last column to the start of this column
        if (previousColumnOfScanLines !== undefined && previousColumnOfScanLines!.length > 0 && stitchesForColumn.length > 0) {
            const from: Intersection = previousColumnOfScanLines[previousColumnOfScanLines!.length - 1].end

            const to = columnOfScanLines[0].start
            const joinStitches = generateStitchesAlongShape(shape, from, to, stitchLength)
            if (joinStitches.length > 0) {
                console.log("join stitches:", joinStitches.length)
                allStitches.push(...joinStitches)
            }
        }

        if (stitchesForColumn.length > 0) {
            previousColumnOfScanLines = columnOfScanLines
        }

        // if (count === 1) {
        allStitches.push(...stitchesForColumn)
        // }
        ++count
    })

    console.log("Num columns", count)
    console.log("Num stitches", allStitches.length)

    return splitStitchesIntoPaths(allStitches)
}

/**
 * Generates stitches for a single column of scan lines.
 */
const generateStitchesForScanLines = (shape: Shape, scanLines: Intersections[], stitchLength: number, minStitchLength: number): Point[] => {
    const allStitches: Point[] = []
    let previousScanline: Intersections | undefined
    scanLines.forEach(scanLine => {
        if (previousScanline) {
            allStitches.push(...generateStitchesAlongShape(shape, previousScanline.end, scanLine.start, stitchLength))
        }

        // Generate stitches along the scan line
        const stitches = generateStitchesForScanLine(scanLine, stitchLength, minStitchLength)

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
const generateStitchesAlongShape = (shape: Shape, from: Intersection, to: Intersection, stitchLength: number): Point[] => {
    // If the intersections are on different subpaths then we can't stitch from one to the other along a continous part of the path. Therefore we need to stop the stitching
    // and move to a new point. In the list of stitches we'll represent a break like this with NaN
    if (shape.pathParts[from.segmentNumber].subPath !== shape.pathParts[to.segmentNumber].subPath) {
        return [{ x: NaN, y: NaN }]
    }

    const fromDistance = Lib.calculateDistanceAlongPath(shape, from)
    const toDistance = Lib.calculateDistanceAlongPath(shape, to)
    const totalLen = shape.element.getTotalLength()

    // Decide if it is shorter to move between the points either forwards or backwards along the path
    const forwardDistance = calculateDistanceBetweenPointsOnPath(totalLen, fromDistance, toDistance)
    const backwardDistance = calculateDistanceBetweenPointsOnPath(totalLen, toDistance, fromDistance)

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
        // if (forward) {
        stitches.push(...generateStitchesAlongElement(shape.pathParts[currentSegment].segment, from.segmentTValue, to.segmentTValue, stitchLength, false, false))
        // } else {
        // We probably need to do something here but haven't reproduced a problem with it yet
        //     stitches.push(...generateStitchesAlongElement(shape.pathParts[currentSegment].segment, to.segmentTValue, from.segmentTValue, stitchLength, false, false))
        // }
    } else if (forward) {
        // We need to move across more than one segment so start by stitching to the end of the first segment
        stitches.push(...generateStitchesAlongElement(shape.pathParts[from.segmentNumber].segment, from.segmentTValue, 1, stitchLength, false, true))
        for (let i = 1; i < segmentIndexes.length - 1; ++i) {
            // Stitch all the way along any segments inbetween the first and last segments
            const currentSegment = segmentIndexes[i]
            stitches.push(...generateStitchesAlongElement(shape.pathParts[currentSegment].segment, 0, 1, stitchLength, false, true))
        }

        // Finally stitch from the start of the last segment to our final point
        stitches.push(...generateStitchesAlongElement(shape.pathParts[to.segmentNumber].segment, 0, to.segmentTValue, stitchLength, false, false))
    } else {
        // This is the same as above but we are moving in the other direction. We could combine this with the code above but that ends up making the code even harder
        // to follow than it is now.
        stitches.push(...generateStitchesAlongElement(shape.pathParts[from.segmentNumber].segment, from.segmentTValue, 0, stitchLength, false, true))
        for (let i = 1; i < segmentIndexes.length - 1; ++i) {
            const currentSegment = segmentIndexes[i]
            stitches.push(...generateStitchesAlongElement(shape.pathParts[currentSegment].segment, 1, 0, stitchLength, false, true))
        }

        stitches.push(...generateStitchesAlongElement(shape.pathParts[to.segmentNumber].segment, 1, to.segmentTValue, stitchLength, false, true))
    }

    return stitches
}

/**
 * Calculates the distance along a path of two points on the path, moving forwards on the path, allowing for the fact that this might go over the start of the path
 */
const calculateDistanceBetweenPointsOnPath = (totalLen: number, from: number, to: number): number => {
    if (from < to) {
        return to - from
    } else {
        return totalLen - from + to
    }
}

/**
 * Generates stitches along a segment consisting of a single path. Optionally it can include or exclude the first and last stitches as these may
 * have already been stitched by the caller.
 */
const generateStitchesAlongElement = (
    element: SVGPathElement,
    fromTValue: number,
    toTValue: number,
    stitchLength: number,
    includeFirstPoint: boolean,
    includeLastPoint: boolean
): Point[] => {
    const distance = element.getTotalLength() * Math.abs(fromTValue - toTValue)
    const numStitches = Math.ceil(distance / stitchLength) + 1

    const stitches: Point[] = []
    const coords = Lib.getControlPointsFromPath(element)

    const firstStitch = includeFirstPoint ? 0 : 1
    const lastStitch = includeLastPoint ? numStitches : numStitches - 1
    if (coords.length == 4) {
        const b = new Bezier(coords)

        for (let i = firstStitch; i < lastStitch; ++i) {
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
        for (let i = firstStitch; i < lastStitch; ++i) {
            if (fromTValue < toTValue) {
                const fraction = fromTValue + ((toTValue - fromTValue) / (numStitches - 1)) * i
                stitches.push({ x: coords[0].x + (coords[1].x - coords[0].x) * fraction, y: coords[0].y + (coords[1].y - coords[0].y) * fraction })
            } else {
                const fraction = fromTValue - ((fromTValue - toTValue) / (numStitches - 1)) * i
                stitches.push({ x: coords[0].x + (coords[1].x - coords[0].x) * fraction, y: coords[0].y + (coords[1].y - coords[0].y) * fraction })
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
const generateStitchesForScanLine = (scanLine: Intersections, stitchLength: number, minStitchLength: number): Point[] => {
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

/**
 * The stitches we've generated may be split into independent paths. This is indicated by the coords being NaN. Therefore we go through the stitches and break
 * split them up into array. As the path can get split in a couple of places, this is tricky to do as we go along so we do it as a piece of post processing
 */
const splitStitchesIntoPaths = (allStitches: Point[]): Point[][] => {
    const result: Point[][] = []
    let path: Point[] = []
    allStitches.forEach(stitch => {
        if (isNaN(stitch.x)) {
            result.push(path)
            path = []
        } else {
            path.push(stitch)
        }
    })

    if (path.length > 0) {
        result.push(path)
    }

    return result
}
