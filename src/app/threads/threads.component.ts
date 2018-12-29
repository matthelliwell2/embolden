import { Component } from "@angular/core"
import { PaletteService } from "../palette/palette.service"
import { DesignService } from "../design.service"
import { EventService, PaletteSelectedEvent } from "../event.service"

@Component({
    selector: "app-threads",
    templateUrl: "./threads.component.html",
    styleUrls: ["./threads.component.css"]
})
export class ThreadsComponent {
    constructor(public paletteService: PaletteService, public designService: DesignService, private eventService: EventService) {}

    onPaletteSelected = (name: string) => {
        this.eventService.sendEvent(new PaletteSelectedEvent(this.paletteService.getPalette(name)!))
    }
}
