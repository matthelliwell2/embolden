import {Injectable} from '@angular/core'
import * as Snap from 'snapsvg'
import * as SnapCjs from 'snapsvg-cjs'
import * as uuid from "uuid/v4"

/**
 * This service is responsible for all manipulation and logic around the svg file. It contains low level items around
 * scaling etc. A separate service is responsible for rendering stitches.
 */
@Injectable({
    providedIn: 'root'
})
export class SvgService {

    // Container in which the svg file is rendered.
    container: Snap.Element

    // SVG element inside the container
    paper: Snap.Paper

    private dragging = false
    private dragStartPos: Coord


    // Viewport with as it was before we did any zooming. This is the real size of the viewport in mm. We need it to
    // be able to generate the stitches of the correct length as they are expressed in mm.
    unzoomedViewportWidth: number

    constructor() {
    }

    /**
     * Loads the specified file and does some initial processing on it.
     */
    loadFile(fileContents: string): void {
        if (this.container === undefined) {
            throw new Error("Container has not been set yet")
        }

        // Remove whatever we've got in there already
        // TODO add a save warning
        this.paper = this.container.select("svg") as Snap.Paper
        if (this.paper !== undefined && this.paper !== null) {
            this.paper.remove()
        }

        const fragment = SnapCjs.parse(fileContents)
        this.container.append(fragment)
        this.addIdToAllElements(this.container)

        this.paper = this.container.select("svg") as Snap.Paper
        const width = this.paper.attr('width')
        const height = this.paper.attr('height')

        if (!width.endsWith('mm') || !height.endsWith('mm')) {
            throw new Error(`Viewport units must be in mm ${width}x${height} is not supported`)
        }

        const viewBox = this.paper.attr('viewBox')
        const scalingWidth = viewBox.width / Number(width.slice(0, width.length - 2))
        const scalingHeight = viewBox.height / Number(height.slice(0, height.length - 2))

        if (Math.abs(scalingHeight - scalingWidth) > 0.01) {
            throw new Error(`Cannot support different x and y scaling factors. Viewport=${width}x${height}. Viewbox=${viewBox}`)
        }

        this.unzoomedViewportWidth = Number(width.slice(0, width.length - 2))
    }

    dragStart(x: number, y: number): void {
        console.log('drag start', x,y)
        this.dragStartPos = {x: x, y: y}
        this.dragging = true

    }

    dragEnd(x: number, y: number): void {
        if (!this.dragging) {
            return
        }

        console.log('drag end', x,y)

        const xmove = x - this.dragStartPos.x
        const ymove = y - this.dragStartPos.y

        const viewbox = this.paper.attr("viewBox")
        console.log("old view box", viewbox)
        viewbox.x -= xmove
        viewbox.y -= ymove

        this.paper.attr({viewBox: `${viewbox.x} ${viewbox.y} ${viewbox.width} ${viewbox.height}`})

        console.log("new viewbox", this.paper.attr("viewBox"))
        this.dragging = false

    }

    /**
     * Converts the 'd' attribute on the element to the user coord space
     *
     * The path defined on the 'd' attribute in the element does not include any transformation defined inside the
     * element so to get the actual path we need to apply these transforms to the path on the attribute.
     */
    elementPathToElementCoords(element: Snap.Element): string {
        const path = SnapCjs.path as Snap.Path
        const localMatrix = element.transform().localMatrix

        return path.map(element.attr("d"), localMatrix)
    }

    /**
     * Given lines that are in the element coordinate space this converts them to the user/viewbox coordinate space.
     * the lines are updated with the new coords. Returned array is the same as the array that was passed in.
     */
    elementToViewBoxCoords(element: Snap.Element, lines: Line[][]): Line[][] {
        // The lines are already in element coords so have had the local matrix applied. To get back to viewbox coords
        // we need to know all transforms applied to the element.
        const matrix = this.getElementToViewBoxMatrix(element)

        lines.forEach(row => {
            return row.forEach(line => {
                line.start = {x: matrix.x(line.start.x, line.start.y), y: matrix.y(line.start.x, line.start.y)}
                line.end = {x: matrix.x(line.end.x, line.end.y), y: matrix.y(line.end.x, line.end.y)}
            })
        })

        return lines
    }

    /**
     * Converts a bounding box in element coords to the corresponding rectangle in viewbox coords
     */
    bboxToViewBoxRect(element: Snap.Element, bbox: Snap.BBox): Rectangle {
        const matrix = this.getElementToViewBoxMatrix(element)

        const x = matrix.x(bbox.x, bbox.y)
        const y = matrix.y(bbox.x, bbox.y)
        const x2 = matrix.x(bbox.x + bbox.width, bbox.y + bbox.height)
        const y2 = matrix.y(bbox.x + bbox.width, bbox.y + bbox.height)
        const width = Math.abs(x2 - x)
        const height = Math.abs(y2 - y)

        return {
            x: x,
            y: y,
            width: width,
            height: height
        }
    }

    /**
     * The distance between stitch rows is defined in mm. To be able to generatet the scanlines, which are in element
     * coords, we need to convert mm to element coords. The viewport is defined in mm but may have been resized due
     * to zooming so we need to know the original viewport size in mm to do the calculation.
     */
    mmToElementLength(element: Snap.Element, mm: number): number {
        const viewboxMM = this.mmToViewBoxLength(mm)
        const matrix = this.getViewBoxToElementMatrix(element)

        const width = matrix.x(0, viewboxMM) - matrix.x(0, 0)
        const length = matrix.y(0, viewboxMM) - matrix.y(0, 0)

        const number = Math.sqrt(width * width + length * length)
        return number
    }

    mmToViewBoxLength(mm: number): number {
        const width = this.paper.attr('width')

        const viewBox = this.paper.attr('viewBox')

        const scalingWidth = viewBox.width / Number(width.slice(0, width.length - 2))

        const scaledValue = scalingWidth * mm * this.zoomScalingFactor()

        return scaledValue
    }

    private zoomScalingFactor(): number {
        const viewportWidthMM = this.paper.attr('width')
        const currentViewportWidth = Number(viewportWidthMM.slice(0, viewportWidthMM.length - 2))
        return currentViewportWidth / this.unzoomedViewportWidth
    }

    private getViewBoxToElementMatrix(element: Snap.Element): Snap.Matrix {
        return this.getElementToViewBoxMatrix(element).invert()
    }

    /**
     * Converts from element coords to viewbox coords. If there is no scaling applied this should return just a simple
     * 1:1 scaling factor.
     *
     * To do this we get the global transform applied to the element and
     * then subtract the global transform applied to the paper itself, eg the paper may have been scaled to fit inside
     * the containing div which doesn't affect the coords we are using.
     */
    private getElementToViewBoxMatrix(element: Snap.Element): Snap.Matrix {
        const matrix = this.paper.transform().globalMatrix.invert()
        matrix.add(element.transform().globalMatrix)

        return matrix
    }

    zoomIn() {
        this.zoom(1.2)
    }

    zoomOut() {
        this.zoom(0.8)
    }

    private zoom(factor: number) {
        if (this.paper === undefined) {
            return
        }

        const w1 = this.paper.attr('width')
        const w2 = Number(w1.slice(0, w1.length - 2))

        const h1 = this.paper.attr('height')
        const h2 = Number(h1.slice(0, h1.length - 2))

        this.paper.attr({
            // viewBox: {x: box.x, y:box.y, width: box.width / factor, height: box.height /factor},
            width: `${w2 * factor}mm`, height: `${h2 * factor}mm`
        })
    }

    /**
     * We need an id on everything so that we can associate the element with the extra data for stitching
     */
    private addIdToAllElements = (fragment: Snap.Element) => {
        if (fragment.attr('id') === undefined) {
            fragment.attr({id: uuid()})
        }

        fragment.children().forEach(this.addIdToAllElements)
    }
}


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
