import { AfterViewInit, Component, EventEmitter } from "@angular/core"
import { Options } from "ng5-slider"
import { ColorEvent } from "ngx-color"
import { RenderSettings, RenderSettingsStore } from "./RenderSettingsStore"

/**
 * Component that allows user to config how the stitches and shapes are rendered on the screen. None of this affects the generation of the actual stitches.
 */
@Component({
    selector: "app-render-settings",
    templateUrl: "./render-settings.component.html",
    styleUrls: ["./render-settings.component.css"]
})
export class RenderSettingsComponent implements AfterViewInit {
    manualRefresh: EventEmitter<void> = new EventEmitter<void>()
    private readonly renderSettings: RenderSettings

    constructor(private store: RenderSettingsStore) {
        this.renderSettings = store.state
    }

    strokeWidthSliderOptions: Options = {
        floor: 0,
        ceil: 1,
        step: 0.01,
        precisionLimit: 2
    }

    markerSizeSliderOptions: Options = {
        floor: 0,
        ceil: 5,
        step: 0.2,
        precisionLimit: 3
    }

    // The slider doesn't draw properly for some reason. Forcing a refresh fixes it.
    ngAfterViewInit() {
        this.manualRefresh.emit()
    }
    a

    onStrokeWidthChangeComplete(): void {
        this.store.state = this.renderSettings
    }

    onMarkerSizeChangeComplete(): void {
        this.store.state = this.renderSettings
    }

    onColourChangeComplete(event: ColorEvent): void {
        this.renderSettings.colour = event.color.hex
        this.store.state = this.renderSettings
    }

    set showMarkers(show: boolean) {
        if (this.renderSettings) {
            this.renderSettings.showMarkers = show
            this.store.state = this.renderSettings
        }
    }

    get showMarkers(): boolean {
        return this.renderSettings.showMarkers
    }
}
