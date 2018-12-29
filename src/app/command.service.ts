import { Injectable } from "@angular/core"
import { Observable, Subject } from "rxjs"
import { SatinFillType } from "./models"

/**
 * Exposes a subject for passing commands between components
 */
@Injectable({
    providedIn: "root"
})
export class CommandService {
    private subject = new Subject<Command>()

    constructor() {}

    getStream(): Observable<Command> {
        return this.subject.asObservable()
    }

    sendCommand(command: Command) {
        this.subject.next(command)
    }
}

export enum Commands {
    LOAD_FILE,
    FILL_SELECTED_SHAPE
}

export class LoadFileCommand {
    constructor(file: File) {
        this.file = file
    }

    readonly command = Commands.LOAD_FILE
    readonly file: File
}

export class FillSelectedShapeCommand {
    constructor(fillType: SatinFillType) {
        this.fillType = fillType
    }

    readonly command = Commands.FILL_SELECTED_SHAPE
    readonly fillType: SatinFillType
}

export type Command = LoadFileCommand | FillSelectedShapeCommand
