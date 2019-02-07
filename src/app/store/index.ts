import { ActionReducerMap, MetaReducer } from "@ngrx/store"
import * as file from "./file/file.reducer"
import { DesignState, RenderState } from "./file/file.reducer"
import * as selectedShape from "./select/selected.shape.reducer"
import { SelectedShapeState } from "./select/selected.shape.reducer"
import * as stitch from "./stitch/stitch.reducer"
import { environment } from "../../environments/environment"

export interface AppState {
    design: DesignState
    selectedShape: SelectedShapeState
    render: RenderState
    stitch: DesignState
}

export const reducers: ActionReducerMap<AppState> = {
    design: file.designReducer,
    selectedShape: selectedShape.selectReducer,
    render: file.renderReducer,
    stitch: stitch.stitchReducer
}

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : []
