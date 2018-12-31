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

    constructor() {
        console.log("EventService started")
    }

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
    PALETTE_SELECTED,
    FILL_COLOUR_SELECTED
}

export class FileLoadedEvent {
    constructor(public readonly root: SVGSVGElement, public readonly scaling: number, public readonly name: string) {}

    readonly event = Events.FILE_LOADED
}

export class ElementSelectedEvent {
    constructor(public readonly element: SVGPathElement) {}

    readonly event = Events.ELEMENT_SELECTED
}

export class ElementDeselectedEvent {
    readonly event = Events.ELEMENT_DESELECTED
}

export class PaletteSelectedEvent {
    constructor(public readonly palette: Palette) {}

    readonly event = Events.PALETTE_SELECTED
}

export class FillColourSelectedEvent {
    constructor(public readonly colourNumber: string) {}

    readonly event = Events.FILL_COLOUR_SELECTED
}

export type Event = FileLoadedEvent | ElementSelectedEvent | ElementDeselectedEvent | PaletteSelectedEvent | FillColourSelectedEvent
