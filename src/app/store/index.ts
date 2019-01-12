import { ActionReducerMap, MetaReducer } from "@ngrx/store"
import * as file from "./file/file.reducer"
import { DesignState } from "./file/file.reducer"
import * as selectedShape from "./select/selected.shape.reducer"
import { SelectedShapeState } from "./select/selected.shape.reducer"
import { environment } from "../../environments/environment"

export interface State {
    design: DesignState
    selectedShape: SelectedShapeState
}

export const reducers: ActionReducerMap<State> = { design: file.reducer, selectedShape: selectedShape.reducer }

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : []
