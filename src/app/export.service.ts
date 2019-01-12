import { Injectable } from "@angular/core"
import { Destroyable } from "./lib/Store"
import { filter, takeUntil } from "rxjs/operators"
import { Commands, CommandService } from "./command.service"
import { DesignService } from "./design.service"
import { Shape } from "./models"
import { select, Store } from "@ngrx/store"
import { State } from "./store"

const Buffer = require("buffer/").Buffer
const dateFormat = require("dateformat")

@Injectable({
    providedIn: "root"
})
export class ExportService extends Destroyable {
    private scaling: number = 1

    constructor(private commandService: CommandService, private designService: DesignService, private store: Store<State>) {
        super()
        console.log("ExportService started")

        this.commandService
            .getStream()
            .pipe(takeUntil(this.destroyed))
            .subscribe(async command => {
                switch (command.command) {
                    case Commands.EXPORT_FILE_COMMAND:
                        await this.exportFile(command.exportType)
                        break
                }
            })

        this.store
            .pipe(
                filter(state => state.design !== undefined),
                select(state => state.design.scaling),
                takeUntil(this.destroyed)
            )
            .subscribe((scaling: number) => {
                this.scaling = scaling
            })
    }

    private exportFile(type: ExportTypes): void {
        switch (type) {
            case ExportTypes.JEF:
                this.exportJefFile()
                break
            case ExportTypes.DESIGN:
                this.exportDesignFile()
                break
        }
    }

    /**
     * See https://edutechwiki.unige.ch/en/Embroidery_format_JEF and https://github.com/inkstitch/pyembroidery
     */
    private exportJefFile() {
        const data = this.createJefFile()
        const filename = this.getName(this.designService.name!, "jef")

        const file = new Blob([data])
        if (window.navigator.msSaveOrOpenBlob)
            // IE10+
            window.navigator.msSaveOrOpenBlob(file, filename)
        else {
            // Others
            const a = document.createElement("a")
            const url = URL.createObjectURL(file)
            a.href = url
            a.download = filename
            document.body.appendChild(a)
            a.click()
            setTimeout(function() {
                document.body.removeChild(a)
                window.URL.revokeObjectURL(url)
            }, 0)
        }
    }

    private getName(name: string, suffix: string): string {
        const pos = name.lastIndexOf(".")
        if (pos === -1) {
            return `${name}.${suffix}`
        } else {
            return `${name.substring(0, pos)}.${suffix}`
        }
    }

    private createJefFile(): Buffer {
        console.log("Export jef file", this.designService.name)

        const shapes = this.designService.sewableShapes
        const colourCount = this.colourCount(shapes)
        const pointCount = this.pointCount(shapes)

        const buffer = Buffer.alloc(0x74 + 8 * colourCount + pointCount * 2)
        let offset = 0

        const stitchOffset = 0x74 + 8 * colourCount
        offset = buffer.writeUInt32LE(stitchOffset, offset)

        offset = buffer.writeUInt32LE(0x14, offset)

        const dateStr = dateFormat(new Date(), "yyyymmddHHMMss")
        offset = buffer.write(dateStr, offset, undefined, "utf8")

        offset = buffer.writeInt8(0, offset)
        offset = buffer.writeInt8(0, offset)

        offset = buffer.writeUInt32LE(colourCount, offset)
        offset = buffer.writeUInt32LE(pointCount, offset)

        // TODO calculate hoop size?
        offset = buffer.writeUInt32LE(4, offset)

        const bbox = this.boundingBox(shapes)
        offset = buffer.writeUInt32LE(Math.ceil(bbox.width / 2), offset)
        offset = buffer.writeUInt32LE(Math.ceil(bbox.height / 2), offset)
        offset = buffer.writeUInt32LE(Math.ceil(bbox.width / 2), offset)
        offset = buffer.writeUInt32LE(Math.ceil(bbox.height / 2), offset)

        // distances from hoop edges for different hoops
        offset = this.writeHoopEdgeDistance(buffer, offset, 550 - Math.ceil(bbox.width / 2), 550 - Math.ceil(bbox.height / 2))
        offset = this.writeHoopEdgeDistance(buffer, offset, 250 - Math.ceil(bbox.width / 2), 250 - Math.ceil(bbox.height / 2))
        offset = this.writeHoopEdgeDistance(buffer, offset, 700 - Math.ceil(bbox.width / 2), 1000 - Math.ceil(bbox.height / 2))
        offset = this.writeHoopEdgeDistance(buffer, offset, 700 - Math.ceil(bbox.width / 2), 1000 - Math.ceil(bbox.height / 2))

        // Write colours. Don't try and map to the Janome colours as who care so long as it changes colour when expected
        for (let i = 0; i < colourCount; ++i) {
            offset = buffer.writeUInt32LE(i, offset)
        }

        for (let i = 0; i < colourCount; ++i) {
            offset = buffer.writeUInt32LE(0x0d, offset)
        }

        // And now write the stitches. They are written as coordinates relative to the previous stitch
        let x = 0
        let y = 0
        shapes.forEach((shape, i) => {
            shape.stitches.forEach(col =>
                col.forEach(point => {
                    const dx = point.x - x
                    const dy = point.y - y

                    offset = buffer.writeInt8(dx, offset)
                    offset = buffer.writeInt8(-dy, offset)
                    x = point.x
                    y = point.y
                })
            )

            const nextShape = shapes[i + 1]
            if (nextShape) {
                if (nextShape.fillColourNumber !== shape.fillColourNumber) {
                    offset = buffer.writeInt8(0x80, offset)
                    offset = buffer.writeInt8(0x01, offset)
                } else {
                    offset = buffer.writeInt8(0x80, offset)
                    offset = buffer.writeInt8(0x02, offset)
                }
            }
        })

        offset = buffer.writeInt8(0x80, offset)
        offset = buffer.writeInt8(0x10, offset)

        return buffer
    }

    private writeHoopEdgeDistance(buffer: Buffer, offset: number, xDistance: number, yDistance: number): number {
        if (xDistance >= 0 && yDistance >= 0) {
            offset = buffer.writeUInt32LE(xDistance, offset)
            offset = buffer.writeUInt32LE(yDistance, offset)
            offset = buffer.writeUInt32LE(xDistance, offset)
            offset = buffer.writeUInt32LE(yDistance, offset)
        } else {
            offset = buffer.writeUInt32LE(-1, offset)
            offset = buffer.writeUInt32LE(-1, offset)
            offset = buffer.writeUInt32LE(-1, offset)
            offset = buffer.writeUInt32LE(-1, offset)
        }
        return offset
    }

    /**
     * How may different colours are there in the shapes
     */
    private colourCount(shapes: Shape[]): number {
        const colours = shapes.reduce((colours, shape) => {
            colours.add(shape.fillColourNumber!)
            return colours
        }, new Set<string>())

        return colours.size
    }

    private boundingBox(shapes: Shape[]): { x: number; y: number; width: number; height: number } {
        let xmin = Number.POSITIVE_INFINITY
        let xmax = Number.NEGATIVE_INFINITY
        let ymin = Number.POSITIVE_INFINITY
        let ymax = Number.NEGATIVE_INFINITY

        shapes.forEach(shape => {
            const bbox = shape.element.getBBox()
            xmin = Math.min(xmin, bbox.x)
            ymin = Math.min(ymin, bbox.y)

            xmax = Math.max(xmax, bbox.x + bbox.width)
            ymax = Math.max(ymax, bbox.x + bbox.height)
        })

        return { x: xmin / this.scaling, y: ymin / this.scaling, width: (xmax - xmin) / this.scaling, height: (ymax - ymin) / this.scaling }
    }

    /**
     * This is the number of stitches + the number of jump and colour change commands + 1 for the end command we have to set at the end
     */
    private pointCount(shapes: Shape[]): number {
        // We need to reduce the count by one as we don't need a jump command to start the first shape. But we then need to increase it by one for the end command so it
        // balances out

        return shapes.reduce((count, shape) => {
            count += shape.stitchCount

            // Each shape is made of up a number of discontiguous part with a jump between them
            count += shape.stitches.length

            // We need a jump or colour change command to move between each shape
            ++count

            return count
        }, 0)
    }

    private exportDesignFile() {
        console.log("Export design file - not support yet", this.designService.name)
    }
}

export enum ExportTypes {
    DESIGN = "Design",
    JEF = ".jef"
}

/*
function download(data, filename, type) {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}
 */
