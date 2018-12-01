import { Injectable, Renderer2 } from "@angular/core"
import { Point, SatinFillType, Shape } from "./models"
import { SettingsService } from "./settings.service"

/**
 * This is responsible for rendering an image of the stitches onto the screen
 */
@Injectable({
    providedIn: "root"
})
export class RenderService {
    constructor(private settingsService: SettingsService) {}

    /**
     * Draws the stitches for an element.
     */
    render(shape: Shape, scaling: number, renderer: Renderer2): void {
        const strokeWidth = this.settingsService.renderSettings.renderValues.strokeWidth * scaling

        this.createStitchGroup(shape, strokeWidth, renderer)

        if (shape.fillType !== SatinFillType.None) {
            this.addStitchLinesToGroup(shape, renderer)
            // this.addStitchCirclesToGroup(shape, renderer, scaling)
        }
    }

    /**
     * Adds the circles representing the penetration points to the group.
     * TODO use markers for this
     */
    /*   private addStitchCirclesToGroup(shape: Shape, renderer: Renderer2, scaling: number) {
        // Shove some circles along the shape element to see where they are
        const radius = 0.15 * scaling

        shape.

        shape.stitches.forEach(point => {
            const circle = paper.circle(point.x, point.y, radius)
            circle.attr({
                fill: "none",
                elementFor: id,
            })

            shape.stitchGroup!.add(circle)
        })
    }
*/
    /**
     * Adds the lines representing the path of the stitching to the group.
     */
    private addStitchLinesToGroup(shape: Shape, renderer: Renderer2): void {
        this.stitchesToPaths(shape.stitches).forEach(path => {
            const element = renderer.createElement("path", "svg") as SVGPathElement
            element.setAttribute("fill", "none")
            element.setAttribute("d", path)
            renderer.appendChild(shape.stitchGroup, element)
        })
    }

    /**
     * Create an SVG group to hold the lines and circles used to render the stitches
     */
    private createStitchGroup(shape: Shape, strokeWidth: number, renderer: Renderer2): void {
        const container = shape.element.parentNode
        if (shape.stitchGroup !== undefined) {
            shape.stitchGroup.remove()
        }

        shape.stitchGroup = renderer.createElement("g", "svg") as SVGGElement
        shape.stitchGroup.setAttribute("stroke-width", `${strokeWidth}px`)
        shape.stitchGroup.setAttribute("stroke", this.settingsService.renderSettings.renderValues.colour)
        renderer.appendChild(container, shape.stitchGroup)
    }

    /**
     * Converts the stitch coords into an SVG path
     */
    private stitchesToPaths(stitches: Point[]): string[] {
        const paths: string[] = []
        let path: string[] = []
        for (let i = 0; i < stitches.length; ++i) {
            if (path.length === 0) {
                path.push(`M${stitches[i].x},${stitches[i].y} `)
            }

            if (isNaN(stitches[i].x)) {
                // We need to start a new path
                paths.push("".concat(...path))
                path = []
            } else {
                path.push(`L${stitches[i].x},${stitches[i].y} `)
            }
        }

        if (path.length > 0) {
            paths.push("".concat(...path))
        }
        return paths
    }

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
