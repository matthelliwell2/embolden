import { Injectable } from "@angular/core"
import { Actions, Effect, ofType } from "@ngrx/effects"
import { Observable, Subscriber, zip } from "rxjs"
import * as xmldoc from "xmldoc"
import { filter, flatMap, map } from "rxjs/operators"
import * as lib from "../../lib/lib"
import { FileActions, FileActionTypes, SVGFileLoadedAction } from "./file.actions"

const transform = require("svg-flatten/src/transform.js")
const pathify = require("svg-flatten/src/pathify.js")

@Injectable()
export class FileEffects {
    constructor(private actions$: Actions<FileActions>) {}

    private stringToFlattenedXmlDocument = () => (source: Observable<{ name: string; contents: string }>): Observable<{ name: string; doc: xmldoc.XmlElement }> => {
        const name$ = source.pipe(map(source => source.name))

        const content$ = source.pipe(
            map(source => source.contents),
            map(this.toXmlDocument),
            map(contents => pathify(contents) as xmldoc.XmlElement),
            map(doc => lib.flatten(doc) as xmldoc.XmlElement),
            map(doc => transform(doc) as xmldoc.XmlElement)
        )

        return zip(name$, content$).pipe(
            map(([name, doc]) => {
                return { name: name, doc: doc }
            })
        )
    }

    /**
     * When a request to load a file happens, this reads the file and prepares it ready for rendering
     */
    @Effect()
    svgFileLoaded$: Observable<SVGFileLoadedAction> = this.actions$.pipe(
        ofType(FileActionTypes.LOAD_FILE),
        map(action => action.payload.file),
        filter(this.isSVGFile),
        flatMap(this.loadFile$),
        this.stringToFlattenedXmlDocument(),
        map(file => new SVGFileLoadedAction({ name: file.name, contents: file.doc.toString() }))
    )

    private isSVGFile(file: File): boolean {
        return file.name.toLowerCase().endsWith(".svg")
    }

    private loadFile$(file: File): Observable<{ name: string; contents: string }> {
        return Observable.create((observer: Subscriber<{ name: string; contents: string }>) => {
            const r = new FileReader()
            r.onload = event => {
                const contents = (<FileReader>event.target)!.result as string
                observer.next({ name: file.name, contents: contents })
                observer.complete()
            }

            r.readAsText(file)
        })
    }

    private toXmlDocument(contents: string): xmldoc.XmlElement {
        return new xmldoc.XmlDocument(contents)
    }
}
