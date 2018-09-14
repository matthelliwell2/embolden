import {Component, OnInit, ViewChild} from '@angular/core'
import {SvgService} from "../svg.service"

@Component({
    selector: 'app-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

    // This is a reference to the hidden input type='file' component
    @ViewChild('file') file

    constructor(private svgService: SvgService) {
    }

    ngOnInit() {
    }

    /**
     * When we click on our open icon, pass that onto the file input component so the user gets a list of files to select.
     */
    onOpen() {
        this.file.nativeElement.click()
    }

    onFilesAdded() {
        const r = new FileReader()
        r.onload = (file) => {
            this.svgService.loadFile(file.target!.result)
        }

        r.readAsText(this.file.nativeElement.files[0])
    }
}
