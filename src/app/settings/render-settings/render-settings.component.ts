import { Component, EventEmitter, OnInit } from "@angular/core"
import { SettingsService } from "../../settings.service"
import { Options } from "ng5-slider"
import { ColorEvent } from "ngx-color"

/**
 * Component that allows user to config how the stitches and shapes are rendered on the screen. None of this affects the generation of the actual stitches.
 */
@Component({
    selector: "app-render-settings",
    templateUrl: "./render-settings.component.html",
    styleUrls: ["./render-settings.component.css"]
})
export class RenderSettingsComponent implements OnInit {
    manualRefresh: EventEmitter<void> = new EventEmitter<void>()

    constructor(public settingsService: SettingsService) {}

    options: Options = {
        floor: 0,
        ceil: 1,
        step: 0.01,
        precisionLimit: 2
    }

    ngOnInit() {}

    // The slider doesn't draw properly for some reason. Forcing a refresh fixes it.
    ngAfterViewInit() {
        this.manualRefresh.emit()
    }

    onStrokeWidthChangeComplete(): void {
        this.settingsService.onRenderSettingsChanged()
    }

    onColourChangeComplete(event: ColorEvent): void {
        this.settingsService.renderSettings.colour = event.color.hex
        this.settingsService.onRenderSettingsChanged()
    }
}
