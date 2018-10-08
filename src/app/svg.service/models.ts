export interface Coord {
    x: number,
    y: number
}

export interface Line {
    start: Coord
    end: Coord
}

export interface Rectangle {
    x: number
    y: number
    width: number
    height: number
}

/**
 * Represents a single intersection between a path element and a scanline.
 */
export interface Intersection {
    /**
     * Coords of the intersection
     */
    point: Coord

    /**
     * Distance along the element path to the intersection. This can be used to move from one intersection point to another along the path.
     */
    distanceAlongElementPath: number

    /**
     * Distance along the scan line path to the intersection
     */
    distanceAlongScanLinePath: number
}

export interface ScanLine {
    /** The path for the scanline */
    scanLinePath: string
    start: Intersection
    end: Intersection
}
