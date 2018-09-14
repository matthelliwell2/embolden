import {Injectable} from '@angular/core'
import * as Snap from 'snapsvg'
import * as SnapCjs from 'snapsvg-cjs'
import * as uuid from "uuid/v4"

/**
 * This service is responsible for all manipulation and logic around the svg file
 */
@Injectable({
    providedIn: 'root'
})
export class SvgService {

    // A scaling factor to convert to mm
    private static readonly PIXELS_PER_MM = 96/25.4

    // Container in which the svg file is rendered.
    container: Snap.Element

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
        let svg = this.container.select("svg") as Snap.Paper
        if (svg !== undefined && svg !== null) {
            svg.remove()
        }

        const fragment = SnapCjs.parse(fileContents)
        this.container.append(fragment)
        this.addIdToAllElements(this.container)

        svg = this.container.select("svg") as Snap.Paper
        const width = svg.attr('width')
        const height = svg.attr('height')

        if (!width.endsWith('mm') || !height.endsWith('mm')) {
            throw new Error(`Viewport units must be in mm ${width}x${height} is not supported`)
        }
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
        // The lines are already in element coords so have had the local matrix applied. To get back to user we need
        // to know all transforms applied to the element. The global transform contains a scaling of 3.7 which is to
        // try and convert pixels to mm at a nominal 96dpi. We there need to remove this scaling to get to pixels.
        // This scaling is not affected by the viewport and viewbox sizes.
        const matrix = this.getElementToViewBoxMatrix(element)

        lines.forEach(row => {
            return row.forEach(line => {
                line.start = {x: matrix.x(line.start.x, line.start.y), y: matrix.y(line.start.x, line.start.y)}
                line.end = {x: matrix.x(line.end.x, line.end.y), y: matrix.y(line.end.x, line.end.y)}
            })
        })

        console.log(lines)
        return lines
    }


    /**
     * We want to specify stitch length etc in mm. To be able to calculate stitch positions inside an element we need
     * to know what length this will be in the element coordinates. The number of mm specified is a real number and
     * not a nominal value based on 96dpi therefore we need to look at the viewport size to work out the correct
     * number of pixels.
     * @param mm
     */
    mmToElementCoords(element: Snap.Element, mm: number): number {
        // apply the element transforms, excluding the seemingly hardcoded 96dpi scaling factor the global transform has
        const matrix = this.getViewBoxToElementMatrix(element)

        const width = matrix.x(0, mm) - matrix.x(0, 0)
        const length = matrix.y(0, mm) - matrix.y(0, 0)

        return Math.sqrt(width * width + length * length)
    }

    private getViewBoxToElementMatrix(element: Snap.Element): Snap.Matrix {
        const matrix = new SnapCjs.Matrix() as Snap.Matrix
        matrix.scale(SvgService.PIXELS_PER_MM, SvgService.PIXELS_PER_MM)
        matrix.add(element.transform().globalMatrix.invert())

        return matrix
    }

    /**
     * Converts from element coords to viewbox coords. If there is no scaling applied this should return just a simple
     * 1:1 scaling factor.
     */
    private getElementToViewBoxMatrix(element: Snap.Element): Snap.Matrix {
        const matrix = this.getElementToViewportMatrix(element)
        matrix.add(this.getViewportToViewBoxMatrix(element.paper!))
        return matrix
    }

    /**
     * Converts from element to the viewport coords by apply the global transform. However this transform has an
     * additional scaling of about 97/2.54 as the viewport coords are in mm and the browser assumes there are 97dpi.
     * @param element
     */
    private getElementToViewportMatrix(element: Snap.Element): Snap.Matrix {
        const matrix = new SnapCjs.Matrix() as Snap.Matrix
        matrix.scale(1/SvgService.PIXELS_PER_MM,1/SvgService.PIXELS_PER_MM)
        matrix.add(element.transform().globalMatrix)

        return matrix
    }

    /**
     * Translates from the viewport coords to the viewbox coords by applying a simple scaling factor
     */
    private getViewportToViewBoxMatrix(paper: Snap.Paper): Snap.Matrix {
        const width = paper.attr('width')
        const height = paper.attr('height')

        const viewBox = paper.attr('viewBox')

        const scalingWidth = viewBox.width / Number(width.slice(0, width.length - 2))
        const scalingHeight = viewBox.height / Number(height.slice(0, height.length - 2))

        if (Math.abs(scalingHeight - scalingWidth) > 0.01) {
            throw new Error(`Cannot support different x and y scaling factors. Viewport=${width}x${height}. Viewbox=${viewBox}`)
        }

        const matrix = new SnapCjs.Matrix() as Snap.Matrix
        matrix.scale(scalingWidth, scalingHeight)
        return matrix
    }

    zoomIn(paper: Snap.Paper) {
        this.zoom(paper, 1.2)
    }

    zoomOut(paper: Snap.Paper) {
        this.zoom(paper, 0.8)
    }

    private zoom(paper: Snap.Paper, factor: number) {
        const w1 = paper.attr('width')
        const w2 = Number(w1.slice(0, w1.length - 2))

        const h1 = paper.attr('height')
        const h2 = Number(h1.slice(0, h1.length - 2))

        //const box = svg.attr('viewBox')
        // TODO do this properly
        paper.attr({
           // viewBox: {x: box.x, y:box.y, width: box.width / factor, height: box.height /factor},
            width: `${w2 * factor}mm`, height: `${h2 * factor}mm`
        })

        // TODO scaling
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
