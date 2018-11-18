import { ElementRef, Injectable } from "@angular/core"
import * as uuid from "uuid/v4"
import { PubSubService } from "./pub-sub.service"
import * as xmldoc from "xmldoc"
import * as svgpath from "svgpath"

const transform = require("svg-flatten/src/transform.js")
const pathify = require("svg-flatten/src/pathify.js")

/**
 *  * This contains methods related to manipulating external files
 */
@Injectable({
    providedIn: "root"
})
export class FileService {
    constructor(private pubSubService: PubSubService) {}

    /**
     * Loads the specified file and does some initial processing on it.
     */
    async loadFile(container: ElementRef, file: File): Promise<{ svg: SVGSVGElement; scaling: number }> {
        const svg = await this.loadFileIntoContainer(container, file)
        this.addIdToAllElements(svg)
        this.adjustElementDisplay(svg)

        if (svg.width.baseVal.unitType !== SVGLength.SVG_LENGTHTYPE_MM || svg.height.baseVal.unitType !== SVGLength.SVG_LENGTHTYPE_MM) {
            throw new Error("Viewport unit must be in mm")
        }

        const viewBox = svg.viewBox.baseVal
        const scalingWidth = viewBox.width / svg.width.baseVal.valueInSpecifiedUnits
        const scalingHeight = viewBox.height / svg.height.baseVal.valueInSpecifiedUnits
        if (Math.abs(scalingHeight - scalingWidth) > 0.01) {
            throw new Error("Cannot support different x and y scaling factors.")
        }

        // The scaling factor converts from element coords to viewbox (mm) coords. As we have flatten the file this is the only scale factor we need.
        this.pubSubService.publish("FileLoaded", { svg: svg, scaling: scalingWidth })
        return { svg: svg, scaling: scalingWidth }
    }

    private async loadFileIntoContainer(container: ElementRef, file: File): Promise<SVGSVGElement> {
        return new Promise<SVGSVGElement>(resolve => {
            const r = new FileReader()
            r.onload = file => {
                const contents = (<FileReader>file.target)!.result as string

                // Get rid of any groups and all transforms so any coords should be in viewport coords. This avoids having to apply different transforms
                // when calculating the stitches.
                let xmlContents = new xmldoc.XmlDocument(contents) as xmldoc.XmlElement
                xmlContents = pathify(xmlContents)
                xmlContents = flatten(xmlContents) as xmldoc.XmlElement
                xmlContents = transform(xmlContents)

                container.nativeElement.innerHTML = xmlContents.toString()

                const svg = Array.from<Node>(container.nativeElement.childNodes).filter(node => node.nodeName === "svg")
                this.adjustForIntersectionLibrary(svg[0])

                if (svg.length !== 1) {
                    console.log("Unable to find root svg element")
                }
                resolve(svg[0] as SVGSVGElement)
            }

            r.readAsText(file)
        })
    }

    /**
     * Converts paths to use absolute commands.
     * 1. svg-intersections doesn't support the 'h' command for some reason so convert to absoluate coords
     * 2. svg-intersections sometimes misses out intersections for paths contains H and V commands so convert these to L
     */
    private adjustForIntersectionLibrary(node: Node) {
        if (node instanceof SVGElement && node.nodeName === "path") {
            let path = svgpath(node.getAttribute("d") as string).abs()

            path = path.iterate(
                (segment, index, startX, startY): void => {
                    if (segment[0] === "H") {
                        const newX = segment[1]
                        const newY = startY
                        segment[0] = "L"
                        segment[1] = newX
                        segment.push(newY)
                    } else if (segment[0] === "V") {
                        const newX = startX
                        const newY = segment[1]
                        segment[0] = "L"
                        segment[1] = newX
                        segment.push(newY)
                    }
                }
            )

            node.setAttribute("d", path.toString().toString())
        }

        node.childNodes.forEach(node => this.adjustForIntersectionLibrary(node))
    }

    /**
     * We need an id on everything so that we can associate the element with the extra data for stitching
     */
    private addIdToAllElements = (node: Node) => {
        if (this.isSVGGeometeryElement(node) && node.id === "") {
            node.id = uuid()
        }

        node.childNodes.forEach(node => {
            this.addIdToAllElements(node)
        })
    }

    /**
     * Remove the style attribute and add a class so we can control the display with CSS
     */
    private adjustElementDisplay = (node: Node) => {
        if (this.isSVGGeometeryElement(node)) {
            // Remove all styles apart from the fill colour. We'll use this fill colour later to choose the default thread colour
            const fillColor = node.style.fill
            node.style.cssText = `fill: ${fillColor}`
            node.classList.add("stitchableElement")
        }

        node.childNodes.forEach(node => {
            this.adjustElementDisplay(node)
        })
    }

    private isSVGGeometeryElement(node: Node): node is SVGGeometryElement {
        return node instanceof SVGGeometryElement
    }
}

/**
 * These methods are taken from flatten.js in module svg-flatten. They have been modified so that they don't merge paths together so that a user can selected individual
 * paths to stitch.
 */

const flatten = (dom: xmldoc.XmlElement) => {
    if (dom.name === "svg") {
        return flattenSvg(dom)
    } else if (dom.name === "g") {
        return flattenGroup(dom)
    } else {
        return dom
    }
}

const flattenSvg = (dom: xmldoc.XmlElement) => {
    const newChildren: any[] = []

    dom.children.forEach(child => {
        const flatChildren = flatten(child as xmldoc.XmlElement)
        if (Array.isArray(flatChildren)) {
            newChildren.push(...flatChildren)
        } else {
            newChildren.push(flatChildren)
        }
    })

    dom.children = newChildren

    if (newChildren.length > 0) {
        dom.firstChild = newChildren[0]
        dom.lastChild = newChildren[newChildren.length - 1]
    }

    return dom
}

const flattenGroup = (group: xmldoc.XmlElement): xmldoc.XmlElement[] => {
    const groupTransform = group.attr.transform
    return group.children.map(child => {
        const flatChild = transform(flatten(child as xmldoc.XmlElement))

        if (groupTransform) {
            flatChild.attr.transform = groupTransform
        }

        return flatChild
    })
}
