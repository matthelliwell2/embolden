import {Component, OnInit} from '@angular/core'
import {StitchCentralService} from "../stitch-central.service"
import {Subscription} from "rxjs"
import {ElementProperties, FillType} from "../models"

@Component({
    selector: 'app-stitch-control',
    templateUrl: './stitch-control.component.html',
    styleUrls: ['./stitch-control.component.css']
})
export class StitchControlComponent implements OnInit {

    fillTypes = Object.keys(FillType)
    private subscription: Subscription
    selectedElement: ElementProperties | undefined

    constructor(private stitchCentralService: StitchCentralService) {
    }

    ngOnInit() {
        this.subscription = this.stitchCentralService.subscribe(this.onElementSelected, this.onElementDeselected)
    }

    ngOnDestroy() {
        if (this.subscription !== undefined) {
            this.subscription.unsubscribe()
        }
    }

    onFillTypeSelected(type: string) {
        this.selectedElement!.fillType = FillType[type]
        this.stitchCentralService.fill(this.selectedElement!)
    }

    readonly onElementSelected = (element: ElementProperties) => {
        this.selectedElement = element
    }

    readonly onElementDeselected = (element: ElementProperties) => {
        this.selectedElement = undefined
    }
}
