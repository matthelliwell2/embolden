import { Action } from "@ngrx/store"
import { Renderer2 } from "@angular/core"

export enum FileActionTypes {
    LOAD_FILE = "FileAction.LoadFile",
    SVG_FILE_LOADED = "FileAction.SVGFileLoaded",
    SVG_FILE_RENDERED = "FileAction.SVGFileRendered"
}

/**
 * A file needs to be loaded into the system
 */
export class LoadFileAction implements Action {
    readonly type = FileActionTypes.LOAD_FILE

    constructor(public readonly payload: { readonly file: File }) {}
}

/**
 * SVG file is loaded and render for rendering. The payload contains the contents of the file after and the pre-renderig processing has been done on it, eg pathyfying everything
 */
export class SVGFileLoadedAction implements Action {
    readonly type = FileActionTypes.SVG_FILE_LOADED

    constructor(public readonly payload: { readonly name: string; readonly contents: string }) {}
}

export class SVGFileRenderedAction implements Action {
    readonly type = FileActionTypes.SVG_FILE_RENDERED

    constructor(public readonly payload: { readonly name: string; readonly root: SVGSVGElement; renderer: Renderer2 }) {}
}

export type FileActions = LoadFileAction | SVGFileLoadedAction | SVGFileRenderedAction
