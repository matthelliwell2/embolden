import { Injectable, Renderer2, RendererFactory2 } from "@angular/core"
import { Point, SatinFillType, Shape } from "./models"
import { PubSubService } from "./pub-sub.service"
import { RenderSettings, SettingsService } from "./settings.service"

/**
 * This is responsible for rendering an image of the stitches onto the screen
 */
@Injectable({
    providedIn: "root"
})
export class RenderService {
    private stitchGroup: SVGGElement
    private scaling: number
    private renderSettings = new RenderSettings()
    private renderer: Renderer2

    constructor(private pubSubService: PubSubService, rendererFactory: RendererFactory2, settingsService: SettingsService) {
        this.renderer = rendererFactory.createRenderer(null, null)
        this.renderSettings = settingsService.renderSettings
        this.pubSubService.subscribe(this)
    }

    onFileLoaded(file: { svg: SVGSVGElement; scaling: number }) {
        this.scaling = file.scaling
        this.deleteCssDefs(file.svg)
        this.deleteMarkerDefs(file.svg)
        this.addMarkers(file.svg)

        this.createStitchGroup(file.svg)
    }

    onRenderSettingsChanged(settings: RenderSettings) {
        this.renderSettings = settings
        this.stitchGroup.setAttribute("stroke-width", `${this.renderSettings.strokeWidth * this.scaling}px`)
        this.stitchGroup.setAttribute("stroke", this.renderSettings.colour)
    }

    /**
     * Draws the stitches for an element.
     */
    render(shape: Shape): void {
        if (shape.fillType !== SatinFillType.None) {
            this.addStitchLinesToGroup(shape)
        }
    }

    private addMarkers(svg: SVGSVGElement): void {
        let defs = svg.querySelector("defs")
        if (!defs) {
            const defsElement = this.renderer.createElement("defs", "svg")
            svg.appendChild(defsElement)
            defs = svg.querySelector("defs")!
        }

        const markerArrow = this.renderer.createElement("marker", "svg")
        markerArrow.setAttribute("id", "markerArrow")
        markerArrow.setAttribute("markerWidth", `${1 * this.scaling}`)
        markerArrow.setAttribute("markerHeight", `${1 * this.scaling}`)
        markerArrow.setAttribute("refX", `${1 * this.scaling}`)
        markerArrow.setAttribute("refY", `${0.5 * this.scaling}`)
        markerArrow.setAttribute("orient", "auto")
        markerArrow.setAttribute("markerUnits", "userSpaceOnUse")

        const path = this.renderer.createElement("path", "svg")
        path.setAttribute("d", `M0,0 L${1 * this.scaling},${0.5 * this.scaling} L0,${1 * this.scaling}`)
        path.setAttribute("class", "marker")
        markerArrow.appendChild(path)

        defs.appendChild(markerArrow)
    }

    private deleteCssDefs(svg: SVGSVGElement): void {
        const defs = svg.querySelector("defs")
        if (defs) {
            const style = defs.querySelector('style[type="text/css"]')
            if (style) {
                defs.removeChild(style)
            }
        }
    }

    private deleteMarkerDefs(svg: SVGSVGElement): void {
        const defs = svg.querySelector("defs")
        if (defs) {
            const markers = defs.querySelectorAll("marker")
            if (markers) {
                markers.forEach(marker => defs.removeChild(marker))
            }
        }
    }

    /**
     * Adds the lines representing the path of the stitching to the group.
     */
    private addStitchLinesToGroup(shape: Shape): void {
        this.stitchesToPaths(shape.stitches).forEach(path => {
            const element = this.renderer.createElement("path", "svg") as SVGPathElement
            element.setAttribute("fill", "none")
            element.setAttribute("d", path)
            element.setAttribute("class", "stitchablePath")
            this.renderer.appendChild(this.stitchGroup, element)
        })
    }

    /**
     * Create an SVG group to hold the lines and circles used to render the stitches
     */
    private createStitchGroup(svg: SVGSVGElement): void {
        if (this.stitchGroup !== undefined) {
            this.stitchGroup.remove()
        }

        const strokeWidth = this.renderSettings.strokeWidth * this.scaling
        this.stitchGroup = this.renderer.createElement("g", "svg") as SVGGElement
        this.stitchGroup.setAttribute("stroke-width", `${strokeWidth}px`)
        this.stitchGroup.setAttribute("stroke", this.renderSettings.colour)
        this.renderer.appendChild(svg, this.stitchGroup)
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
