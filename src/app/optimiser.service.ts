import { Injectable } from "@angular/core"
import { Intersections } from "./models"

/**
 * This class optimises the route for the stitching to minimise breaks and distance travelled, or it might do eventually
 */
@Injectable({
    providedIn: "root"
})
export class OptimiserService {
    constructor() {}

    /**
     * As a first pass we will just swap around the start and end points on alternate row so that the stitch service doesn't have to work out if it is going from the
     * start to the end or the end to start.
     * @param columnsOfScanlines
     */
    optimise(columnsOfScanlines: Intersections[][]) {
        let forward = true
        columnsOfScanlines.forEach(scanLines => {
            scanLines.forEach(scanLine => {
                if (!forward) {
                    const temp = scanLine.start
                    scanLine.start = scanLine.end
                    scanLine.end = temp
                }

                forward = !forward
            })
        })
    }
}
