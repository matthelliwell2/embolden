import { Component } from "@angular/core"
import { SatinFillType } from "../models"
import { CommandService, FillSelectedShapeCommand } from "../command.service"
import { DesignService } from "../design.service"
import { Colour } from "../palette/palette.service"
import { EventService, FillColourSelectedEvent } from "../event.service"

@Component({
    selector: "app-stitch-control",
    templateUrl: "./stitch-control.component.html",
    styleUrls: ["./stitch-control.component.css"]
})
export class StitchControlComponent {
    fillTypes = Object.keys(SatinFillType)

    constructor(private commandService: CommandService, private eventService: EventService, public designService: DesignService) {}

    onFillColourSelected(colourNumber: string) {
        this.eventService.sendEvent(new FillColourSelectedEvent(colourNumber))
    }

    onFillTypeSelected(type: string) {
        this.commandService.sendCommand(new FillSelectedShapeCommand(SatinFillType[type]))
    }

    get colour(): Colour | undefined {
        if (this.designService.selectedPalette && this.designService.selectedShape && this.designService.selectedShape.fillColourNumber) {
            return this.designService.selectedPalette!.colours[this.designService.selectedShape!.fillColourNumber!]
        } else {
            return undefined
        }
    }
}
