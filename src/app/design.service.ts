import { Injectable, Renderer2, RendererFactory2 } from "@angular/core"
import { PathPart, Shape } from "./models"
import * as svgpath from "svgpath"
import { Events, EventService } from "./event.service"
import { distinctUntilKeyChanged, filter, takeUntil } from "rxjs/operators"
import { Destroyable } from "./lib/Store"
import { Palette } from "./palette/palette.service"
import { select, Store } from "@ngrx/store"
import { DesignState } from "./store/file/file.reducer"
import { State } from "./store"
import Point = SvgPanZoom.Point

/**
 * This service keeps track of the state of the design so far.
 */
@Injectable({
    providedIn: "root"
})
export class DesignService extends Destroyable {
    private readonly renderer: Renderer2
    private _selectedShape: Shape | undefined = undefined
    private _selectedPalette: Palette | undefined = undefined
    private _name: string | undefined = undefined

    /**
     * A map of element id to the stitching properties of that element. This acts as the central control structure for
     * the stitching
     * TODO this will need some way of supporting ordering
     */
    readonly shapes: Map<string, Shape> = new Map()

    constructor(rendererFactory: RendererFactory2, private eventService: EventService, private store: Store<State>) {
        super()
        console.log("DesignService started")

        this.store
            .pipe(
                select(state => state.design),
                filter(design => design !== undefined),
                distinctUntilKeyChanged("name"),
                takeUntil(this.destroyed)
            )
            .subscribe((state: DesignState) => {
                this.onFileLoaded(state.name)
            })

        this.renderer = rendererFactory.createRenderer(null, null)

        this.eventService
            .getStream()
            .pipe(takeUntil(this.destroyed))
            .subscribe(event => {
                switch (event.event) {
                    case Events.ELEMENT_SELECTED:
                        this.onElementSelected(event.element)
                        break
                    case Events.ELEMENT_DESELECTED:
                        this.onElementDeselected()
                        break
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

    private getShape(element: SVGPathElement): Shape {
        const id = element.getAttribute("id") as string
        if (!this.shapes.has(id)) {
            const pathParts = this.getPathParts(element)

            this.shapes.set(id, new Shape(element, pathParts))
        }

        return this.shapes.get(id)!
    }

    // Don't reset the palette so we can keep using the same palette for a new design
    private onFileLoaded = (name: string) => {
        // We've loaded a new file so clear down the cache of shapes from the previous file
        this.shapes.clear()
        this._selectedShape = undefined
        this._name = name
    }

    private onElementSelected(element: SVGPathElement) {
        this._selectedShape = this.getShape(element)
    }

    private onElementDeselected() {
        this._selectedShape = undefined
    }

    private onPaletteSelected(palette: Palette) {
        this._selectedPalette = palette
    }

    private onFillColourSelected(colourNumber: string): void {
        if (this._selectedShape) {
            this._selectedShape.fillColourNumber = colourNumber
        }
    }

    /**
     * This breaks the paths into a series of L and M comnands that makes up the complete path. We'll call these segments.
     *
     * In addition the path may be made up of a number of discontiguous parts that are separated by Move commands. We've calls these subpaths. We need to know in which subpath
     * a segment is in so that we can work out if we can move from one segment to another along the edge of the path.
     */
    private getPathParts(element: SVGPathElement): PathPart[] {
        const path = svgpath(element.getAttribute("d") as string)
        const pathParts: PathPart[] = []
        let startOfSubpath: Point
        let subPathNumber = -1
        let previousSegment: SVGPathElement
        path.iterate(
            (segment, index, x, y): void => {
                if (segment[0] === "Z") {
                    // To close the path we move from the end of the previous segment to the start of the first segment
                    const len = previousSegment!.getTotalLength()
                    const end = previousSegment!.getPointAtLength(len)
                    const path = `M${end.x},${end.y}L${startOfSubpath.x},${startOfSubpath.y}`
                    const segmentElement = this.stringToPathElement(path)
                    this.renderElement(segmentElement, element)
                    pathParts.push({ segment: segmentElement, subPath: subPathNumber })
                } else if (segment[0] !== "M") {
                    // We've got an L or C command that forms a segment. Add a move command to the start  of the segment so it starts from the right place
                    const path = `M${x},${y} ${segment.join(" ")}`

                    const segmentElement = this.stringToPathElement(path)
                    this.renderElement(segmentElement, element)
                    pathParts.push({ segment: segmentElement, subPath: subPathNumber })

                    previousSegment = segmentElement
                } else if (segment[0] === "M") {
                    // A series of commands are separated by moves. Keep track of the move at the start of the commands so that if we get a Z command, we can close the path
                    // path to this point.
                    startOfSubpath = { x: segment[1], y: segment[2] }
                    ++subPathNumber
                }
            }
        )

        return pathParts
    }

    /**
     * We have to actually render the elements otherwise calls to getBBox etc don't work.
     */
    private renderElement(element: SVGPathElement, parent: SVGPathElement) {
        element.setAttribute("visibility", "hidden")
        this.renderer.appendChild(parent.parentNode, element)
    }

    private stringToPathElement(path: string): SVGPathElement {
        const element = this.renderer.createElement("path", "svg") as SVGPathElement
        element.setAttribute("d", path)
        return element
    }
}
