import * as Snap from "snapsvg"
import {Coord} from "./svg.service/models"

/**
 *  The properties for an element that we use to control how it is stitched
 */
export class ElementProperties {
    constructor(public element: Snap.Element) {}

    stitches: Coord[] = []
    fillType: SatinFillType = SatinFillType.None
    isSelected: boolean = false

    /**
     * The svg group that contains the lines etc for the display of the stitches.
     */
    stitchGroup: Snap.Element | undefined = undefined
}

/**
 * The available type of stitch filling
 */
export enum SatinFillType {
    None = "None",
    Natural = "Natural"
}
