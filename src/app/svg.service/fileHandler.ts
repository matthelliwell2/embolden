import * as Snap from "snapsvg"
import * as SnapCjs from 'snapsvg-cjs'
import * as uuid from "uuid/v4"
import {getPaper} from "./util"

/**
 * Loads the specified file and does some initial processing on it.
 */
export const loadFile = (container: Snap.Element, fileContents: string): Snap.Paper => {

    const paper = loadFileIntoContainer(container, fileContents) as Snap.Paper

    addIdToAllElements(container)
    adjustElementDisplay(container)

    const width = paper.attr('width')
    const height = paper.attr('height')

    if (!width.endsWith('mm') || !height.endsWith('mm')) {
        throw new Error(`Viewport units must be in mm. ${width}x${height} is not supported`)
    }

    const viewBox = paper.attr('viewBox')
    const scalingWidth = viewBox.width / Number(width.slice(0, width.length - 2))
    const scalingHeight = viewBox.height / Number(height.slice(0, height.length - 2))

    if (Math.abs(scalingHeight - scalingWidth) > 0.01) {
        throw new Error(`Cannot support different x and y scaling factors. Viewport=${width}x${height}. Viewbox=${viewBox}`)
    }

    return paper
}


const loadFileIntoContainer = (container: Snap.Element, fileContents: string) => {
    // Remove whatever we've got in there already
    let paper = getPaper(container)
    if (paper !== undefined && paper !== null) {
        paper.remove()
    }

    const fragment = SnapCjs.parse(fileContents) as Snap.Element
    container.append(fragment)

    paper = getPaper(container)
    return paper
}

/**
 * We need an id on everything so that we can associate the element with the extra data for stitching
 */
const addIdToAllElements = (fragment: Snap.Element) => {
    if (fragment.attr('id') === undefined) {
        fragment.attr({id: uuid()})
    }

    fragment.children().forEach(addIdToAllElements)
}

/**
 * Make fill transparent so it doesn't hide the stitches.
 * Makes sure we've got a stroke defined so that when we remove the fill we can still see the shape.
 */
const adjustElementDisplay = (element: Snap.Element) => {
    // TODO support more than paths
    if (element.type === 'path') {
        const fill = element.attr('fill')
        element.attr({
            "vector-effect": "non-scaling-stroke",
            "stroke-width": 1,
            "fill-opacity": 0,
            stroke: fill === undefined ? "#000" : fill
        })
    }

    element.children().forEach(adjustElementDisplay)
}

