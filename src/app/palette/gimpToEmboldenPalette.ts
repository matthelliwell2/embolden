import { rgbToHex } from "./rgbToHex"
import { Colour } from "./palette.service"
import * as fs from "fs"

/**
 * A function that takes a diredctory gimp palettes and creates a typescript file in the internal format of embolden
 */
export const gimpToEmboldenPalette = (dir: string): void => {
    console.log("Processing directory", dir)

    fs.readdirSync(dir)
        .filter(name => name.endsWith(".gpl"))
        .map(name => `${dir}/${name}`)
        .map(inputName => {
            console.log("Processing file", inputName)
            const input = fs
                .readFileSync(inputName)
                .toString()
                .split("\n")

            const paletteName = toPaletteName(input[1])

            const colours: { [key: string]: Colour } = {}
            input
                .slice(4)
                .filter(line => line.length > 0)
                .map(toColour)
                .forEach(colour => (colours[colour.number] = colour))

            const coloursStr = Object.keys(colours)
                .map(colourNumber => colours[colourNumber])
                .map(toColourStringMap)
                .join(",\n")

            const className = paletteName.replace(/ /g, "").replace(/-/g, "")
            const output = `
import { Palette } from "../palette.service"

export class ${className} implements Palette {
    name = '${paletteName}'
    colours = {${coloursStr}}
}
`
            const outputName = className.trim().replace(/ /g, "")
            fs.writeFileSync(`${dir}/${outputName}.ts`, output)
        })
}

const toColour = (line: string): Colour => {
    const red = line.substr(0, 3).trim()
    const green = line.substr(4, 3).trim()
    const blue = line.substr(8, 3).trim()
    const name = line
        .substr(11, 32)
        .replace(/'/g, "")
        .trim()
    const number = line.substr(45).trim()

    return { number: number, name: name, value: rgbToHex(Number(red), Number(green), Number(blue)) }
}

const toColourStringMap = (colour: Colour): string => {
    const line = `'${colour.number}': {name: '${colour.name}', number: '${colour.number}', value: '${colour.value}'}`
    console.log("colourStringMap", line)
    return line
}

const toPaletteName = (line: string): string => {
    const parts = line.split(":")
    return parts[parts.length - 1].trim()
}
