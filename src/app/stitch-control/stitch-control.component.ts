import { Component } from "@angular/core"
import { SatinFillType } from "../models"
import { ShapeService } from "../edit/shape.service"
import { Renderer } from "../edit/Renderer"
import { StitchGenerator } from "../edit/StitchGenerator"

@Component({
    selector: "app-stitch-control",
    templateUrl: "./stitch-control.component.html",
    styleUrls: ["./stitch-control.component.css"]
})
export class StitchControlComponent {
    fillTypes = Object.keys(SatinFillType)

    constructor(private stitchGenerator: StitchGenerator, private renderer: Renderer, private shapeService: ShapeService) {}

    onFillTypeSelected(type: string) {
        this.shapeService.selectedShape!.fillType = SatinFillType[type]
        this.stitchGenerator.fill(this.shapeService.selectedShape!)
        this.renderer.render(this.shapeService.selectedShape!)
    }
}
