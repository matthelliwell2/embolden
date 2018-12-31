import * as svgPanZoom from "svg-pan-zoom"
import { Component, ElementRef, NgZone, OnInit, Renderer2, ViewChild } from "@angular/core"
import { Commands, CommandService } from "../command.service"
import { Destroyable } from "../lib/Store"
import { takeUntil } from "rxjs/operators"
import { FileLoader } from "./FileLoader"
import { ElementDeselectedEvent, ElementSelectedEvent, Events, EventService, FileLoadedEvent } from "../event.service"
import { SatinFillType } from "../models"
import { StitchGenerator } from "./StitchGenerator"
import { DesignService } from "../design.service"
import { StitchRenderer } from "./StitchRenderer"

/**
 * This component is the central component that renders the svg and lets the user edit stitches.
 */
@Component({
    selector: "app-edit",
    templateUrl: "./edit.component.html",
    styleUrls: ["./edit.component.css"]
})
export class EditComponent extends Destroyable implements OnInit {
    private svg: SVGSVGElement
    private group: SVGGElement

    private selectionRect1: SVGGraphicsElement | undefined
    private selectionRect2: SVGGraphicsElement | undefined
    private selectedElement: SVGGraphicsElement | undefined
    @ViewChild("container") container: ElementRef

    constructor(
        private commandService: CommandService,
        private eventService: EventService,
        private fileLoader: FileLoader,
        private zone: NgZone,
        private renderer2: Renderer2,
        private stitchGenerator: StitchGenerator,
        private stitchRenderer: StitchRenderer,
        private designService: DesignService
    ) {
        super()
    }

    ngOnInit() {
        this.commandService
            .getStream()
            .pipe(takeUntil(this.destroyed))
            .subscribe(async command => {
                switch (command.command) {
                    case Commands.LOAD_FILE:
                        await this.loadFile(command.file)
                        break
                    case Commands.FILL_SELECTED_SHAPE:
                        this.fillSelectedShape(command.fillType)
                        break
                }
            })

        this.eventService
            .getStream()
            .pipe(takeUntil(this.destroyed))
            .subscribe(event => {
                switch (event.event) {
                    case Events.FILL_COLOUR_SELECTED:
                        this.updateFillColour(event.colourNumber)
                        break
                }
            })
    }

    private fillSelectedShape(fillType: SatinFillType) {
        if (this.designService.selectedShape) {
            this.designService.selectedShape.fillType = fillType
            this.stitchGenerator.fill(this.designService.selectedShape)

            const colour =
                this.designService.selectedPalette && this.designService.selectedShape.fillColourNumber
                    ? this.designService.selectedPalette.colours[this.designService.selectedShape.fillColourNumber]
                    : undefined
            this.stitchRenderer.render(this.designService.selectedShape!, colour)
        }
    }

    private updateFillColour(colourNumber: string): void {
        if (this.designService.selectedShape && this.designService.selectedPalette) {
            const colour = this.designService.selectedPalette.colours[colourNumber]

            if (colour) {
                this.stitchRenderer.updateFillColour(this.designService.selectedShape, colour)
            }
        }
    }

    private async loadFile(file: File) {
        this.selectedElement = undefined
        this.selectionRect1 = undefined
        this.selectionRect2 = undefined

        const result = await this.fileLoader.loadFile(this.container, file)

        this.svg = result.svg

        // The scaling factor converts from element coords to viewbox (mm) coords. As we have flattened the file this is the only scale factor we need.
        this.eventService.sendEvent(new FileLoadedEvent(result.svg, result.scaling, file.name))

        // Set the height to 100% so the canvas will fill the available height
        this.svg.setAttribute("height", "100%")

        svgPanZoom(this.svg, { controlIconsEnabled: true })

        this.group = this.svg.querySelector(".svg-pan-zoom_viewport") as SVGGElement

        this.renderer2.listen(this.svg, "click", this.onClick)
    }

    private readonly onClick = (event: MouseEvent) => {
        this.zone.run(() => {
            this.select(event.target as SVGPathElement)
        })
    }

    private select(element: SVGPathElement) {
        if (element.classList.contains("stitchableElement") || element.nodeName === "svg") {
            this.unselect()
        }

        if (element.classList.contains("stitchableElement")) {
            this.selectedElement = element

            // Add a class to the element so we can highlight it
            element.classList.add("selected-element")

            this.selectionRect1 = this.renderer2.createElement("rect", "svg")
            const bbox = element.getBBox()
            this.selectionRect1!.setAttribute("x", `${bbox.x}`)
            this.selectionRect1!.setAttribute("y", `${bbox.y}`)
            this.selectionRect1!.setAttribute("height", `${bbox.height}`)
            this.selectionRect1!.setAttribute("width", `${bbox.width}`)
            this.renderer2.setAttribute(this.selectionRect1, "vector-effect", "non-scaling-stroke")
            this.renderer2.addClass(this.selectionRect1, "selection-rect1")
            this.renderer2.appendChild(this.group, this.selectionRect1)

            this.selectionRect2 = this.renderer2.createElement("rect", "svg")
            this.selectionRect2!.setAttribute("x", `${bbox.x}`)
            this.selectionRect2!.setAttribute("y", `${bbox.y}`)
            this.selectionRect2!.setAttribute("height", `${bbox.height}`)
            this.selectionRect2!.setAttribute("width", `${bbox.width}`)
            this.renderer2.setAttribute(this.selectionRect2, "vector-effect", "non-scaling-stroke")
            this.renderer2.addClass(this.selectionRect2, "selection-rect2")
            this.renderer2.appendChild(this.group, this.selectionRect2)

            this.eventService.sendEvent(new ElementSelectedEvent(element))
        }
    }

    private unselect() {
        if (this.selectedElement) {
            this.selectedElement.classList.remove("selected-element")
        }

        if (this.selectionRect1) {
            this.renderer2.removeChild(this.group, this.selectionRect1)
            this.selectionRect1 = undefined
        }

        if (this.selectionRect2) {
            this.renderer2.removeChild(this.group, this.selectionRect2)
            this.selectionRect2 = undefined
        }

        this.eventService.sendEvent(new ElementDeselectedEvent())
    }
}
