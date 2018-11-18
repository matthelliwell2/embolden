import { Component, OnDestroy, OnInit, Renderer2 } from "@angular/core"
import { SatinFillType, Shape } from "../models"
import { PubSubService } from "../pub-sub.service"
import { ShapeService } from "../shape.service"
import { StitchService } from "../stitch.service"

@Component({
    selector: "app-stitch-control",
    templateUrl: "./stitch-control.component.html",
    styleUrls: ["./stitch-control.component.css"]
})
export class StitchControlComponent implements OnInit, OnDestroy {
    fillTypes = Object.keys(SatinFillType)
    selectedShape: Shape | undefined = undefined
    scaling: number

    constructor(private pubSubService: PubSubService, private stitchService: StitchService, private shapeService: ShapeService, private renderer: Renderer2) {}

    ngOnInit() {
        this.pubSubService.subscribe(this)
    }

    ngOnDestroy(): void {
        this.pubSubService.unsubscribe(this)
    }

    onFileLoaded(file: { svg: SVGSVGElement; scaling: number }) {
        this.scaling = file.scaling
    }

    onFillTypeSelected(type: string) {
        this.selectedShape!.fillType = SatinFillType[type]
        this.stitchService.fill(this.selectedShape!, this.scaling, this.renderer)
    }

    onElementSelected(element: SVGPathElement) {
        this.selectedShape = this.shapeService.getShape(element, this.renderer)
    }

    onElementDeselected() {
        this.selectedShape = undefined
    }
}
