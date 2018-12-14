import { Injectable } from "@angular/core"

/**
 * This service exposes the parameters that the user can control to adjust how the display renders. It persists them when they changes.
 */
@Injectable({
    providedIn: "root"
})
export class SettingsService {
    constructor() {
        const values = localStorage.getItem("renderSettings")
        if (values) {
            this.renderSettings = JSON.parse(values) as RenderSettings
        }
    }

    readonly onRenderSettingsChanged = () => {
        localStorage.setItem("renderSettings", JSON.stringify(this.renderSettings))
    }

    readonly renderSettings = new RenderSettings()
}

class RenderSettings {
    strokeWidth: number = 0.1
    colour = "#888"
}
