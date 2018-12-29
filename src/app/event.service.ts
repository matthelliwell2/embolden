import { Injectable } from "@angular/core"
import { Observable, Subject } from "rxjs"
import { Palette } from "./palette/palette.service"

/**
 * Exposes observable against which the system can publish events.
 */
@Injectable({
    providedIn: "root"
})
export class EventService {
    private subject = new Subject<Event>()

    constructor() {}

    getStream(): Observable<Event> {
        return this.subject.asObservable()
    }

    sendEvent(event: Event) {
        this.subject.next(event)
    }
}

export enum Events {
    FILE_LOADED,
    ELEMENT_SELECTED,
    ELEMENT_DESELECTED,
    PALETTE_SELECTED
}

export class FileLoadedEvent {
    constructor(root: SVGSVGElement, scaling: number) {
        this.root = root
        this.scaling = scaling
    }

    readonly event = Events.FILE_LOADED
    readonly root: SVGSVGElement
    readonly scaling: number
}

export class ElementSelectedEvent {
    constructor(element: SVGPathElement) {
        this.element = element
    }

    readonly event = Events.ELEMENT_SELECTED
    readonly element: SVGPathElement
}

export class ElementDeselectedEvent {
    readonly event = Events.ELEMENT_DESELECTED
}

export class PaletteSelectedEvent {
    constructor(palette: Palette) {
        this.palette = palette
    }

    readonly event = Events.PALETTE_SELECTED
    readonly palette: Palette
}

export type Event = FileLoadedEvent | ElementSelectedEvent | ElementDeselectedEvent | PaletteSelectedEvent
