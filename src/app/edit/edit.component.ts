import * as svgPanZoom from "svg-pan-zoom"
import { Component, ElementRef, NgZone, OnDestroy, OnInit, Renderer2, ViewChild } from "@angular/core"
import { PubSubService } from "../pub-sub.service"
import { FileService } from "../file.service"

/**
 * This component is the central component that renders the svg and lets the user edit stitches.
 */
@Component({
    selector: "app-edit",
    templateUrl: "./edit.component.html",
    styleUrls: ["./edit.component.css"]
})
export class EditComponent implements OnInit, OnDestroy {
    private svg: SVGSVGElement
    private group: SVGGElement

    private selectionRect1: SVGGraphicsElement | undefined
    private selectionRect2: SVGGraphicsElement | undefined
    private selectedElement: SVGGraphicsElement | undefined
    @ViewChild("container") container: ElementRef

    constructor(private pubSubService: PubSubService, private fileService: FileService, private zone: NgZone, private renderer: Renderer2) {}

    ngOnInit() {
        this.pubSubService.subscribe(this)
    }

    ngOnDestroy(): void {
        this.pubSubService.unsubscribe(this)
    }

    async onLoadFile(file: File) {
        this.selectedElement = undefined
        this.selectionRect1 = undefined
        this.selectionRect2 = undefined

        const result = await this.fileService.loadFile(this.container, file)
        this.svg = result.svg

        // Set the height to 100% so canval fill the available height
        this.svg.setAttribute("height", "100%")

        const zoomControl = svgPanZoom(this.svg, { controlIconsEnabled: true })
        console.log(zoomControl.getSizes())

        this.group = this.svg.querySelector(".svg-pan-zoom_viewport") as SVGGElement

        this.renderer.listen(this.svg, "click", this.onClick)
    }

    private readonly onClick = (event: MouseEvent) => {
        this.zone.run(() => {
            this.select(event.target as SVGGraphicsElement)
        })
    }

    private select(element: SVGGraphicsElement) {
        if (element.classList.contains("stitchableElement") || element.nodeName === "svg") {
            this.unselect()
        }

        if (element.classList.contains("stitchableElement")) {
            this.selectedElement = element

            // Add a class to the element so we can highlight it
            element.classList.add("selected-element")

            this.selectionRect1 = this.renderer.createElement("rect", "svg")
            const bbox = element.getBBox()
            this.selectionRect1!.setAttribute("x", `${bbox.x}`)
            this.selectionRect1!.setAttribute("y", `${bbox.y}`)
            this.selectionRect1!.setAttribute("height", `${bbox.height}`)
            this.selectionRect1!.setAttribute("width", `${bbox.width}`)
            this.renderer.setAttribute(this.selectionRect1, "vector-effect", "non-scaling-stroke")
            this.renderer.addClass(this.selectionRect1, "selection-rect1")
            this.renderer.appendChild(this.group, this.selectionRect1)

            this.selectionRect2 = this.renderer.createElement("rect", "svg")
            this.selectionRect2!.setAttribute("x", `${bbox.x}`)
            this.selectionRect2!.setAttribute("y", `${bbox.y}`)
            this.selectionRect2!.setAttribute("height", `${bbox.height}`)
            this.selectionRect2!.setAttribute("width", `${bbox.width}`)
            this.renderer.setAttribute(this.selectionRect2, "vector-effect", "non-scaling-stroke")
            this.renderer.addClass(this.selectionRect2, "selection-rect2")
            this.renderer.appendChild(this.group, this.selectionRect2)

            this.pubSubService.publish("ElementSelected", element)
        }
    }

    private unselect() {
        if (this.selectedElement) {
            this.selectedElement.classList.remove("selected-element")
        }

        if (this.selectionRect1) {
            this.renderer.removeChild(this.group, this.selectionRect1)
            this.selectionRect1 = undefined
        }

        if (this.selectionRect2) {
            this.renderer.removeChild(this.group, this.selectionRect2)
            this.selectionRect2 = undefined
        }

        this.pubSubService.publish("ElementDeselected")
    }
}
