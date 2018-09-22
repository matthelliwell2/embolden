import {Component, OnInit} from '@angular/core'
import {StitchCentralService} from "../stitch-central.service"
import {Subscription} from "rxjs"
import {ElementProperties, SatinFillType} from "../models"

@Component({
    selector: 'app-stitch-control',
    templateUrl: './stitch-control.component.html',
    styleUrls: ['./stitch-control.component.css']
})
export class StitchControlComponent implements OnInit {

    fillTypes = Object.keys(SatinFillType)
    private subscription: Subscription
    selectedElement: ElementProperties | undefined

    constructor(private stitchCentralService: StitchCentralService) {
    }

    ngOnInit() {
        this.subscription = this.stitchCentralService.subscribe(this.onElementSelected, this.onElementDeselected)
        this.selectedElement = this.stitchCentralService.selectedElement
    }

    ngOnDestroy() {
        if (this.subscription !== undefined) {
            this.subscription.unsubscribe()
        }
    }

    onFillTypeSelected(type: string) {
        this.selectedElement!.fillType = SatinFillType[type]
        this.stitchCentralService.fill(this.selectedElement!)
    }

    readonly onElementSelected = (element: ElementProperties) => {
        this.selectedElement = element
    }

    readonly onElementDeselected = (element: ElementProperties) => {
        this.selectedElement = undefined
    }
}
