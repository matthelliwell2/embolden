import { Palette } from "../palette.service"

export class Princess implements Palette {
    name = "Princess"
    colours = {
        "1-1": { name: "White", number: "1-1", value: "#ffffff" },
        "1-2": { name: "Grey", number: "1-2", value: "#d8cdd4" },
        "1-3": { name: "Pink", number: "1-3", value: "#e63c66" },
        "1-4": { name: "Lt. Olive", number: "1-4", value: "#6d8448" },
        "1-5": { name: "Yellow", number: "1-5", value: "#ffd23c" },
        "1-6": { name: "Black", number: "1-6", value: "#000000" },
        "1-7": { name: "Mid Blue", number: "1-7", value: "#5e8cb0" },
        "1-8": { name: "Red", number: "1-8", value: "#ff0003" },
        "1-9": { name: "Green", number: "1-9", value: "#297a1e" },
        "1-10": { name: "Cassis", number: "1-10", value: "#3f3566" },
        "2-1": { name: "Cream", number: "2-1", value: "#e8ddc0" },
        "2-2": { name: "Gold", number: "2-2", value: "#e38246" },
        "2-3": { name: "Light Brown", number: "2-3", value: "#b47253" },
        "2-4": { name: "Orange", number: "2-4", value: "#b42d30" },
        "2-5": { name: "Purple", number: "2-5", value: "#a13f7d" },
        "2-6": { name: "Pewter", number: "2-6", value: "#6a7073" },
        "2-7": { name: "Cyan", number: "2-7", value: "#0098a0" },
        "2-8": { name: "Dark Blue", number: "2-8", value: "#17328e" },
        "2-9": { name: "Olive", number: "2-9", value: "#3c4e2c" },
        "2-10": { name: "Marigold", number: "2-10", value: "#d65c30" },
        "3-1": { name: "Palest Ivory", number: "3-1", value: "#ede4d8" },
        "3-2": { name: "Palest Yellow", number: "3-2", value: "#e8d2a8" },
        "3-3": { name: "Palest Fawn", number: "3-3", value: "#e6c6b6" },
        "3-4": { name: "Palest Peach", number: "3-4", value: "#ebd0cb" },
        "3-5": { name: "Palest Pink", number: "3-5", value: "#eec8dc" },
        "3-6": { name: "Palest Grey", number: "3-6", value: "#dcd8e1" },
        "3-7": { name: "Palest Blue", number: "3-7", value: "#d1d8e7" },
        "3-8": { name: "Palest Aqua", number: "3-8", value: "#cefaf4" },
        "3-9": { name: "Palest Green", number: "3-9", value: "#9bb685" },
        "3-10": { name: "Palest Mauve", number: "3-10", value: "#d3bbd5" },
        "4-1": { name: "Light Blue", number: "4-1", value: "#b6c8e1" },
        "4-2": { name: "Powder Blue", number: "4-2", value: "#87a0d4" },
        "4-3": { name: "Sky Blue", number: "4-3", value: "#7277c7" },
        "4-4": { name: "Slate Blue", number: "4-4", value: "#3e5f97" },
        "4-5": { name: "Storm Blue", number: "4-5", value: "#55577a" },
        "4-6": { name: "Denim", number: "4-6", value: "#262a5c" },
        "4-7": { name: "Petrel Blue", number: "4-7", value: "#0a4b8c" },
        "4-8": { name: "Imperial Blue", number: "4-8", value: "#111b5e" },
        "4-9": { name: "Royal Blue", number: "4-9", value: "#0e2272" },
        "4-10": { name: "Navy Blue", number: "4-10", value: "#12113b" },
        "5-1": { name: "Copper", number: "5-1", value: "#e67850" },
        "5-2": { name: "Golden Brown", number: "5-2", value: "#d76b3c" },
        "5-3": { name: "Tan", number: "5-3", value: "#6e2819" },
        "5-4": { name: "Bark", number: "5-4", value: "#742514" },
        "5-5": { name: "Dark Oak", number: "5-5", value: "#4b1b12" },
        "5-6": { name: "Russet", number: "5-6", value: "#820000" },
        "5-7": { name: "Mahogany", number: "5-7", value: "#501412" },
        "5-8": { name: "Mushroom", number: "5-8", value: "#785436" },
        "5-9": { name: "Khaki", number: "5-9", value: "#5b3c11" },
        "5-10": { name: "Dark Chocolate", number: "5-10", value: "#440100" },
        "6-1": { name: "Light Salmon", number: "6-1", value: "#f8bd9b" },
        "6-2": { name: "Salmon", number: "6-2", value: "#f38a67" },
        "6-3": { name: "Tangerine", number: "6-3", value: "#f25238" },
        "6-4": { name: "Blush", number: "6-4", value: "#e69178" },
        "6-5": { name: "Bronze", number: "6-5", value: "#b85a3c" },
        "6-6": { name: "Scarlet", number: "6-6", value: "#e82925" },
        "6-7": { name: "Rust", number: "6-7", value: "#ca2017" },
        "6-8": { name: "Carmine", number: "6-8", value: "#d20414" },
        "6-9": { name: "Ruby", number: "6-9", value: "#e7001c" },
        "6-10": { name: "Antique Red", number: "6-10", value: "#e02f34" },
        "7-1": { name: "Light Jade", number: "7-1", value: "#90d682" },
        "7-2": { name: "Pistachio", number: "7-2", value: "#9ea446" },
        "7-3": { name: "Fresh Green", number: "7-3", value: "#aac93c" },
        "7-4": { name: "Sage", number: "7-4", value: "#4b9451" },
        "7-5": { name: "Teal", number: "7-5", value: "#406040" },
        "7-6": { name: "Bright Green", number: "7-6", value: "#368f34" },
        "7-7": { name: "Jade", number: "7-7", value: "#297642" },
        "7-8": { name: "Leaf Green", number: "7-8", value: "#3a823c" },
        "7-9": { name: "Emerald", number: "7-9", value: "#1e9129" },
        "7-10": { name: "Dark Green", number: "7-10", value: "#0b6020" },
        "8-1": { name: "Sugar Pink", number: "8-1", value: "#f5c0c8" },
        "8-2": { name: "Petal Pink", number: "8-2", value: "#faaabe" },
        "8-3": { name: "Rose Pink", number: "8-3", value: "#fa86a0" },
        "8-4": { name: "Passion Pink", number: "8-4", value: "#d06690" },
        "8-5": { name: "Dusky Rose", number: "8-5", value: "#be3455" },
        "8-6": { name: "Light Cerise", number: "8-6", value: "#f16985" },
        "8-7": { name: "Dusky Pink", number: "8-7", value: "#ef5b6f" },
        "8-8": { name: "Cerise", number: "8-8", value: "#dc004a" },
        "8-9": { name: "Fuschia", number: "8-9", value: "#ff0076" },
        "8-10": { name: "Raspberry", number: "8-10", value: "#952450" },
        "9-1": { name: "Platinum", number: "9-1", value: "#f4f1ec" },
        "9-2": { name: "Silver Fox", number: "9-2", value: "#b9a4b7" },
        "9-3": { name: "Sleet Grey", number: "9-3", value: "#b0b0bb" },
        "9-4": { name: "Silver Blue", number: "9-4", value: "#747992" },
        "9-5": { name: "Silver Moon", number: "9-5", value: "#968c8e" },
        "9-6": { name: "Willow", number: "9-6", value: "#8a7d66" },
        "9-7": { name: "Dark Grey", number: "9-7", value: "#665366" },
        "9-8": { name: "Steel", number: "9-8", value: "#56536c" },
        "9-9": { name: "Midnight", number: "9-9", value: "#4b4750" },
        "9-10": { name: "Seal", number: "9-10", value: "#242436" },
        "10-1": { name: "Pacific Mist", number: "10-1", value: "#a2fbe6" },
        "10-2": { name: "Mint", number: "10-2", value: "#b8e7ca" },
        "10-3": { name: "Aqua", number: "10-3", value: "#95f4db" },
        "10-4": { name: "Capri", number: "10-4", value: "#31d6e3" },
        "10-5": { name: "Lagoon", number: "10-5", value: "#468c91" },
        "10-6": { name: "Kingfisher", number: "10-6", value: "#1597ae" },
        "10-7": { name: "Lido", number: "10-7", value: "#338e67" },
        "10-8": { name: "Tropical Green", number: "10-8", value: "#286f44" },
        "10-9": { name: "Deep Atlantic", number: "10-9", value: "#226064" },
        "0-10": { name: "Ocean Depths", number: "0-10", value: "#284346" },
        "11-1": { name: "Delicate Mauve", number: "11-1", value: "#ffd2dc" },
        "11-2": { name: "Pale Lilac", number: "11-2", value: "#e1bae9" },
        "11-3": { name: "Lilac", number: "11-3", value: "#9f6b9c" },
        "11-4": { name: "Lavender", number: "11-4", value: "#c466a8" },
        "11-5": { name: "Violet", number: "11-5", value: "#974c94" },
        "11-6": { name: "Clematis", number: "11-6", value: "#bd4b97" },
        "11-7": { name: "Imperial Purple", number: "11-7", value: "#5d3b7b" },
        "11-8": { name: "Amethyst", number: "11-8", value: "#8e5fc4" },
        "11-9": { name: "Deep Violet", number: "11-9", value: "#813a7e" },
        "12-1": { name: "Pale Lemon", number: "12-1", value: "#fef6c4" },
        "12-2": { name: "Mimosa", number: "12-2", value: "#f8bb55" },
        "12-3": { name: "Lime", number: "12-3", value: "#fbfb42" },
        "12-4": { name: "Daffodil", number: "12-4", value: "#f9d271" },
        "12-5": { name: "Sunkissed", number: "12-5", value: "#d79b60" },
        "12-6": { name: "Golden Lights", number: "12-6", value: "#f5b422" },
        "12-7": { name: "Soleil", number: "12-7", value: "#ff7c1c" },
        "12-8": { name: "Golden Glory", number: "12-8", value: "#e1481c" },
        "12-9": { name: "Sunburst", number: "12-9", value: "#d38347" }
    }
}
