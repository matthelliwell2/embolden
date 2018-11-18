import { Injectable, Renderer2 } from "@angular/core"
import { Shape } from "./models"
import * as svgpath from "svgpath"
import Point = SvgPanZoom.Point

/**
 * This service keeps track of which elements are filled with which stitches. It just hold state without any logic.
 */
@Injectable({
    providedIn: "root"
})
export class ShapeService {
    /**
     * A map of element id to the stitching properties of that element. This acts as the central control structure for
     * the stitching
     */
    readonly shapes: Map<string, Shape> = new Map()

    constructor() {}

    getShape(element: SVGPathElement, renderer: Renderer2): Shape {
        const id = element.getAttribute("id") as string
        if (!this.shapes.has(id)) {
            const segments = this.getSegmentPaths(element, renderer)

            this.shapes.set(id, new Shape(element, segments))
        }

        return this.shapes.get(id)!
    }

    private getSegmentPaths(element: SVGPathElement, renderer: Renderer2): SVGPathElement[] {
        const path = svgpath(element.getAttribute("d") as string)
        const segmentElements: SVGPathElement[] = []
        let firstSegment: Point
        let previousSegment: SVGPathElement
        path.iterate(
            (segment, index, x, y): void => {
                if (segment[0] === "Z") {
                    // To close the path we move from the end of the previous segment to the start of the first segment
                    const len = previousSegment!.getTotalLength()
                    const end = previousSegment!.getPointAtLength(len)
                    const path = `M${end.x},${end.y}L${firstSegment.x},${firstSegment.y}`
                    const segmentElement = this.stringToPathElement(path, renderer)
                    this.renderElement(segmentElement, element, renderer)
                    segmentElements.push(segmentElement)
                } else if (segment[0] !== "M") {
                    if (!firstSegment) {
                        firstSegment = { x: x, y: y }
                    }

                    // Add a move to the start of the segment so it starts from the right place
                    const path = `M${x},${y} ${segment.join(" ")}`

                    const segmentElement = this.stringToPathElement(path, renderer)
                    this.renderElement(segmentElement, element, renderer)
                    segmentElements.push(segmentElement)

                    previousSegment = segmentElement
                }
            }
        )

        return segmentElements
    }

    /**
     * We have to actually render the elements otherwise calls to getBBox etc don't work.
     */
    private renderElement(element: SVGPathElement, parent: SVGPathElement, renderer: Renderer2) {
        element.setAttribute("visibility", "hidden")
        renderer.appendChild(parent.parentNode, element)
    }

    private stringToPathElement(path: string, renderer: Renderer2): SVGPathElement {
        const element = renderer.createElement("path", "svg") as SVGPathElement
        element.setAttribute("d", path)
        return element
    }
}
