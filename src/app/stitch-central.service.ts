import {Injectable} from '@angular/core'
import * as Snap from 'snapsvg'
import {Subject, Subscription} from 'rxjs'
import {StitchService} from "./stitch.service"
import {RenderService} from "./render.service"
import {ElementProperties} from "./models"

/**
 * This service coordinates actions between the various parts of the system and keeps track of the state of the system
 * as a whole, eg which elements are filled with which stitches.
 */
@Injectable({
    providedIn: 'root'
})
export class StitchCentralService {

    /**
     * rx/js subject scription to selection events.
     */
    private elementSelectionSubject = new Subject<ElementProperties>()

    /**
     * A map of element id to the stitching properties of that element. This acts as the central control structure for
     * the stitching
     */
    private elementProperties: {[key: string]: ElementProperties} = {}

    constructor(private stitchService: StitchService,
                private renderService: RenderService) {
    }

    /**
     * Fills the element with stitches
     */
    fill(element: ElementProperties): void {
        element.stitches = this.stitchService.fill(element.element, element.fillType)

        this.renderService.render(element)
    }

    /**
     * To be called when a new element is selected
     */
    elementSelected(element: Snap.Element) {
        const id = element.attr("id")
        let props = this.elementProperties[id]
        if (props === undefined) {
            props = new ElementProperties(element)
            this.elementProperties[id] = props
        }

        props.isSelected = true
        this.elementSelectionSubject.next(props)
    }

    /**
     * Called when an element is deselected
     */
    elementDeselected(element: Snap.Element) {
        const id = element.attr("id")
        let props = this.elementProperties[id]
        if (props === undefined) {
            props = new ElementProperties(element)
            this.elementProperties[id] = props
        }

        props.isSelected = false
        this.elementSelectionSubject.next(props)
    }

    /**
     * Subscribes to notifications of elements being selected and deselected. Returns a subscription.
     * Caller should unsubscribe
     * before it is destroyed to avoid memory leaks.
     */
    subscribe(selectionCallback: (element: ElementProperties) => void,
              deselectionCallback: (element: ElementProperties) => void): Subscription {
        return this.elementSelectionSubject.subscribe((element) => {
            if (element.isSelected) {
                selectionCallback(element)
            } else {
                deselectionCallback(element)
            }
        })
    }
}
