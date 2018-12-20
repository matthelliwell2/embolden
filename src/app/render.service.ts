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
    private svg: SVGSVGElement
    private renderSettings = new RenderSettings()
    private renderer: Renderer2

    private markerArrow: SVGMarkerElement
    private markerCircle: SVGMarkerElement
    private markerSolidCircle: SVGMarkerElement

    constructor(private pubSubService: PubSubService, rendererFactory: RendererFactory2, settingsService: SettingsService) {
        this.renderer = rendererFactory.createRenderer(null, null)
        this.renderSettings = settingsService.renderSettings
        this.pubSubService.subscribe(this)
    }

    onFileLoaded(file: { svg: SVGSVGElement; scaling: number }) {
        this.scaling = file.scaling
        this.svg = file.svg

        this.deleteCssDefs(file.svg)
        this.deleteMarkerDefs(file.svg)

        this.addMarkers()
        this.createStitchGroup()
    }

    onRenderSettingsChanged(settings: RenderSettings) {
        this.renderSettings = settings
        this.setRenderAttributes()
    }

    /**
     * Draws the stitches for an element.
     */
    render(shape: Shape): void {
        if (shape.fillType !== SatinFillType.None) {
            this.addStitchLinesToGroup(shape)
        }
    }

    private addMarkers(): void {
        let defs = this.svg.querySelector("defs")
        if (!defs) {
            const defsElement = this.renderer.createElement("defs", "svg")
            this.svg.appendChild(defsElement)
            defs = this.svg.querySelector("defs")!
        }

        this.markerCircle = this.createMarker("markerCircle", this.createCircle())
        this.markerSolidCircle = this.createMarker("markerSolidCircle", this.createSolidCircle())
        this.markerArrow = this.createMarker("markerArrow", this.createArrow())

        this.setRenderAttributes()

        defs.appendChild(this.markerArrow)
        defs.appendChild(this.markerCircle)
        defs.appendChild(this.markerSolidCircle)
    }

    private createCircle(): SVGGraphicsElement {
        const circle = this.renderer.createElement("circle", "svg") as SVGCircleElement
        circle.setAttribute("cx", `${0.5}`)
        circle.setAttribute("cy", `${0.5}`)
        circle.setAttribute("r", `${0.45}`)
        circle.setAttribute("class", "marker")
        circle.setAttribute("fill", "none")

        return circle
    }

    private createSolidCircle(): SVGGraphicsElement {
        const circle = this.renderer.createElement("circle", "svg") as SVGCircleElement
        circle.setAttribute("cx", `${0.5}`)
        circle.setAttribute("cy", `${0.5}`)
        circle.setAttribute("r", `${0.45}`)
        circle.setAttribute("class", "marker")

        return circle
    }

    private createArrow(): SVGGraphicsElement {
        const path = this.renderer.createElement("path", "svg") as SVGPathElement
        path.setAttribute("d", "M0,0 L1,0.5 L0,1 L0.5,0.5Z")
        path.setAttribute("class", "marker")
        path.setAttribute("stroke-linecap", "round")
        path.setAttribute("fill", "none")

        return path
    }

    private createMarker(id: string, element: SVGGraphicsElement): SVGMarkerElement {
        const marker = this.renderer.createElement("marker", "svg") as SVGMarkerElement
        marker.setAttribute("id", id)
        marker.setAttribute("orient", "auto")
        marker.setAttribute("markerUnits", "userSpaceOnUse")

        marker.appendChild(element)
        this.setMarkerAttributes(marker)

        return marker
    }

    private setMarkerAttributes(marker) {
        const scaling = this.scaling * this.renderSettings.markerSize

        marker.setAttribute("markerWidth", `${scaling}`)
        marker.setAttribute("markerHeight", `${scaling}`)
        marker.setAttribute("refX", `${scaling / 2}`)
        marker.setAttribute("refY", `${scaling / 2}`)

        marker.setAttribute("stroke", this.renderSettings.colour)

        const element = marker.childNodes[0] as SVGGraphicsElement
        if (this.renderSettings.showMarkers) {
            element.removeAttribute("style")
        } else {
            element.setAttribute("style", "display: none")
        }

        element.setAttribute("stroke-width", `${this.renderSettings.strokeWidth}px`)
        const transform = this.svg.createSVGTransform()
        transform.setScale(scaling, scaling)
        element.transform.baseVal.clear()
        element.transform.baseVal.appendItem(transform)
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
    private createStitchGroup(): void {
        if (this.stitchGroup !== undefined) {
            this.stitchGroup.remove()
        }

        this.stitchGroup = this.renderer.createElement("g", "svg") as SVGGElement
        this.setRenderAttributes()
        this.renderer.appendChild(this.svg, this.stitchGroup)
    }

    private setRenderAttributes(): void {
        const strokeWidth = this.renderSettings.strokeWidth * this.scaling

        if (this.stitchGroup) {
            this.stitchGroup.setAttribute("stroke-width", `${strokeWidth}px`)
            this.stitchGroup.setAttribute("stroke", this.renderSettings.colour)
        }

        if (this.markerArrow) {
            this.setMarkerAttributes(this.markerArrow)
        }

        if (this.markerCircle) {
            this.setMarkerAttributes(this.markerCircle)
        }

        if (this.markerSolidCircle) {
            this.setMarkerAttributes(this.markerSolidCircle)
        }
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
            } else if (isNaN(stitches[i].x)) {
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
}
