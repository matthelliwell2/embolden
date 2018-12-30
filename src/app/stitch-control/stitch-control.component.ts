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

    contrastingColour(colourValue: string): string {
        const rgb = this.hexToRGB(colourValue)
        const luminance = (0.299 * rgb.red + 0.587 * rgb.green + 0.114 * rgb.blue) / 255

        if (luminance > 0.5) {
            return "#000000"
        } else {
            return "#FFFFFF"
        }
    }

    private hexToRGB(hex: string): { red: number; green: number; blue: number } {
        const len = hex.length
        return {
            red: parseInt(hex.substr(len - 6, 2), 16),
            blue: parseInt(hex.substr(len - 4, 2), 16),
            green: parseInt(hex.substr(len - 2, 2), 16)
        }
    }
}
