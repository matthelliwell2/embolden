import { Component, EventEmitter, OnInit } from "@angular/core"
import { Options } from "ng5-slider"
import { ColorEvent } from "ngx-color"
import { PubSubService } from "../../pub-sub.service"
import { RenderSettings, SettingsService } from "../../settings.service"

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
    private readonly renderSettings: RenderSettings

    constructor(private pubSubService: PubSubService, settingsService: SettingsService) {
        this.pubSubService.subscribe(this)
        this.renderSettings = settingsService.renderSettings
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

    ngOnInit() {}

    // The slider doesn't draw properly for some reason. Forcing a refresh fixes it.
    ngAfterViewInit() {
        this.manualRefresh.emit()
    }

    ngOnDestroy(): void {
        this.pubSubService.unsubscribe(this)
    }

    onStrokeWidthChangeComplete(): void {
        this.pubSubService.publish("RenderSettingsChanged", this.renderSettings)
    }

    onMarkerSizeChangeComplete(): void {
        this.pubSubService.publish("RenderSettingsChanged", this.renderSettings)
    }

    onColourChangeComplete(event: ColorEvent): void {
        this.renderSettings.colour = event.color.hex
        this.pubSubService.publish("RenderSettingsChanged", this.renderSettings)
    }

    set showMarkers(show: boolean) {
        if (this.renderSettings) {
            this.renderSettings.showMarkers = show
            this.pubSubService.publish("RenderSettingsChanged", this.renderSettings)
        }
    }
    get showMarkers(): boolean {
        return this.renderSettings.showMarkers
    }
}
