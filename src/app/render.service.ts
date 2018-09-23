import {Injectable} from '@angular/core'
import {SvgService} from "./svg.service"
import {ElementProperties} from "./models"
import {SettingsService} from "./settings.service"

/**
 * This is responsible for rendering an image of the stitches onto the screen
 */
@Injectable({
    providedIn: 'root'
})
export class RenderService {

    constructor(private svgService: SvgService,
                private settingsService: SettingsService) {
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

        // Store the id of the element in the group so we can map back to the element later on
        const id = element.element.attr("id")
        element.group.attr({
            elementFor: id,
            class: "render-group",
            style: `stroke-width: ${this.settingsService.renderSettings.strokeWidth}px; stroke: #F0F;`
        })

        for (let i = 0; i < element.stitches.length - 1; ++i) {
            const line = paper.line(element.stitches[i].x, element.stitches[i].y, element.stitches[i + 1].x, element.stitches[i + 1].y)
            element.group!.add(line)
        }

        const radius = this.svgService.mmToViewBoxLength(0.2)
        element.stitches.forEach(point => {
            const circle = paper.circle(point.x, point.y, radius)
            circle.attr({stroke: "#00F", fill: "none", strokeWidth: "1", "vector-effect": "non-scaling-stroke"})
            element.group!.add(circle)
        })
    }

    onRenderSettingsChanged(element: ElementProperties) {
        console.log("onRenderSettingsChanged", this.settingsService.renderSettings.strokeWidth)
        if (element.group) {
            element.group.attr({
                style: `stroke-width: ${this.settingsService.renderSettings.strokeWidth}px; stroke: #F0F;`
            })
        }
    }
}
