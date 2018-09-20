import {Injectable} from '@angular/core'
import {SvgService} from "./svg.service"
import {ElementProperties} from "./models"

/**
 * This is responsible for rendering an image of the stitches onto the screen
 */
@Injectable({
    providedIn: 'root'
})
export class RenderService {

    constructor(private svgService: SvgService) {
    }

    /**
     * Draws the stitches for an element.
     */
    render(element: ElementProperties): void {
        const paper = element.element.paper!
        if (element.group !== undefined) {
            element.group.remove()
        }

        element.group = paper.g()

        const radius = this.svgService.mmToViewBoxLength(0.2)
        element.stitches.forEach(point => {
            const circle = paper.circle(point.x, point.y, radius)
            circle.attr({stroke: "#00F", fill: "none", strokeWidth: "1", "vector-effect": "non-scaling-stroke"})
            element.group!.add(circle)
        })

        for (let i = 0; i < element.stitches.length - 1; ++i) {
            const line = paper.line(element.stitches[i].x, element.stitches[i].y, element.stitches[i + 1].x, element.stitches[i + 1].y)
            line.attr({stroke: "#F0F", strokeWidth: "1", "vector-effect": "non-scaling-stroke"})
            element.group!.add(line)
        }
    }
}
