import { Injectable, Renderer2 } from "@angular/core"
import { Actions, Effect, ofType } from "@ngrx/effects"
import { SelectActionTypes, SelectedShapeActions } from "./selected.shape.actions"
import { Observable } from "rxjs"
import { filter, map, tap, withLatestFrom } from "rxjs/operators"
import { Shape } from "../../models"
import { AppState } from "../index"
import { Store } from "@ngrx/store"

@Injectable()
export class SelectedShapeEffects {
    readonly RECT1_CLASS = "selection-rect1"
    readonly RECT2_CLASS = "selection-rect2"
    readonly SELECTED_CLASS = "selected-element"

    constructor(private actions$: Actions<SelectedShapeActions>, private store$: Store<AppState>) {}

    @Effect({ dispatch: false })
    shapeSelected$: Observable<any> = this.actions$.pipe(
        ofType(SelectActionTypes.SHAPE_SELECTED),
        map(action => action.payload),
        filter(payload => payload.selectedShape !== undefined),
        tap(payload => this.selectShape(payload.selectedShape, payload.renderer, payload.group))
    )

    @Effect({ dispatch: false })
    shapeDeselected$: Observable<any> = this.actions$.pipe(
        ofType(SelectActionTypes.SHAPE_DESELECTED),
        map(action => action.payload),
        withLatestFrom(this.store$.select(state => state.selectedShape.previousShape)),
        map(payloadAndState => {
            return { ...payloadAndState[0], previousShape: payloadAndState[1] }
        }),
        tap(state => this.deselectShape(state.group, state.renderer, state.previousShape))
    )

    private selectShape(shape: Shape, renderer: Renderer2, group: SVGGElement) {
        const element = shape.element
        element.classList.add(this.SELECTED_CLASS)

        const selectionRect1 = renderer.createElement("rect", "svg")
        const bbox = element.getBBox()
        selectionRect1!.setAttribute("x", `${bbox.x}`)
        selectionRect1!.setAttribute("y", `${bbox.y}`)
        selectionRect1!.setAttribute("height", `${bbox.height}`)
        selectionRect1!.setAttribute("width", `${bbox.width}`)
        renderer.setAttribute(selectionRect1, "vector-effect", "non-scaling-stroke")
        renderer.addClass(selectionRect1, this.RECT1_CLASS)
        renderer.appendChild(group, selectionRect1)

        const selectionRect2 = renderer.createElement("rect", "svg")
        selectionRect2!.setAttribute("x", `${bbox.x}`)
        selectionRect2!.setAttribute("y", `${bbox.y}`)
        selectionRect2!.setAttribute("height", `${bbox.height}`)
        selectionRect2!.setAttribute("width", `${bbox.width}`)
        renderer.setAttribute(selectionRect2, "vector-effect", "non-scaling-stroke")
        renderer.addClass(selectionRect2, this.RECT2_CLASS)
        renderer.appendChild(group, selectionRect2)
    }

    private deselectShape(group: SVGGElement, renderer2: Renderer2, previousSelection: Shape | undefined) {
        if (previousSelection) {
            previousSelection.element.classList.remove(this.SELECTED_CLASS)
        }

        const selectionRect1 = group.querySelector(`.${this.RECT1_CLASS}`) as SVGGElement
        if (selectionRect1) {
            renderer2.removeChild(group, selectionRect1)
        } else {
            console.log("selection rect not found")
        }

        const selectionRect2 = group.querySelector(`.${this.RECT2_CLASS}`) as SVGGElement
        if (selectionRect2) {
            renderer2.removeChild(group, selectionRect2)
        }
    }
}
