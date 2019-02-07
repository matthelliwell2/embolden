import { Injectable } from "@angular/core"
import { Actions, Effect, ofType } from "@ngrx/effects"
import { Observable } from "rxjs"
import { FillShapePayload, ShapeFilledAction, StitchActions, StitchActionTypes } from "./stitch.actions"
import { map, withLatestFrom } from "rxjs/operators"
import { Store } from "@ngrx/store"
import { AppState } from "../index"
import { generateScanLines } from "./ScanLineGeneration"
import { optimiseStitchingOrder } from "./StitchOptimisation"
import { SatinFillType } from "../../models"
import { generateStitches } from "./StitchGeneration"

@Injectable()
export class StitchEffects {
    constructor(private actions$: Actions<StitchActions>, private store$: Store<AppState>) {}

    /**
     * Given a shape and fill attributes this generates the stitches that will fill the shape and returns these in a new ShapeFilled Action. The shape itself is not updated.
     */
    @Effect()
    fillShape$: Observable<ShapeFilledAction> = this.actions$.pipe(
        ofType(StitchActionTypes.FILL_SHAPE),
        map(action => action.payload),
        withLatestFrom(this.store$.select(state => state.render.scaling)),
        map(payloadAndState => {
            return { ...payloadAndState[0], scaling: payloadAndState[1] }
        }),
        map(payload => {
            const params = {
                shape: payload.shape,
                fillType: payload.fillType,
                fillColourNumber: payload.fillColourNumber,
                stitchLengthMM: payload.stitchLengthMM,
                stitches: this.getStitchesForShape(payload, payload.scaling)
            }
            return new ShapeFilledAction(params)
        })
    )

    private getStitchesForShape(params: FillShapePayload, scaling: number) {
        this.closePath(params.shape.element)
        if (params.fillType === SatinFillType.None) {
            return []
        } else if (params.fillType === params.shape.fillType) {
            return params.shape.stitches
        } else {
            const scanLines = generateScanLines(params.shape, params.heightMM, params.minStitchLengthMM, scaling, params.renderer)
            optimiseStitchingOrder(params.shape, scanLines)
            return generateStitches(params.shape, scanLines, params.stitchLengthMM, params.minStitchLengthMM, scaling)
        }
    }

    /**
     * Make's sure that the path is closed otherwise it can't be filled properly. We don't do this when we load the file as we might not be filling the shape
     */
    private closePath(element: SVGPathElement) {
        const path = element.getAttribute("d")!.trim()
        if (!path.endsWith("Z") && !path.endsWith("z")) {
            element.setAttribute("d", path + "Z")
        }
    }
}
