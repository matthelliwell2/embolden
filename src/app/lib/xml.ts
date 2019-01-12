import * as xmldoc from "xmldoc"

const transform = require("svg-flatten/src/transform.js")

/**
 * These methods are taken from flatten.js in module svg-flatten. They have been modified so that they don't merge paths together so that a user can selected individual
 * paths to stitch.
 */

export const flatten = (dom: xmldoc.XmlElement) => {
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

        if (groupTransform && flatChild.hasOwnProperty("attr")) {
            flatChild.attr.transform = groupTransform
        }

        return flatChild
    })
}
