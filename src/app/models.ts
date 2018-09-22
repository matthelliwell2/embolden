import * as Snap from "snapsvg"
import {Coord} from "./svg.service"

/**
 *  The properties for an element that we use to control how it is stitched
 */
export class ElementProperties {
    constructor(public element: Snap.Element) {}

    stitches: Coord[] = []
    fillType: SatinFillType = SatinFillType.None
    isSelected: boolean = false
    group: Snap.Element | undefined = undefined
}

/**
 * The available type of stitch filling
 */
export enum SatinFillType {
    None = "None",
    Natural = "Natural"
}
