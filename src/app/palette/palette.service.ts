import { Injectable, OnDestroy } from "@angular/core"

import { AdmelodyPolyester } from "./palettes/AdmelodyPolyester"
import { AdmelodyRayon } from "./palettes/AdmelodyRayon"
import { Anchor } from "./palettes/Anchor"
import { ARCPolyester } from "./palettes/ARCPolyester"
import { AurifilPolyester } from "./palettes/AurifilPolyester"
import { ARCRayon } from "./palettes/ARCRayon"
import { AurifilLana } from "./palettes/AurifilLana"
import { AurifilMako } from "./palettes/AurifilMako"
import { AurifilRayon } from "./palettes/AurifilRayon"
import { VikingPalette } from "./palettes/VikingPalette"
import { AurifilRoyal } from "./palettes/AurifilRoyal"
import { BrotherEmbroidery } from "./palettes/BrotherEmbroidery"
import { FlorianiPolyester } from "./palettes/FlorianiPolyester"
import { IsafilRayon } from "./palettes/IsafilRayon"
import { MarathonPolyester } from "./palettes/MarathonPolyester"
import { Metro } from "./palettes/Metro"
import { MadeiraMatt } from "./palettes/MadeiraMatt"
import { BrildorCO } from "./palettes/BrildorCO"
import { MadeiraRayon } from "./palettes/MadeiraRayon"
import { RoyalPolyester } from "./palettes/RoyalPolyester"
import { BrildorPB } from "./palettes/BrildorPB"
import { IsacordPolyester } from "./palettes/IsacordPolyester"
import { SimthreadPolyester } from "./palettes/SimthreadPolyester"
import { Janome } from "./palettes/Janome"
import { SwistRayon } from "./palettes/SwistRayon"
import { SulkyRayon } from "./palettes/SulkyRayon"
import { SimthreadRayon } from "./palettes/SimthreadRayon"
import { WonderfilRayon } from "./palettes/WonderfilRayon"
import { TristarPolyester } from "./palettes/TristarPolyester"
import { BrildorAC } from "./palettes/BrildorAC"
import { Embroidex } from "./palettes/Embroidex"
import { BrildorMF } from "./palettes/BrildorMF"
import { VyaparRayon } from "./palettes/VyaparRayon"
import { SulkyPolyester } from "./palettes/SulkyPolyester"
import { Princess } from "./palettes/Princess"
import { RadiantRayon } from "./palettes/RadiantRayon"
import { BrildorNY } from "./palettes/BrildorNY"
import { KingStar } from "./palettes/KingStar"
import { Sigma } from "./palettes/Sigma"
import { Gunold } from "./palettes/Gunold"
import { BrotherCountry } from "./palettes/BrotherCountry"
import { TristarRayon } from "./palettes/TristarRayon"
import { MadeiraPolyneon } from "./palettes/MadeiraPolyneon"
import { MettlerEmbroidery } from "./palettes/MettlerEmbroidery"
import { WonderfilPolyester } from "./palettes/WonderfilPolyester"
import { BFCPolyester } from "./palettes/BFCPolyester"
import { DMC } from "./palettes/DMC"
import { IsalonPolyester } from "./palettes/IsalonPolyester"
import { Hemingworth } from "./palettes/Hemingworth"
import { FuFuRayon } from "./palettes/FuFuRayon"
import { FuFuPolyester } from "./palettes/FuFuPolyester"
import { MadeiraBurmilana } from "./palettes/MadeiraBurmilana"
import { PolyX40 } from "./palettes/PolyX40"
import { Emmel } from "./palettes/Emmel"
import { RAL } from "./palettes/RAL"
import { CoatsAlcazar } from "./palettes/CoatsAlcazar"
import { CoatsAlcazarJazz } from "./palettes/CoatsAlcazarJazz"
import { MarathonRayon } from "./palettes/MarathonRayon"
import { CoatsSylko } from "./palettes/CoatsSylko"
import { CoatsSylkoUSA } from "./palettes/CoatsSylkoUSA"
import { FilTecGlide } from "./palettes/FilTecGlide"
import { GutermannCreativDekor } from "./palettes/GutermannCreativDekor"
import { MTBEmbroidex } from "./palettes/MTBEmbroidex"
import { MarathonRayonV3 } from "./palettes/MarathonRayonV3"
import { MettlerPolySheen } from "./palettes/MettlerPolySheen"
import { OutbackEmbroideryRayon } from "./palettes/OutbackEmbroideryRayon"
import { RoyalViscoseRayon } from "./palettes/RoyalViscoseRayon"
import { RobisonAntonPolyester } from "./palettes/RobisonAntonPolyester"
import { RobisonAntonRayon } from "./palettes/RobisonAntonRayon"

/**
 * This exposes the available colour palettes to the rest of the system. It is responsible for loading and saving them from whereever they happen to live
 */
@Injectable({
    providedIn: "root"
})
export class PaletteService implements OnDestroy {
    constructor() {
        this.addPalette(new AdmelodyPolyester())
        this.addPalette(new AdmelodyRayon())
        this.addPalette(new Anchor())
        this.addPalette(new ARCPolyester())
        this.addPalette(new ARCRayon())
        this.addPalette(new AurifilLana())
        this.addPalette(new AurifilMako())
        this.addPalette(new AurifilPolyester())
        this.addPalette(new AurifilRayon())
        this.addPalette(new AurifilRoyal())
        this.addPalette(new BFCPolyester())
        this.addPalette(new BrildorAC())
        this.addPalette(new BrildorCO())
        this.addPalette(new BrildorMF())
        this.addPalette(new BrildorNY())
        this.addPalette(new BrildorPB())
        this.addPalette(new BrotherCountry())
        this.addPalette(new BrotherEmbroidery())
        this.addPalette(new CoatsAlcazar())
        this.addPalette(new CoatsAlcazarJazz())
        this.addPalette(new CoatsSylko())
        this.addPalette(new CoatsSylkoUSA())
        this.addPalette(new DMC())
        this.addPalette(new Embroidex())
        this.addPalette(new Emmel())
        this.addPalette(new FilTecGlide())
        this.addPalette(new FlorianiPolyester())
        this.addPalette(new FuFuPolyester())
        this.addPalette(new FuFuRayon())
        this.addPalette(new Gunold())
        this.addPalette(new GutermannCreativDekor())
        this.addPalette(new Hemingworth())
        this.addPalette(new IsacordPolyester())
        this.addPalette(new IsafilRayon())
        this.addPalette(new IsalonPolyester())
        this.addPalette(new Janome())
        this.addPalette(new KingStar())
        this.addPalette(new MadeiraBurmilana())
        this.addPalette(new MadeiraMatt())
        this.addPalette(new MadeiraPolyneon())
        this.addPalette(new MadeiraRayon())
        this.addPalette(new MarathonPolyester())
        this.addPalette(new MarathonRayon())
        this.addPalette(new MarathonRayonV3())
        this.addPalette(new Metro())
        this.addPalette(new MettlerEmbroidery())
        this.addPalette(new MettlerPolySheen())
        this.addPalette(new MTBEmbroidex())
        this.addPalette(new OutbackEmbroideryRayon())
        this.addPalette(new PolyX40())
        this.addPalette(new Princess())
        this.addPalette(new RadiantRayon())
        this.addPalette(new RAL())
        this.addPalette(new RobisonAntonPolyester())
        this.addPalette(new RobisonAntonRayon())
        this.addPalette(new RoyalPolyester())
        this.addPalette(new RoyalViscoseRayon())
        this.addPalette(new Sigma())
        this.addPalette(new SimthreadPolyester())
        this.addPalette(new SimthreadRayon())
        this.addPalette(new SulkyPolyester())
        this.addPalette(new SulkyRayon())
        this.addPalette(new SwistRayon())
        this.addPalette(new TristarPolyester())
        this.addPalette(new TristarRayon())
        this.addPalette(new VikingPalette())
        this.addPalette(new VyaparRayon())
        this.addPalette(new WonderfilPolyester())
        this.addPalette(new WonderfilRayon())
    }

    private allPalettes: { [key: string]: Palette } = {}

    private addPalette(palette: Palette) {
        this.allPalettes[palette.name] = palette
    }

    get paletteNames(): string[] {
        return Object.keys(this.allPalettes)
    }

    getPalette(name: string): Palette | undefined {
        return this.allPalettes[name]
    }

    ngOnDestroy(): void {
        console.log("OnDestroy PaletteService")
    }
}

export interface Palette {
    name: string
    colours: { [key: string]: Colour }
}

export interface Colour {
    number: string
    name: string
    value: string
}
