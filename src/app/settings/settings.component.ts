import {Component, OnInit} from '@angular/core'
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap"

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

    constructor(public activeModal: NgbActiveModal) {
    }

    ngOnInit() {
    }
}
