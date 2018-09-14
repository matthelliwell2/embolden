import {Component, HostListener, OnInit} from '@angular/core'
import * as SnapCjs from 'snapsvg-cjs'
import * as Snap from 'snapsvg'
import {ElementSelector} from "./ElementSelector"
import {StitchService} from "../stitch.service"
import {Coord, SvgService} from "../svg.service"

/**
 * This component is the central component that renders the svg and lets the user edit stitches.
 */
@Component({
    selector: 'app-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

    private elementSelector = new ElementSelector()

    constructor(private stitchService: StitchService, private svgService: SvgService) {
    }

    async ngOnInit() {
        const container = SnapCjs("#svg-container") as Snap.Element

        this.svgService.container = container

        container.click(this.onClick)
    }

    @HostListener('mousewheel', ['$event'])
    onZoom(event: MouseWheelEvent) {
        if (event.deltaY > 0) {
            this.svgService.zoomOut()
        } else if (event.deltaY < 0) {
            this.svgService.zoomIn()
        }
    }

    private readonly onClick = (event: MouseEvent) => {
        const element = SnapCjs(event.target) as Snap.Element

        this.elementSelector.select(element)

        const stitchPoints = this.stitchService.fill(element)

        this.toPath(element, stitchPoints)
    }

    // For the moment just draw out some stitches so we can see where they are.
    private toPath(element: Snap.Element, points: Coord[]): void {
        const radius = this.svgService.mmToViewBoxLength(0.2)
        points.forEach(point => {
            const circle = this.svgService.paper.circle(point.x, point.y, radius)
            circle.attr({stroke: "#00F", fill: "none", strokeWidth: "0.1"})
        })

        for (let i = 0; i < points.length; ++i) {
            const line = this.svgService.paper.line(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y)
            line.attr({stroke: "#F0F", strokeWidth: "1"})
        }

       /* let result = `M${points[0].x},${points[0].y} `

        // TODO ignore first coord
        const pathElements = points.map(point => `L${point.x},${point.y}`)

        return result.concat(... pathElements)*/
    }
}
