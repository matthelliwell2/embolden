import { Injectable } from "@angular/core"
import { SvgService } from "./svg.service/svg.service"
import { SatinFillType, Shape } from "./models"
import { SettingsService } from "./settings.service"

/**
 * This is responsible for rendering an image of the stitches onto the screen
 */
@Injectable({
    providedIn: "root"
})
export class RenderService {
    constructor(private svgService: SvgService, private settingsService: SettingsService) {}

    /**
     * Draws the stitches for an element.
     */
    render(elementProperties: Shape): void {
        const width = this.svgService.mmToViewBoxLength(this.settingsService.renderSettings.renderValues.strokeWidth)

        this.createStitchGroup(elementProperties, width)

        if (elementProperties.fillType !== SatinFillType.None) {
            this.addStitchLinesToGroup(elementProperties)
            this.addStitchCirclesToGroup(elementProperties)
        }
    }

    /**
     * Adds the circles representing the penetration points to the group.
     * TODO use markers for this
     */
    private addStitchCirclesToGroup(elementProperties: Shape) {
        /* const paper = elementProperties.element.paper!
        const id = elementProperties.element.attr("id")
        const radius = this.svgService.mmToViewBoxLength(0.15)

        elementProperties.stitches.forEach(point => {
            const circle = paper.circle(point.x, point.y, radius)
            circle.attr({
                fill: "none",
                elementFor: id,
            })

            elementProperties.stitchGroup!.add(circle)
        })*/
    }

    /**
     * Adds the lines representing the path of the stitching to the group.
     */
    private addStitchLinesToGroup(elementProperties: Shape): void {
        /*const path = this.stitchesToPath(elementProperties.stitches)

        const paper = elementProperties.element.paper!
        const pathElement = paper.path(path)
        pathElement.attr({
            fill: "none",
            elementFor: elementProperties.element.attr("id")
        })
        elementProperties.stitchGroup!.add(pathElement)*/
    }

    /**
     * Create an SVG group to hold the lines and circles used to render the stitches
     */
    private createStitchGroup(elementProperties: Shape, width): void {
        /* const paper = elementProperties.element.paper!
        if (elementProperties.stitchGroup !== undefined) {
            elementProperties.stitchGroup.remove()
        }

        elementProperties.stitchGroup = paper.g()

        const id = elementProperties.element.attr("id")

        elementProperties.stitchGroup.attr({
            // Store the id of the element in the group so we can map back to the element later on
            elementFor: id,

            // Set the style on the group so that it is picked up by all the elements in the group so we only have to change it in one place.
            "stroke-width": `${width}px`,
            stroke: this.settingsService.renderSettings.renderValues.colour
        })*/
    }

    /**
     * Converts the stitch coords into an SVG path
     */
    /*private stitchesToPath(stitches: Coord[]): string {
        const parts: string[] = []
        parts.push(`M${stitches[0].x},${stitches[0].y} `)
        for (let i = 1; i < stitches.length; ++i) {
            parts.push(`L${stitches[i].x},${stitches[i].y} `)
        }

        return "".concat(... parts)
    }
*/
    /**
     * Called when we need to change the way the element is rendered because the users has changed the settings.
     */
    /*
    onRenderSettingsChanged(elementProperties: Shape) {
        const width = this.svgService.mmToViewBoxLength(this.settingsService.renderSettings.renderValues.strokeWidth)

        if (elementProperties.stitchGroup) {
            elementProperties.stitchGroup.attr({
                "stroke-width": `${width}px`,
                stroke: this.settingsService.renderSettings.renderValues.colour
            })
        }
    }
*/
}
