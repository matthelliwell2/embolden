import { Component, HostListener, ViewChild } from "@angular/core"
import { NgbModal } from "@ng-bootstrap/ng-bootstrap"
import { SettingsComponent } from "../settings/settings.component"
import { CommandService, ExportFileCommand, LoadFileCommand } from "../command.service"
import { ExportTypes } from "../export.service"
import { Destroyable } from "../lib/Store"
import { Events, EventService } from "../event.service"
import { takeUntil } from "rxjs/operators"

@Component({
    selector: "app-toolbar",
    templateUrl: "./toolbar.component.html",
    styleUrls: ["./toolbar.component.css"]
})
export class ToolbarComponent extends Destroyable {
    fileLoaded = false

    topPos = 10
    leftPos = 25

    private initialTopPos: number
    private initialLeftPos: number
    private initialClientX: number
    private initialClientY: number

    // This is a reference to the hidden input type='file' component
    @ViewChild("file") file

    constructor(private commandService: CommandService, private eventService: EventService, private modalService: NgbModal) {
        super()

        this.eventService
            .getStream()
            .pipe(takeUntil(this.destroyed))
            .subscribe(event => {
                switch (event.event) {
                    case Events.FILE_LOADED:
                        this.fileLoaded = true
                        break
                }
            })
    }

    get keys() {
        return Object.keys(ExportTypes)
    }
    value(key) {
        return ExportTypes[key]
    }

    /**
     * When we click on our open icon, pass that onto the file input component so the user gets a list of files to select.
     */
    onOpen(): void {
        this.file.nativeElement.click()
    }

    /**
     * Called by the file selection dialog when we've got a file to load
     */
    onFilesAdded(): void {
        this.commandService.sendCommand(new LoadFileCommand(this.file.nativeElement.files[0]))
    }

    /**
     * Called when we want to display the setting modal dialog
     */
    onSettings() {
        const modalRef = this.modalService.open(SettingsComponent)
        modalRef.componentInstance.name = "World"
    }

    onExport(key: string): void {
        this.commandService.sendCommand(new ExportFileCommand(ExportTypes[key]))
    }

    /**
     * Called as part of dragging the toolbar around
     */
    @HostListener("dragstart", ["$event"])
    onDragStart(event) {
        this.initialLeftPos = this.leftPos
        this.initialTopPos = this.topPos
        this.initialClientX = event.clientX
        this.initialClientY = event.clientY
    }

    /**
     * Called as part of dragging the toolbar around
     */
    @HostListener("dragend", ["$event"])
    onDragEnd(event) {
        this.leftPos = this.initialLeftPos + event.clientX - this.initialClientX
        this.topPos = this.initialTopPos + event.clientY - this.initialClientY
    }
}
