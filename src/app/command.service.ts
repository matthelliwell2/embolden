import { Injectable } from "@angular/core"
import { Observable, Subject } from "rxjs"
import { SatinFillType } from "./models"
import { ExportTypes } from "./export.service"

/**
 * Exposes a subject for passing commands between components
 */
@Injectable({
    providedIn: "root"
})
export class CommandService {
    private subject = new Subject<Command>()

    constructor() {
        console.log("CommandService started")
    }

    getStream(): Observable<Command> {
        return this.subject.asObservable()
    }

    sendCommand(command: Command) {
        this.subject.next(command)
    }
}

export enum Commands {
    LOAD_FILE,
    FILL_SELECTED_SHAPE,
    EXPORT_FILE_COMMAND
}

export class LoadFileCommand {
    constructor(public readonly file: File) {}

    readonly command = Commands.LOAD_FILE
}

export class FillSelectedShapeCommand {
    constructor(public readonly fillType: SatinFillType) {}

    readonly command = Commands.FILL_SELECTED_SHAPE
}

export class ExportFileCommand {
    constructor(public readonly exportType: ExportTypes) {}

    readonly command = Commands.EXPORT_FILE_COMMAND
}

export type Command = LoadFileCommand | FillSelectedShapeCommand | ExportFileCommand
