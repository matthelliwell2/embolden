import { Component, HostListener, OnInit, ViewChild } from "@angular/core"
import { NgbModal } from "@ng-bootstrap/ng-bootstrap"
import { SettingsComponent } from "../settings/settings.component"
import { PubSubService } from "../pub-sub.service"

@Component({
    selector: "app-toolbar",
    templateUrl: "./toolbar.component.html",
    styleUrls: ["./toolbar.component.css"]
})
export class ToolbarComponent implements OnInit {
    topPos = 10
    leftPos = 25

    private initialTopPos: number
    private initialLeftPos: number
    private initialClientX: number
    private initialClientY: number

    // This is a reference to the hidden input type='file' component
    @ViewChild("file") file

    constructor(private pubSubService: PubSubService, private modalService: NgbModal) {}

    ngOnInit() {}

    /**
     * When we click on our open icon, pass that onto the file input component so the user gets a list of files to select.
     */
    onOpen() {
        this.file.nativeElement.click()
    }

    /**
     * Called by the file selection dialog when we've got a file to load
     */
    onFilesAdded() {
        this.pubSubService.publish("LoadFile", this.file.nativeElement.files[0])
    }

    onSettings() {
        const modalRef = this.modalService.open(SettingsComponent)
        modalRef.componentInstance.name = "World"
    }

    @HostListener("dragstart", ["$event"])
    onDragStart(event) {
        this.initialLeftPos = this.leftPos
        this.initialTopPos = this.topPos
        this.initialClientX = event.clientX
        this.initialClientY = event.clientY
    }

    @HostListener("dragend", ["$event"])
    onDragEnd(event) {
        this.leftPos = this.initialLeftPos + event.clientX - this.initialClientX
        this.topPos = this.initialTopPos + event.clientY - this.initialClientY
    }
}
