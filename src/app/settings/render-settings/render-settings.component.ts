import {Component, EventEmitter, OnInit} from '@angular/core'
import {SettingsService} from "../../settings.service"
import {Options} from 'ng5-slider'

@Component({
    selector: 'app-render-settings',
    templateUrl: './render-settings.component.html',
    styleUrls: ['./render-settings.component.css']
})
export class RenderSettingsComponent implements OnInit {

    manualRefresh: EventEmitter<void> = new EventEmitter<void>()
    constructor(public settingsService: SettingsService) {
    }

    options: Options = {
        floor: 0,
        ceil: 10,
        step: 0.1
    }

    ngOnInit() {
    }

    // The slider doesn't draw properly for some reason. Forcing a refresh fixes it.
    ngAfterViewInit() {
        this.manualRefresh.emit()
    }

    onUserChangeEnd(): void {
        this.settingsService.renderSettings.subject.next()
    }
}
