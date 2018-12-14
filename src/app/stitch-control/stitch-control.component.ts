import { Component, OnDestroy, OnInit } from "@angular/core"
import { SatinFillType, Shape } from "../models"
import { PubSubService } from "../pub-sub.service"
import { ShapeService } from "../shape.service"
import { StitchService } from "../stitch.service"
import { RenderService } from "../render.service"

@Component({
    selector: "app-stitch-control",
    templateUrl: "./stitch-control.component.html",
    styleUrls: ["./stitch-control.component.css"]
})
export class StitchControlComponent implements OnInit, OnDestroy {
    fillTypes = Object.keys(SatinFillType)
    selectedShape: Shape | undefined = undefined
    scaling: number

    constructor(private pubSubService: PubSubService, private stitchService: StitchService, private shapeService: ShapeService, private renderService: RenderService) {}

    ngOnInit() {
        this.pubSubService.subscribe(this)
    }

    ngOnDestroy(): void {
        this.pubSubService.unsubscribe(this)
    }

    onFileLoaded() {
        this.selectedShape = undefined
    }

    onFillTypeSelected(type: string) {
        this.selectedShape!.fillType = SatinFillType[type]
        this.stitchService.fill(this.selectedShape!)
        this.renderService.render(this.selectedShape!)
    }

    onElementSelected(element: SVGPathElement) {
        this.selectedShape = this.shapeService.getShape(element)
    }

    onElementDeselected() {
        this.selectedShape = undefined
    }
}
