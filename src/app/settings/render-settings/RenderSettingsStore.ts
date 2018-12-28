import { Injectable } from "@angular/core"
import { PersistingStore } from "../../lib/Store"

/**
 * This service is responsible for loading saving settings. This is done in a service rather than in the setting component so that the settings can be loaded
 * even if the settings component isn't accessed
 */
@Injectable({
    providedIn: "root"
})
export class RenderSettingsStore extends PersistingStore<RenderSettings> {
    constructor() {
        super("renderSettings", new RenderSettings())
    }
}

export class RenderSettings {
    strokeWidth = 0.1
    colour = "#888"
    showMarkers = true
    markerSize = 1
}
