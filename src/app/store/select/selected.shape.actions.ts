import { Action } from "@ngrx/store"
import { Shape } from "../../models"
import { Renderer2 } from "@angular/core"

export enum SelectActionTypes {
    SHAPE_SELECTED = "Select.ShapeSelected",
    SHAPE_DESELECTED = "Select.ShapeDeselected"
}

export class ShapeSelectedAction implements Action {
    readonly type = SelectActionTypes.SHAPE_SELECTED

    constructor(public readonly payload: { readonly selectedShape: Shape; readonly group: SVGGElement; readonly renderer: Renderer2 }) {}
}

export class ShapeDeselectedAction implements Action {
    readonly type = SelectActionTypes.SHAPE_DESELECTED

    constructor(public readonly payload: { readonly group: SVGGElement; readonly renderer: Renderer2 }) {}
}

export type SelectedShapeActions = ShapeSelectedAction | ShapeDeselectedAction
