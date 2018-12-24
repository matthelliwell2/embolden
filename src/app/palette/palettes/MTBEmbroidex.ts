import { Palette } from "../palette.service"

export class MTBEmbroidex implements Palette {
    name = "MTB - Embroidex"
    colours = {
        P101: { name: "Black", number: "P101", value: "#000000" },
        P102: { name: "White", number: "P102", value: "#ffffff" },
        P110: { name: "Off White", number: "P110", value: "#fff1d7" },
        P115: { name: "Sand", number: "P115", value: "#f2fbd7" },
        P120: { name: "Lt Beige", number: "P120", value: "#ede3b8" },
        P121: { name: "Beige", number: "P121", value: "#c6ae9d" },
        P122: { name: "SandStone", number: "P122", value: "#c4bb9d" },
        P123: { name: "Beachcomber", number: "P123", value: "#b7ac86" },
        P125: { name: "Dusky Goldenrod", number: "P125", value: "#d6c29e" },
        P126: { name: "Twilight Harvest", number: "P126", value: "#bfac6a" },
        P127: { name: "Brown", number: "P127", value: "#78603f" },
        P130: { name: "Sienna", number: "P130", value: "#e2c57e" },
        P131: { name: "Sienna Rose", number: "P131", value: "#b98a44" },
        P135: { name: "Sienna Brass", number: "P135", value: "#a36814" },
        P140: { name: "Light Cocoa", number: "P140", value: "#915735" },
        P143: { name: "Burnished Eggplant", number: "P143", value: "#5e3433" },
        P145: { name: "Spanish Roast", number: "P145", value: "#482626" },
        P195: { name: "Pearled Gold", number: "P195", value: "#f8f4d3" },
        P196: { name: "Golden Sand", number: "P196", value: "#f2ecb6" },
        P200: { name: "Pearled bronze", number: "P200", value: "#f7f4c9" },
        P201: { name: "Pale Gold", number: "P201", value: "#fdeca8" },
        P205: { name: "Buttercup", number: "P205", value: "#fbf259" },
        P206: { name: "Bright gold", number: "P206", value: "#f9e926" },
        P207: { name: "Goldenrod", number: "P207", value: "#e6c44d" },
        P210: { name: "Brass", number: "P210", value: "#e2b30e" },
        P211: { name: "Brass Rose", number: "P211", value: "#f8c272" },
        P212: { name: "Dusky Brass", number: "P212", value: "#d9a603" },
        P215: { name: "Cayenne", number: "P215", value: "#da630c" },
        P220: { name: "Cinnamon", number: "P220", value: "#dd790b" },
        P221: { name: "Orange Glory", number: "P221", value: "#a22f03" },
        P224: { name: "Antique Bronze", number: "P224", value: "#bea80c" },
        P225: { name: "Antique Gold", number: "P225", value: "#be9a0c" },
        P226: { name: "Pickled Olive", number: "P226", value: "#9e810a" },
        P300: { name: "Cool Mint", number: "P300", value: "#cdf3a7" },
        P305: { name: "California Lime", number: "P305", value: "#a8eb65" },
        P306: { name: "Vivid Mint", number: "P306", value: "#73be0c" },
        P307: { name: "Grey Moss", number: "P307", value: "#c2da70" },
        P308: { name: "Deep Moss", number: "P308", value: "#60731e" },
        P310: { name: "New Pine", number: "P310", value: "#509526" },
        P312: { name: "Lilypad Green", number: "P312", value: "#4f5b1a" },
        P313: { name: "Palmetto", number: "P313", value: "#49601a" },
        P314: { name: "Black Pine", number: "P314", value: "#324211" },
        P315: { name: "Spring Fern", number: "P315", value: "#c4d257" },
        P316: { name: "Olive", number: "P316", value: "#9c8b29" },
        P320: { name: "Parsley", number: "P320", value: "#877823" },
        P325: { name: "Golden Pine", number: "P325", value: "#62681a" },
        P400: { name: "Frosted Wintergreen", number: "P400", value: "#e1f9cc" },
        P401: { name: "Pastoral Green", number: "P401", value: "#acc774" },
        P405: { name: "Deep Wintergreen", number: "P405", value: "#56cb80" },
        P406: { name: "Parrot Green", number: "P406", value: "#6cad14" },
        P407: { name: "Christmas Fir", number: "P407", value: "#335909" },
        P408: { name: "Morning Cyan", number: "P408", value: "#d1fae6" },
        P409: { name: "Dusky Cyan", number: "P409", value: "#83c2e9" },
        P410: { name: "Mountain Lake", number: "P410", value: "#348b71" },
        P411: { name: "Lake Shadows", number: "P411", value: "#266f66" },
        P415: { name: "Lake Forest", number: "P415", value: "#308168" },
        P416: { name: "Midnight Lake", number: "P416", value: "#164b45" },
        P420: { name: "Winter Morning", number: "P420", value: "#e1f7f4" },
        P421: { name: "Pearled Coneflower", number: "P421", value: "#d0f0fd" },
        P422: { name: "winter Haze", number: "P422", value: "#cad5dd" },
        P423: { name: "Russina Blue", number: "P423", value: "#757886" },
        P424: { name: "Charcoal Blue", number: "P424", value: "#686b77" },
        P425: { name: "Summer morning", number: "P425", value: "#acd3df" },
        P426: { name: "Harbor", number: "P426", value: "#30697a" },
        P427: { name: "Cornflower", number: "P427", value: "#8399ba" },
        P428: { name: "Dusky Harbor", number: "P428", value: "#5c97c2" },
        P429: { name: "Harbor Twilight", number: "P429", value: "#27415c" },
        P430: { name: "Royal Blue", number: "P430", value: "#2e4172" },
        P431: { name: "Suskty Navy", number: "P431", value: "#455165" },
        P435: { name: "Deep Navy", number: "P435", value: "#3f3c60" },
        P500: { name: "Frosted Rose", number: "P500", value: "#fde8ec" },
        P501: { name: "Rose", number: "P501", value: "#fabebf" },
        P505: { name: "Pearled Rose", number: "P505", value: "#fcd8d8" },
        P506: { name: "Tea Rose", number: "P506", value: "#f79bc5" },
        P507: { name: "Vivid Rose", number: "P507", value: "#f18bdd" },
        P510: { name: "Salmon Rose", number: "P510", value: "#e69f9b" },
        P515: { name: "Dusty Fuschia", number: "P515", value: "#b12597" },
        P520: { name: "Light Rose", number: "P520", value: "#c10d71" },
        P525: { name: "Paprika Red", number: "P525", value: "#d50000" },
        P526: { name: "Cherrywood Red", number: "P526", value: "#9b0000" },
        P530: { name: "Dusty Burgundy", number: "P530", value: "#7e0a41" },
        P531: { name: "Burgandy", number: "P531", value: "#6f0939" },
        P535: { name: "Pearld Burgandy", number: "P535", value: "#bc0e61" },
        P540: { name: "Syrah", number: "P540", value: "#560741" },
        P600: { name: "Blonde", number: "P600", value: "#fce4ad" },
        P605: { name: "Platinum Rose", number: "P605", value: "#fedabc" },
        P606: { name: "Dusty Salmon", number: "P606", value: "#fdc9a6" },
        P607: { name: "Pearled Salmon", number: "P607", value: "#fab796" },
        P610: { name: "Salmon", number: "P610", value: "#f8a278" },
        P612: { name: "Vivid Salmon", number: "P612", value: "#ff8080" },
        P613: { name: "Light Mauve", number: "P613", value: "#f4bbc4" },
        P695: { name: "Light Lilac", number: "P695", value: "#b8a1a9" },
        P696: { name: "Antique Lilac", number: "P696", value: "#8d758f" },
        P697: { name: "Silver Lilac", number: "P697", value: "#9b888b" },
        P700: { name: "Lilac", number: "P700", value: "#cf9ab3" },
        P701: { name: "Twilight Lilac", number: "P701", value: "#9666a8" },
        P702: { name: "Lupine", number: "P702", value: "#7d5ea8" },
        P703: { name: "Deep Violet", number: "P703", value: "#84467a" },
        P704: { name: "Royal Eggplant", number: "P704", value: "#633c68" },
        P705: { name: "Twilight Lupine", number: "P705", value: "#5b437c" },
        P800: { name: "Platinum", number: "P800", value: "#dcdcdb" },
        P801: { name: "Quartz", number: "P801", value: "#d9e8d7" },
        P802: { name: "Titanium", number: "P802", value: "#c6bbb9" },
        P803: { name: "Blue Titanium", number: "P803", value: "#bbbbbb" },
        P805: { name: "Anitque Platinum", number: "P805", value: "#9c9c92" },
        P810: { name: "Hematite", number: "P810", value: "#858578" },
        P815: { name: "Twilight", number: "P815", value: "#57504f" }
    }
}
