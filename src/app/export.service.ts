import { Injectable } from "@angular/core"
import { Destroyable } from "./lib/Store"
import { takeUntil } from "rxjs/operators"
import { Commands, CommandService } from "./command.service"
import { DesignService } from "./design.service"

@Injectable({
    providedIn: "root"
})
export class ExportService extends Destroyable {
    constructor(private commandService: CommandService, private designService: DesignService) {
        super()
        console.log("ExportService started")

        this.commandService
            .getStream()
            .pipe(takeUntil(this.destroyed))
            .subscribe(async command => {
                switch (command.command) {
                    case Commands.EXPORT_FILE_COMMAND:
                        await this.exportFile(command.exportType)
                        break
                }
            })
    }

    private exportFile(type: ExportTypes): void {
        switch (type) {
            case ExportTypes.JEF:
                this.exportJefFile()
                break
            case ExportTypes.DESIGN:
                this.exportDesignFile()
                break
        }
    }

    private exportJefFile() {
        console.log("Export jef file", this.designService.name)
    }

    private exportDesignFile() {
        console.log("Export design file", this.designService.name)
    }
}

export enum ExportTypes {
    DESIGN = "Design",
    JEF = ".jef"
}
