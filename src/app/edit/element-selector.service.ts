import {Injectable} from '@angular/core'
import * as Snap from "snapsvg"
import {SvgService} from "../svg.service"
import {StitchCentralService} from "../stitch-central.service"

@Injectable({
    providedIn: 'root'
})
export class ElementSelectorService {

    private selectedElement: Snap.Element | undefined
    private bboxRect1: Snap.Element | undefined
    private bboxRect2: Snap.Element | undefined

    constructor(private svgService: SvgService,
                private stitchCentralService: StitchCentralService) {
    }

    select(element: Snap.Element) {
        if (this.selectedElement === element) {
            this.unselect()
        } else {
            this.unselect()

            this.selectedElement = element
            this.selectedElement.addClass("selected-element")

            const bbox = element.getBBox()

            const rect = this.svgService.bboxToViewBoxRect(element, bbox)

            this.bboxRect1 = element.paper!.rect(rect.x, rect.y, rect.width, rect.height)
            this.bboxRect1.attr({"vector-effect": "non-scaling-stroke"})
            this.bboxRect1.addClass("selection-rect1")

            this.bboxRect2 = element.paper!.rect(rect.x, rect.y, rect.width, rect.height)
            this.bboxRect2.attr({"vector-effect": "non-scaling-stroke"})
            this.bboxRect2.addClass("selection-rect2")

            this.stitchCentralService.elementSelected(element)
        }
    }

    unselect() {
        if (this.bboxRect1 !== undefined && this.bboxRect2 !== undefined && this.selectedElement !== undefined) {
            this.stitchCentralService.elementDeselected(this.selectedElement)
            this.bboxRect1.remove()
            this.bboxRect2.remove()
            this.selectedElement.removeClass("selected-element")
            this.selectedElement = undefined
        }
    }
}
