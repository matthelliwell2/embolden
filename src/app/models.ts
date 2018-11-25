/**
 *  The properties for an element that we use to control how it is stitched
 */
export class Shape {
    /**
     * @param element Element as displayed on the screen
     * @param elementSegments Elements for each segment of the path. These are not added to the DOM at all
     */
    constructor(public element: SVGPathElement, public elementSegments: SVGPathElement[]) {}

    stitches: Point[] = []
    fillType: SatinFillType = SatinFillType.None

    /**
     * The svg group that contains the lines etc for the display of the stitches.
     */
    stitchGroup: SVGGElement | undefined = undefined
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
