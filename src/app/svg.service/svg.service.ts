import {Injectable} from '@angular/core'
import * as Snap from 'snapsvg'
import {Coord, Line, Rectangle} from "./models"
import {loadFile} from "./fileHandler"
import {getPaper} from "./util"
import * as Coords from "./coords"
import {viewBoxCoordToElementCoords} from "./coords"

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

        const paper = loadFile(this.container, fileContents)

        const width = paper.attr('width')
        this.unzoomedViewportWidth = Number(width.slice(0, width.length - 2))
        this.initialLocalMatrix = paper.transform().localMatrix

        paper.drag()

        return paper
    }

    restoreSizeAndPosition() {
        const paper = getPaper(this.container)
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
        return Coords.elementPathToElementCoords(element)
    }

    /**
     * Given lines that are in the element coordinate space this converts them to the user/viewbox coordinate space.
     * the lines are updated with the new coords. Returned array is the same as the array that was passed in.
     */
    elementToViewBoxCoords(element: Snap.Element, lines: Line[][]): Line[][] {
        return Coords.elementToViewBoxCoords(element, lines)
    }

    /**
     * Converts a bounding box in element coords to the corresponding rectangle in viewbox coords
     */
    bboxToViewBoxRect(element: Snap.Element, bbox: Snap.BBox): Rectangle {
        return Coords.bboxToViewBoxRect(element, bbox)
    }

    viewBoxCoordToElementCoords(element: Snap.Element, point: Coord): Coord {
        return Coords.viewBoxCoordToElementCoords(element, point)
    }

    /**
     * The distance between stitch rows is defined in mm. To be able to generatet the scanlines, which are in element
     * coords, we need to convert mm to element coords. The viewport is defined in mm but may have been resized due
     * to zooming so we need to know the original viewport size in mm to do the calculation.
     */
    mmToElementLength(element: Snap.Element, mm: number): number {
        return Coords.mmToElementLength(this.container, element, mm, this.unzoomedViewportWidth)
    }

    mmToViewBoxLength(mm: number): number {
        return Coords.mmToViewBoxLength(this.container, mm, this.unzoomedViewportWidth)
    }

    /**
     * For a given path and point, this works out the distance along the path to the point.
     */
    distanceAlongPath(element: Snap.Element, pointViewBoxCoords: Coord): number {
        if (element.type !== "path") {
            throw new Error(`Cannot call method on type ${element.type}`)
        }

        const point = viewBoxCoordToElementCoords(element, pointViewBoxCoords)
        const node = <SVGPathElement><any>element.node
        console.log("total length=", node.getTotalLength())

        const closest = this.getLengthAlongPathToTarget(node, point, 0, node.getTotalLength())

        console.log("closest point to", point, "is", node.getPointAtLength(closest))
        return closest
    }

    /**
     * This finds the distance along the path to the specied point. It does this by moving between the specified start and end points and checking the distance to the target
     * point to find the minimum value.
     */
    private getLengthAlongPathToTarget(path: SVGPathElement, target: Coord, startDistance: number, endDistance: number): number {

        const stepSize = (endDistance - startDistance) / 100

        let minDistanceToTarget = this.getDistanceToTarget(path, target, 0)
        let lengthAlongPathToClosestPoint = 0

        for (let lengthAlongPath = stepSize; lengthAlongPath < path.getTotalLength(); lengthAlongPath += stepSize) {
            const distanceToTarget = this.getDistanceToTarget(path, target, lengthAlongPath)

            if (distanceToTarget < minDistanceToTarget) {
                minDistanceToTarget = distanceToTarget
                lengthAlongPathToClosestPoint = lengthAlongPath
            }
        }

        this.isClosestPointBeforeTarget(path, target, lengthAlongPathToClosestPoint, stepSize / 100)
        return lengthAlongPathToClosestPoint
    }

    /**
     * We need to know if the point we've found is after before the target point on the path so we know in which direction to step to try ad get closer.
     *
     * To do this take a point on either size of closest point and see if that is closer or further from the target
     */
    private isClosestPointBeforeTarget(path: SVGPathElement, target: Coord, lengthAlongPathToClosestPoint: number, stepSize: number): boolean {
        const distanceToTargetAfter = this.getDistanceToTarget(path, target, lengthAlongPathToClosestPoint + stepSize)
        const distanceToTargetBefore = this.getDistanceToTarget(path, target, lengthAlongPathToClosestPoint - stepSize)

        return distanceToTargetBefore > distanceToTargetAfter
    }

    private getDistanceToTarget(path: SVGPathElement, target: Coord, lengthAlongPath: number): number {
        const pointOnPath = path.getPointAtLength(lengthAlongPath) as Coord

        return Math.sqrt((pointOnPath.x - target.x) * (pointOnPath.x - target.x) + (pointOnPath.y - target.y) * (pointOnPath.y - target.y))
    }

    zoomIn() {
        this.zoom(1.2)
    }

    zoomOut() {
        this.zoom(0.8)
    }

    private zoom(factor: number) {
        const paper = getPaper(this.container)
        if (paper !== undefined) {
            paper.transform(paper.transform().localMatrix.scale(factor, factor).toTransformString())
        }
    }

}
