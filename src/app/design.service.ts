import { Injectable, RendererFactory2 } from "@angular/core"
import { Shape } from "./models"
import { Events, EventService } from "./event.service"
import { distinctUntilKeyChanged, filter, takeUntil } from "rxjs/operators"
import { Destroyable } from "./lib/Store"
import { Palette } from "./palette/palette.service"
import { select, Store } from "@ngrx/store"
import { DesignState } from "./store/file/file.reducer"
import { AppState } from "./store"

/**
 * This service keeps track of the state of the design so far.
 */
@Injectable({
    providedIn: "root"
})
export class DesignService extends Destroyable {
    private _selectedShape: Shape | undefined = undefined
    private _selectedPalette: Palette | undefined = undefined
    private _name: string | undefined = undefined

    /**
     * A map of element id to the stitching properties of that element. This acts as the central control structure for
     * the stitching
     * TODO this will need some way of supporting ordering
     */
    readonly shapes: Map<string, Shape> = new Map()

    constructor(rendererFactory: RendererFactory2, private eventService: EventService, private store$: Store<AppState>) {
        super()
        console.log("DesignService started")

        this.store$
            .pipe(
                select(state => state.design),
                filter(design => design !== undefined),
                distinctUntilKeyChanged("name"),
                takeUntil(this.destroyed)
            )
            .subscribe((state: DesignState) => {
                this.onFileLoaded(state.name)
            })

        this.store$
            .pipe(
                select(state => state.selectedShape.selectedShape),
                filter(shape => shape !== undefined),
                takeUntil(this.destroyed)
            )
            .subscribe((shape: Shape) => {
                this._selectedShape = shape
            })

        this.eventService
            .getStream()
            .pipe(takeUntil(this.destroyed))
            .subscribe(event => {
                switch (event.event) {
                    case Events.PALETTE_SELECTED:
                        this.onPaletteSelected(event.palette)
                        break
                    case Events.FILL_COLOUR_SELECTED:
                        this.onFillColourSelected(event.colourNumber)
                }
            })
    }

    get selectedShape(): Shape | undefined {
        return this._selectedShape
    }

    get selectedPalette(): Palette | undefined {
        return this._selectedPalette
    }

    /**
     * Name of the file that was loaded to create this design
     */
    get name(): string | undefined {
        return this._name
    }

    /**
     * Returns all the shapes that we can attempt to sew
     */
    get sewableShapes(): Shape[] {
        return Array.from(this.shapes.values())
            .filter(shape => shape.fillColourNumber)
            .filter(shape => this.getNumStitches(shape) > 0)
    }

    private getNumStitches(shape: Shape): number {
        return shape.stitches.reduce((total, stitches) => total + stitches.length, 0)
    }

    // Don't reset the palette so we can keep using the same palette for a new design
    private onFileLoaded = (name: string) => {
        // We've loaded a new file so clear down the cache of shapes from the previous file
        this.shapes.clear()
        this._selectedShape = undefined
        this._name = name
    }

    private onPaletteSelected(palette: Palette) {
        this._selectedPalette = palette
    }

    private onFillColourSelected(colourNumber: string): void {
        if (this._selectedShape) {
            this._selectedShape.fillColourNumber = colourNumber
        }
    }
}
