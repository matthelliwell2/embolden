import {Injectable} from '@angular/core'
import * as Rx from 'rxjs'

@Injectable({
    providedIn: 'root'
})
export class SettingsService {

    constructor() {
    }

    public renderSettings: RenderSettings = new RenderSettings()
}

export class RenderSettings {
    constructor() {
        const values = localStorage.getItem("renderSettings")
        if (values !== null && values !== undefined) {
            this.renderValues = JSON.parse(values) as RenderValues
        }

        this.subject.subscribe(this.onRenderSettingsChanged)

    }

    renderValues = new RenderValues()

    readonly subject = new Rx.Subject<void>()

    private readonly onRenderSettingsChanged = () => {
        localStorage.setItem("renderSettings", JSON.stringify(this.renderValues))
    }
}

class RenderValues {
    strokeWidth: number = 0.1
    colour = '#888'
}
