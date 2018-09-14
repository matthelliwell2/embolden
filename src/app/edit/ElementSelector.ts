import * as Snap from 'snapsvg'

/**
 * Updates and resets the appearance of an element when it is selected. We can't use css as the style definition on
 * the local element will override the css styling.
 */
export class ElementSelector {
    private style: string
    private selectedElement: Snap.Element | undefined

    constructor() {}

    select(element: Snap.Element) {
        if (element === this.selectedElement) {
            this.restore()
        } else {
            this.restore()
            this.selectedElement = element
            this.style = this.selectedElement.attr('style')

            this.selectedElement.attr({style: 'fill: lightgray'})
            this.selectedElement.attr({stroke: 'Red', 'stroke-width': '0.5'})
        }
    }

    restore() {
        if (this.selectedElement !== undefined) {
            this.selectedElement.attr({style: this.style})
            this.selectedElement = undefined
        }
    }
}
