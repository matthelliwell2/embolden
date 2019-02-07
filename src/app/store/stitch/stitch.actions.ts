import { Action } from "@ngrx/store"
import { Point, SatinFillType, Shape } from "../../models"
import { Renderer2 } from "@angular/core"

export enum StitchActionTypes {
    FILL_SHAPE = "StitchAction.FillShape",
    SHAPE_FILLED = "StitchActions.ShapeFilled"
}

export type FillShapePayload = {
    readonly shape: Shape
    readonly fillType: SatinFillType
    readonly fillColourNumber: string
    readonly stitchLengthMM: number
    readonly heightMM: number
    readonly minStitchLengthMM: number
    readonly renderer: Renderer2
}

export class FillShapeAction implements Action {
    readonly type = StitchActionTypes.FILL_SHAPE

    constructor(public readonly payload: FillShapePayload) {}
}

export type ShapeFilledPayload = {
    readonly shape: Shape
    readonly fillType: SatinFillType
    readonly fillColourNumber: string
    readonly stitchLengthMM: number
    readonly stitches: Point[][]
}

export class ShapeFilledAction implements Action {
    readonly type = StitchActionTypes.SHAPE_FILLED

    constructor(public readonly payload: ShapeFilledPayload) {}
}

export type StitchActions = FillShapeAction | ShapeFilledAction
