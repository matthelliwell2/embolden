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

    private paper: Snap.Paper

    private elementSelector = new ElementSelector()

    constructor(private stitchService: StitchService, private svgService: SvgService) {
    }

    async ngOnInit() {
        const container = SnapCjs("#svg-container") as Snap.Element

        this.svgService.container = container

        // this.paper = await this.svgService.loadFile(container,'assets/diamond.svg')

        container.click(this.onClick)
    }

    @HostListener('mousewheel', ['$event'])
    onZoom(event: MouseWheelEvent) {
        if (event.deltaY > 0) {
            this.svgService.zoomOut(this.paper)
        } else if (event.deltaY < 0) {
            this.svgService.zoomIn(this.paper)
        }
    }

    private readonly onClick = (event: MouseEvent) => {
        const element = SnapCjs(event.target) as Snap.Element

        this.elementSelector.select(element)

        const stitchPoints = this.stitchService.fill(element)

        this.toPath(element, stitchPoints)
    }

    private toPath(element: Snap.Element, points: Coord[]): void {
        const radius = this.svgService.mmToElementCoords(element, 0.2)
        points.forEach(point => {
            const circle = this.paper.circle(point.x, point.y, radius)
            circle.attr({stroke: "#00F", fill: "none", strokeWidth: "0.1"})
        })

        for (let i = 0; i < points.length; ++i) {
            const line = this.paper.line(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y)
            line.attr({stroke: "#00F", strokeWidth: "0.1"})
        }

       /* let result = `M${points[0].x},${points[0].y} `

        // TODO ignore first coord
        const pathElements = points.map(point => `L${point.x},${point.y}`)

        return result.concat(... pathElements)*/
    }
}
