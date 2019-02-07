import { DesignState } from "../file/file.reducer"
import { StitchActions, StitchActionTypes } from "./stitch.actions"

export const stitchReducer = (design: DesignState, action: StitchActions): DesignState => {
    if (!design) {
        return design
    }

    switch (action.type) {
        case StitchActionTypes.SHAPE_FILLED:
            console.log("stitchReducer SHAPE_FILLED")
            const payload = action.payload
            const shape = payload.shape

            shape.fillType = payload.fillType
            shape.fillColourNumber = payload.fillColourNumber
            shape.stitches = payload.stitches

            design.shapes.set(shape.id, shape)

            return design

        default:
            return design
    }
}
