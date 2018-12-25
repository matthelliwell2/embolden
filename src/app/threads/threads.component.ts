import { Component, OnInit } from "@angular/core"
import { Palette, PaletteService } from "../palette/palette.service"

@Component({
    selector: "app-threads",
    templateUrl: "./threads.component.html",
    styleUrls: ["./threads.component.css"]
})
export class ThreadsComponent implements OnInit {
    currentPalette: Palette | undefined

    constructor(public paletteService: PaletteService) {}

    ngOnInit() {
        this.currentPalette = this.paletteService.getPalette(this.paletteService.paletteNames[0])
    }

    onPaletteSelected = (name: string) => {
        console.log("selected palette", name)
        this.currentPalette = this.paletteService.getPalette(name)
    }
}
