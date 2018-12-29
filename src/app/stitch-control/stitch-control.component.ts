import { Component } from "@angular/core"
import { SatinFillType } from "../models"
import { CommandService, FillSelectedShapeCommand } from "../command.service"
import { DesignService } from "../design.service"

@Component({
    selector: "app-stitch-control",
    templateUrl: "./stitch-control.component.html",
    styleUrls: ["./stitch-control.component.css"]
})
export class StitchControlComponent {
    fillTypes = Object.keys(SatinFillType)

    constructor(private commandService: CommandService, public designService: DesignService) {}

    onFillTypeSelected(type: string) {
        this.commandService.sendCommand(new FillSelectedShapeCommand(SatinFillType[type]))
    }
}
