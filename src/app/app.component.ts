import { Component } from "@angular/core"
import { ExportService } from "./export.service"

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"]
})
export class AppComponent {
    /**
     * Force export service to be created as it just listens to events at the moment so doesn't get referenced by any components.
     * @param exportService
     */
    // @ts-ignore
    constructor(private exportService: ExportService) {}
    title = "embolden"
}
