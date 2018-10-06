import {Component, ElementRef, OnInit, ViewChild} from '@angular/core'

@Component({
    selector: 'app-properties-bar',
    templateUrl: './properties-bar.component.html',
    styleUrls: ['./properties-bar.component.css']
})
export class PropertiesBarComponent implements OnInit {

    @ViewChild('tabTitle') tabTitle: ElementRef
    public tabTitleHeight: number

    constructor() {
    }

    ngOnInit(): void {
    }

    ngAfterViewInit() {
        // We need to get the height of the tab titles so we can expand the tab contents to fill the rest of the screen.
        // There is no way to do this directly so we need to search for the list which forms the sets and query that
        // for its height. We do this in the setTimeout to avoid ExpressionChangedAfterItHasBeenCheckedError
        setTimeout(() => {
            this.tabTitleHeight = this.tabTitle.nativeElement.querySelector('ul').getBoundingClientRect().height
        })
    }
}
