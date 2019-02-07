import * as svgPanZoom from "svg-pan-zoom"
import { Component, ElementRef, NgZone, OnInit, Renderer2, ViewChild } from "@angular/core"
import { Commands, CommandService } from "../command.service"
import { Destroyable } from "../lib/Store"
import { filter, map, takeUntil } from "rxjs/operators"
import { Events, EventService } from "../event.service"
import { SatinFillType, Shape } from "../models"
import { StitchGenerator } from "./StitchGenerator"
import { DesignService } from "../design.service"
import { StitchRenderer } from "./StitchRenderer"
import { ActionsSubject, select, Store } from "@ngrx/store"
import { DesignState } from "../store/file/file.reducer"
import { ofType } from "@ngrx/effects"
import { FileActionTypes, SVGFileLoadedAction, SVGFileRenderedAction } from "../store/file/file.actions"
import { AppState } from "../store"
import { ShapeDeselectedAction, ShapeSelectedAction } from "../store/select/selected.shape.actions"

/**
 * This component is the central component that renders the svg and lets the user edit stitches.
 */
@Component({
    selector: "app-edit",
    templateUrl: "./edit.component.html",
    styleUrls: ["./edit.component.css"]
})
export class EditComponent extends Destroyable implements OnInit {
    private design: DesignState

    private group: SVGGElement

    @ViewChild("container") container: ElementRef

    constructor(
        private commandService: CommandService,
        private eventService: EventService,
        private zone: NgZone,
        private renderer2: Renderer2,
        private stitchGenerator: StitchGenerator,
        private stitchRenderer: StitchRenderer,
        private designService: DesignService,
        private store$: Store<AppState>,
        private actions$: ActionsSubject
    ) {
        super()

        // Subscribe to the svg file loaded action in here rather than in a reducer/effect as we need to render the file in this component. If we didn't do this we'd
        // have to store the file contents in state and listen for the state change which would be a waste of memory and make the code more complex
        this.actions$
            .pipe(
                takeUntil(this.destroyed),
                ofType(FileActionTypes.SVG_FILE_LOADED),
                map(action => action as SVGFileLoadedAction),
                map(action => action.payload)
            )
            .subscribe(file => this.onSVGFileLoaded(file.name, file.contents))

        this.store$
            .pipe(
                select(state => state.design),
                filter(design => design !== undefined),
                takeUntil(this.destroyed)
            )
            .subscribe((design: DesignState) => {
                this.design = design
            })
    }

    ngOnInit() {
        this.commandService
            .getStream()
            .pipe(takeUntil(this.destroyed))
            .subscribe(async command => {
                switch (command.command) {
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

    /**
     * At SVG file has been loaded into memory and can be rendered. The rendering is tightly tied to the component so we do it in here rather than in an effect.
     */
    private onSVGFileLoaded(name: string, contents: string) {
        console.log("onSVGFileLoaded ", name)

        this.container.nativeElement.innerHTML = contents

        const svg = Array.from<Node>(this.container.nativeElement.childNodes).filter(node => node.nodeName === "svg")
        if (svg.length !== 1) {
            throw new Error("Unable to find root svg element")
        }

        const root = svg[0] as SVGSVGElement

        this.addClassToAllElements(root, "stitchableShape")

        if (root.width.baseVal.unitType !== SVGLength.SVG_LENGTHTYPE_MM || root.height.baseVal.unitType !== SVGLength.SVG_LENGTHTYPE_MM) {
            throw new Error("Viewport unit must be in mm")
        }

        // Note we dispatch the rendered event before the pan/zoom control is added. This is so that the processing of the event doesn't get mixed trying to manipulate the
        // SVG elements added by the pan/zoom control.
        this.store$.dispatch(new SVGFileRenderedAction({ name: name, root: root, renderer: this.renderer2 }))

        // Set the height to 100% so the canvas will fill the available height
        root.setAttribute("height", "100%")

        svgPanZoom(root, { controlIconsEnabled: true })

        this.group = root.querySelector(".svg-pan-zoom_viewport") as SVGGElement

        this.renderer2.listen(root, "click", this.onClick)
    }

    /**
     * Add a class to all the stitchable elements so that they are easy to identify and can be controlled by CSS. This is done as soon as possible so no other elements have been
     * drawn yet and processing can rely on this class being present
     */
    private addClassToAllElements(node: Node, className: string) {
        if (this.isSVGGeometeryElement(node)) {
            node.classList.add(className)
        }

        node.childNodes.forEach(node => {
            this.addClassToAllElements(node, className)
        })
    }

    private isSVGGeometeryElement(node: Node): node is SVGGeometryElement {
        return node instanceof SVGGeometryElement
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

    private readonly onClick = (event: MouseEvent) => {
        this.zone.run(() => {
            this.selectOrDeselectShape(event.target as SVGPathElement)
        })
    }

    private selectOrDeselectShape(element: SVGPathElement) {
        const selectedShape = this.design.shapes.get(element.getAttribute("id")!) as Shape
        if (selectedShape || element.nodeName === "svg") {
            this.store$.dispatch(new ShapeDeselectedAction({ group: this.group, renderer: this.renderer2 }))
        }

        if (selectedShape) {
            this.store$.dispatch(new ShapeSelectedAction({ selectedShape: selectedShape, group: this.group, renderer: this.renderer2 }))
        }
    }
}
