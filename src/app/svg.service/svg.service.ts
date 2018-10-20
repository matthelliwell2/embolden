import {Injectable} from '@angular/core'
import * as Snap from 'snapsvg'
import {Coord, Rectangle, ScanLine} from "./models"
import * as fileHandler from "./fileHandler"
import * as util from "./util"
import * as coords from "./coords"

/**
 * This service is responsible for all manipulation and logic around the svg file. It contains low level items around
 * scaling etc. A separate service is responsible for rendering stitches.
 */
@Injectable({
    providedIn: 'root'
})
export class SvgService {

    /**
     * html element that contains the svg file when it is loaded. This is initialised from the edit component
     */
    container: Snap.Element

    // SVG element inside the container. This is set when a file is loaded. Therefore is this is null then no file has been loaded.
    // paper: Snap.Paper

    // Initial transform matrix incase we need to reset things
    initialLocalMatrix: Snap.Matrix


    // Viewport with as it was before we did any zooming. This is the real size of the viewport in mm. We need it to
    // be able to generate the stitches of the correct length as they are expressed in mm.
    unzoomedViewportWidth: number

    constructor() {
    }

    /**
     * Loads the specified file and does some initial processing on it.
     */
    loadFile(fileContents: string): Snap.Paper {
        if (this.container === undefined) {
            throw new Error("Container has not been set yet")
        }

        const paper = fileHandler.loadFile(this.container, fileContents)

        const width = paper.attr('width')
        this.unzoomedViewportWidth = Number(width.slice(0, width.length - 2))
        this.initialLocalMatrix = paper.transform().localMatrix

        paper.drag()

        return paper
    }

    restoreSizeAndPosition() {
        const paper = util.getPaper(this.container)
        if (paper !== undefined) {
            paper.transform(this.initialLocalMatrix.toTransformString())
        }
    }

    /**
     * Converts the 'd' attribute on the element to the user coord space
     *
     * The path defined on the 'd' attribute in the element does not include any transformation defined inside the
     * element so to get the actual path we need to apply these transforms to the path on the attribute.
     */
    elementPathToElementCoords(element: Snap.Element): string {
        return coords.elementPathToElementCoords(element)
    }

    elementPathToViewBoxCoords(element: Snap.Element): string {
        return coords.elementPathToViewBoxCoords(element)
    }

    /**
     * Given lines that are in the element coordinate space this converts them to the user/viewbox coordinate space.
     * the lines are updated with the new coords. Returned array is the same as the array that was passed in.
     */
    scanLinesToViewBoxCoords(element: Snap.Element, lines: ScanLine[][]): ScanLine[][] {
        return coords.scanLinesToViewBoxCoords(element, lines)
    }

    /**
     * Converts a bounding box in element coords to the corresponding rectangle in viewbox coords
     */
    bboxToViewBoxRect(element: Snap.Element, bbox: Snap.BBox): Rectangle {
        return coords.bboxToViewBoxRect(element, bbox)
    }

    viewBoxCoordToElementCoords(element: Snap.Element, point: Coord): Coord {
        return coords.viewBoxCoordToElementCoords(element, point)
    }

    /**
     * The distance between stitch rows is defined in mm. To be able to generatet the scanlines, which are in element
     * coords, we need to convert mm to element coords. The viewport is defined in mm but may have been resized due
     * to zooming so we need to know the original viewport size in mm to do the calculation.
     */
    mmToElementLength(element: Snap.Element, mm: number): number {
        return coords.mmToElementLength(this.container, element, mm, this.unzoomedViewportWidth)
    }

    mmToViewBoxLength(mm: number): number {
        return coords.mmToViewBoxLength(this.container, mm, this.unzoomedViewportWidth)
    }


    zoomIn() {
        this.zoom(1.2)
    }

    zoomOut() {
        this.zoom(0.8)
    }

    private zoom(factor: number) {
        const paper = util.getPaper(this.container)
        if (paper !== undefined) {
            paper.transform(paper.transform().localMatrix.scale(factor, factor).toTransformString())
        }
    }
}
