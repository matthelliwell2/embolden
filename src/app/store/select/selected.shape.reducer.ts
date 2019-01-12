import { Shape } from "../../models"
import { SelectActionTypes, SelectedShapeActions } from "./selected.shape.actions"

export interface SelectedShapeState {
    selectedShape: Shape | undefined
    previousShape: Shape | undefined
}

export class InitialSelectedState implements SelectedShapeState {
    selectedShape: Shape | undefined = undefined
    previousShape: Shape | undefined = undefined
}

export const reducer = (state = new InitialSelectedState(), action: SelectedShapeActions): SelectedShapeState => {
    switch (action.type) {
        case SelectActionTypes.SHAPE_SELECTED:
            return { previousShape: state.selectedShape, selectedShape: action.payload.selectedShape }

        case SelectActionTypes.SHAPE_DESELECTED:
            return { previousShape: state.selectedShape, selectedShape: undefined }

        default:
            return state
    }
}
