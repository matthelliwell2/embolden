/**
 *  The properties for an element that we use to control how it is stitched
 */

export class Shape {
    /**
     * @param element Element as displayed on the screen
     * @param pathParts Elements for each segment of the path. These are not added to the DOM at all
     */
    constructor(public element: SVGPathElement, public pathParts: PathPart[]) {}

    stitches: Point[][] = []
    fillType: SatinFillType = SatinFillType.None
    fillColourNumber: string | undefined = undefined
}

export class PathPart {
    segment: SVGPathElement
    subPath: number
}

/**
 * The available type of stitch filling
 */
export enum SatinFillType {
    None = "None",
    Natural = "Natural"
}

export interface Point {
    x: number
    y: number
}

/**
 * Intersection of a scanline and a path
 */
export interface Intersection {
    point: Point
    scanlineDistance: number
    segmentNumber: number
    segmentTValue: number
}

export interface Intersections {
    start: Intersection
    end: Intersection
    scanline: SVGPathElement
}
