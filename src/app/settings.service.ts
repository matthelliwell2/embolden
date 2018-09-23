import {Injectable} from '@angular/core'
import * as Rx from 'rxjs'

@Injectable({
    providedIn: 'root'
})
export class SettingsService {

    // TODO save and restore settings between sessions
    constructor() {
    }

    public renderSettings: RenderSettings = new RenderSettings()
}

export class RenderSettings {
    subject = new Rx.Subject<void>()
    strokeWidth: number = 1
}
