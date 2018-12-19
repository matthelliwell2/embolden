import { Injectable } from "@angular/core"
import { PubSubService } from "./pub-sub.service"

/**
 * This service is responsible for loading saving settings. This is done in a service rather than in the setting component so that the settings can be loaded
 * even if the settings component isn't accessed
 */
@Injectable({
    providedIn: "root"
})
export class SettingsService {
    renderSettings: RenderSettings

    constructor(private pubSubService: PubSubService) {
        this.pubSubService.subscribe(this)
        const values = localStorage.getItem("renderSettings")
        if (values) {
            this.renderSettings = { ...new RenderSettings(), ...JSON.parse(values) }
        } else {
            this.renderSettings = new RenderSettings()
        }
    }

    readonly onRenderSettingsChanged = (settings: RenderSettings) => {
        localStorage.setItem("renderSettings", JSON.stringify(settings))
    }
}

export class RenderSettings {
    strokeWidth = 0.1
    colour = "#888"
    showMarkers = true
    markerSize = 1
}
