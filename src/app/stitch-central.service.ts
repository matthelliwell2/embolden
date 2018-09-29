import {Injectable} from '@angular/core'
import * as Snap from 'snapsvg'
import {Subject, Subscription} from 'rxjs'
import {StitchService} from "./stitch.service"
import {RenderService} from "./render.service"
import {ElementProperties} from "./models"
import {SettingsService} from "./settings.service"
import {SvgService} from "./svg.service"

/**
 * This service coordinates actions between the various parts of the system and keeps track of the state of the system
 * as a whole, eg which elements are filled with which stitches.
 */
@Injectable({
    providedIn: 'root'
})
export class StitchCentralService {

    private static readonly SUPPORTED_TAGS = new Set(["path"])
    /**
     * rxjs subject subscription to selection events.
     */
    private readonly elementSelectionSubject = new Subject<ElementProperties>()

    /**
     * The currently selected element
     */
    selectedElement: ElementProperties | undefined

    /**
     * Has a file been loaded yet
     */
    isFileLoaded = false

    /**
     * A map of element id to the stitching properties of that element. This acts as the central control structure for
     * the stitching
     */
    readonly elementProperties: Map<string, ElementProperties> = new Map()

    constructor(private stitchService: StitchService,
                private renderService: RenderService,
                private settingsService: SettingsService,
                private svgService: SvgService) {

        this.settingsService.renderSettings.subject.subscribe(this.onRenderSettingsChanged)
    }

    loadFile(fileContents: string): void {
        const paper = this.svgService.loadFile(fileContents)

        this.addElementsToProperties(paper)

        this.isFileLoaded = true
    }

    private readonly addElementsToProperties = (element: Snap.Element) => {
        if (StitchCentralService.SUPPORTED_TAGS.has(element.type.toLowerCase())) {
            const elementProperties = new ElementProperties(element)

            const id = element.attr("id")
            this.elementProperties.set(id, elementProperties)
        }

        if (element.children() !== undefined) {
            element.children().forEach(this.addElementsToProperties)
        }
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
        this.elementProperties.forEach((element) => {
            this.renderService.onRenderSettingsChanged(element)
        })
    }

    /**
     * To be called when a new element is selected
     */
    elementSelected(element: Snap.Element) {
        const id = element.attr("id")
        const props = this.elementProperties.get(id)
        if (props !== undefined) {
            this.selectedElement = props
            this.selectedElement.isSelected = true
            this.elementSelectionSubject.next(this.selectedElement)
        }
    }

    /**
     * Called when an element is deselected.
     *
     * @param element The previously selected element.
     */
    elementDeselected(element: Snap.Element) {
        const id = element.attr("id")
        const props = this.elementProperties.get(id)
        if  (props !== undefined) {
            props.isSelected = false
        }

        this.selectedElement = undefined
        this.elementSelectionSubject.next(props)
    }

    /**
     * Subscribes to notifications of elements being selected and deselected. Returns a subscription.
     * Caller should unsubscribe before it is destroyed to avoid memory leaks.
     */
    subscribeToSelectionEvents(selectionCallback: (element: ElementProperties) => void,
                               deselectionCallback: (element: ElementProperties) => void): Subscription {
        return this.elementSelectionSubject.subscribe((element) => {
            if (element !== undefined && element.isSelected) {
                selectionCallback(element)
            } else {
                deselectionCallback(element)
            }
        })
    }
}
