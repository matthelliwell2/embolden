import {Component, HostListener, OnInit} from '@angular/core'
import * as SnapCjs from 'snapsvg-cjs'
import * as Snap from 'snapsvg'
import {SvgService} from "../svg.service"
import {ElementSelectorService} from "./element-selector.service"

/**
 * This component is the central component that renders the svg and lets the user edit stitches.
 */
@Component({
    selector: 'app-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

    constructor(private svgService: SvgService,
                private elementSelectorService: ElementSelectorService) {

    }

    async ngOnInit() {
        const container = SnapCjs("#svg-container") as Snap.Element

        this.svgService.container = container

        // Add a click callback so we can use clicks to select elements
        container.click(this.onClick)
    }

    @HostListener('mousewheel', ['$event'])
    onZoom(event: MouseWheelEvent) {
        if (event.deltaY > 0) {
            this.svgService.zoomOut()
        } else if (event.deltaY < 0) {
            this.svgService.zoomIn()
        }
    }

    private readonly onClick = (event: MouseEvent) => {
        const element = SnapCjs(event.target) as Snap.Element

        this.elementSelectorService.select(element)
    }
}
