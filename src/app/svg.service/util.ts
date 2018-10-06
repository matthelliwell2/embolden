import * as Snap from "snapsvg"

export const getPaper = (container: Snap.Element): Snap.Paper | undefined => {
    if (container !== undefined) {
        return container.select("svg") as Snap.Paper
    } else {
        return undefined
    }
}
