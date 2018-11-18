import { Injectable, Renderer2 } from "@angular/core"
import * as svgIntersections from "svg-intersections"
import { Point, Shape } from "./models"
import * as Path from "./lib/path"

/**
 * This class is responsible for generate scan lines across an arbitrary shape.
 */
@Injectable({
    providedIn: "root"
})
export class ScanLineService {
    constructor() {}

    private readonly intersect = svgIntersections.intersect
    private readonly shape = svgIntersections.shape

    /**
     * This generates a series of horizontal lines that run the width of the shape. Each line is referred to as a scan line.
     * The scan lines are defined as parths so that in the future we can generalise this and make them curved paths etc.
     */
    generateScanLines(heightMM: number, shape: Shape, scaling: number, renderer: Renderer2): Intersections[][] {
        const elementBBox = shape.element.getBBox()

        console.log("scaling", scaling, "separation", heightMM * scaling)
        const scanLineSeparation = this.adjustLineSeparation(elementBBox, heightMM * scaling)

        const intersections = this.generateFullWidthScanLinePaths(scanLineSeparation, elementBBox)
            .map(path => this.stringToSVGElement(path, renderer, shape.element))
            .map(scanLine => this.getIntersections(shape.element, scanLine, scanLineSeparation))
            .map(intersections => this.calculateDistancesAlongElementPath(shape, intersections))
            .map(intersections => this.calculateDistancesAlongScanlinePath(intersections))

        return this.sortIntoColumns(intersections)
    }

    /**
     * Converts the intersection coordinate into distance along the path. This is needed because when we stitch we navigate along the path using the getPointAtLength method rather
     * than the actually coords.
     */
    private calculateDistancesAlongElementPath = (shape: Shape, intersections: Intersections): Intersections => {
        intersections.intersectionPoints.forEach(pair => {
            const indexStart = Path.findElementForPoint(shape.elementSegments, pair.start.point)
            const elementStart = shape.elementSegments[indexStart]
            pair.start.elementDistance = Path.getTValueAtPoint(elementStart, pair.start.point) * elementStart.getTotalLength()

            const indexEnd = Path.findElementForPoint(shape.elementSegments, pair.end.point)
            const elementEnd = shape.elementSegments[indexEnd]
            pair.start.elementDistance = Path.getTValueAtPoint(elementEnd, pair.end.point) * elementEnd.getTotalLength()
        })

        return intersections
    }

    private calculateDistancesAlongScanlinePath = (intersections: Intersections): Intersections => {
        intersections.intersectionPoints.forEach(pair => {
            pair.start.scanlineDistance = Path.getTValueAtPoint(intersections.scanline, pair.start.point) * intersections.scanline.getTotalLength()
            pair.end.scanlineDistance = Path.getTValueAtPoint(intersections.scanline, pair.end.point) * intersections.scanline.getTotalLength()
        })

        return intersections
    }

    private stringToSVGElement(path: string, renderer: Renderer2, parent: SVGPathElement): SVGPathElement {
        const element = renderer.createElement("path", "svg") as SVGPathElement
        element.setAttribute("d", path)
        renderer.appendChild(parent.parentNode, element)
        return element
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
    private sortIntoColumns(intersections: Intersections[]): Intersections[][] {
        const results: Intersections[][] = []

        // Get the max number of columns across all the rows
        const maxColumns = intersections
            .map(row => row.intersectionPoints.length)
            .reduce((maxColumns, length): number => {
                return length > maxColumns ? length : maxColumns
            }, 0)

        for (let col = 0; col < maxColumns; ++col) {
            // Move up a column. Push each line into an array until we reach the end of the column
            let column: Intersections[] = []
            intersections.forEach(intersection => {
                if (intersection.intersectionPoints[col] === undefined) {
                    if (column.length > 0) {
                        results.push(column)
                        column = []
                    }
                } else {
                    const pair = intersection.intersectionPoints[col]
                    column.push({ intersectionPoints: [pair], scanline: intersection.scanline })
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
     */
    private adjustLineSeparation(bbox: DOMRect, height: number): number {
        const counts = Math.floor(bbox.height / height)
        return bbox.height / counts
    }

    /**
     * Generates paths that go from xmin to xmax across the width of the shape. We do this as a path rather than a line so that in the future we can generalise it
     * to use any path as a scanline
     */
    private generateFullWidthScanLinePaths(separation: number, bbox: DOMRect): string[] {
        const paths: string[] = []
        const startX = bbox.x - 1
        const endX = bbox.x + bbox.width + 1
        for (let y = bbox.y; y <= bbox.y + bbox.height; y += separation) {
            const line = `M${startX},${y} C${startX},${y} ${endX},${y} ${endX},${y}`
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
    private getIntersections(element: SVGPathElement, scanLine: SVGPathElement, separation: number): Intersections {
        const intersect = this.intersect(this.shape("path", { d: element.getAttribute("d") }), this.shape("path", { d: scanLine.getAttribute("d") })) as Intersect

        // TODO handle odd number of intersections and single intersection
        if (intersect.points.length % 2 !== 0) {
            console.log("TODO odd number of intersections")
            intersect.points.slice(0, intersect.points.length - 1)
        }

        const intersections: IntersectionPair[] = []
        for (let i = 0; i < intersect.points.length; i += 2) {
            const start = { point: intersect.points[i], scanlineDistance: 0, elementDistance: 0 }
            const end = { point: intersect.points[i + 1], scanlineDistance: 0, elementDistance: 0 }
            intersections.push({ start: start, end: end })
        }

        return {
            intersectionPoints: intersections,
            scanline: scanLine
        }

        /*
        const dy = -separation * 0.01
        let intersections: IntersectionDot[]
        let originalY: number | undefined
        const originalPath = scanLinePath
        let offset = dy
        do {
            intersections = Path.intersection(element, scanLinePath)

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

        return {intersections: intersections, scanLinePath: originalPath}*/
    }
}

interface Intersect {
    status: string
    points: [Point]
}

interface Intersection {
    point: Point
    scanlineDistance: number
    elementDistance: number
}

interface IntersectionPair {
    start: Intersection
    end: Intersection
}

interface Intersections {
    intersectionPoints: IntersectionPair[]
    scanline: SVGPathElement
}
