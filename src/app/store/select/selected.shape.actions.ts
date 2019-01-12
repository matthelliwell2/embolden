import { Action } from "@ngrx/store"
import { Shape } from "../../models"

export enum SelectActionTypes {
    SHAPE_SELECTED = "Select.ShapeSelected",
    SHAPE_DESELECTED = "Select.ShapeDelselected"
}

export class ShapeSelectedAction implements Action {
    readonly type = SelectActionTypes.SHAPE_SELECTED

    constructor(public readonly payload: { readonly selectedShape: Shape; readonly group: SVGGElement }) {}
}

export class ShapeDeselected implements Action {
    readonly type = SelectActionTypes.SHAPE_DESELECTED

    constructor() {}
}

export type SelectedShapeActions = ShapeSelectedAction | ShapeDeselected
