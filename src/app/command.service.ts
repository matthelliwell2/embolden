import { Injectable } from "@angular/core"
import { Observable, Subject } from "rxjs"

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
    LOAD_FILE
}

export class LoadFileCommand {
    constructor(file: File) {
        this.file = file
    }

    readonly command = Commands.LOAD_FILE
    readonly file: File
}

export type Command = LoadFileCommand
