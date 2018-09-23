import {Injectable} from '@angular/core'
import * as Snap from 'snapsvg'
import {Subject, Subscription} from 'rxjs'
import {StitchService} from "./stitch.service"
import {RenderService} from "./render.service"
import {ElementProperties} from "./models"
import {SettingsService} from "./settings.service"

/**
 * This service coordinates actions between the various parts of the system and keeps track of the state of the system
 * as a whole, eg which elements are filled with which stitches.
 */
@Injectable({
    providedIn: 'root'
})
export class StitchCentralService {

    /**
     * rxjs subject subscription to selection events.
     */
    private elementSelectionSubject = new Subject<ElementProperties>()

    selectedElement: ElementProperties | undefined

    /**
     * A map of element id to the stitching properties of that element. This acts as the central control structure for
     * the stitching
     */
    private elementProperties: Map<string, ElementProperties> = new Map()

    constructor(private stitchService: StitchService,
                private renderService: RenderService,
                private settingsService: SettingsService) {

        settingsService.renderSettings.subject.subscribe(this.onRenderSettingsChanged)
    }

    /**
     * Fills the element with stitches
     */
    fill(element: ElementProperties): void {
        element.stitches = this.stitchService.fill(element.element, element.fillType)

        this.renderService.render(element)
    }

    /**
     * Render setting have updated to we need to re-render the stitches
     */
    readonly onRenderSettingsChanged = () => {
        console.log('new settings', this.settingsService.renderSettings.strokeWidth)

        this.elementProperties.forEach((element) => {
            this.renderService.onRenderSettingsChanged(element)
        })
    }

    /**
     * To be called when a new element is selected
     */
    elementSelected(element: Snap.Element) {
        const id = element.attr("id")
        if (this.elementProperties.has(id)) {
            this.selectedElement = this.elementProperties.get(id)!
        } else {
            this.selectedElement = new ElementProperties(element)
            this.elementProperties.set(id, this.selectedElement)
        }

        this.selectedElement.isSelected = true
        this.elementSelectionSubject.next(this.selectedElement)
    }

    /**
     * Called when an element is deselected
     */
    elementDeselected(element: Snap.Element) {
        const id = element.attr("id")
        let props: ElementProperties
        if (this.elementProperties.has(id)) {
            props = this.elementProperties.get(id)!
        } else {
            props = new ElementProperties(element)
            this.elementProperties.set(id, props)
        }

        props.isSelected = false
        this.selectedElement = undefined
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
