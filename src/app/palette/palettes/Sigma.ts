import { Palette } from "../palette.service"

export class Sigma implements Palette {
    name = "Sigma"
    colours = {
        "1031": { name: "Deep Violet", number: "1031", value: "#4b4884" },
        "1140": { name: "Light Natural", number: "1140", value: "#ededd2" },
        "1145": { name: "Wheat", number: "1145", value: "#f3d8a8" },
        "1148": { name: "Desert Sand", number: "1148", value: "#c8be96" },
        "1163": { name: "Egyptian Blue", number: "1163", value: "#243a7d" },
        "1183": { name: "Gecko", number: "1183", value: "#86be4e" },
        "1241": { name: "Burgandy", number: "1241", value: "#8e4044" },
        "1323": { name: "Med Orchid", number: "1323", value: "#893480" },
        "1324": { name: "Med Purple", number: "1324", value: "#8c6daa" },
        "1552": { name: "Very Old Gold", number: "1552", value: "#b6a36c" },
        "1615": { name: "Light Spruce", number: "1615", value: "#2e9f76" },
        "1619": { name: "Paris Green", number: "1619", value: "#98c173" },
        "1707": { name: "Timberwolf", number: "1707", value: "#cdcdcd" },
        "2031": { name: "Bright Blue", number: "2031", value: "#2a377e" },
        "2093": { name: "Turquoise Blue", number: "2093", value: "#006ca5" },
        "2250": { name: "Dark Wine", number: "2250", value: "#834455" },
        "2518": { name: "Beige", number: "2518", value: "#d0a44f" },
        "2519": { name: "Gold", number: "2519", value: "#ed9206" },
        "3001": { name: "Med Orange", number: "3001", value: "#edef05" },
        "3014": { name: "Dark Salmon", number: "3014", value: "#c07a46" },
        "3015": { name: "Fire Red", number: "3015", value: "#b43c3c" },
        "3142": { name: "Saddle Brown", number: "3142", value: "#915f46" },
        "4117": { name: "Yellow Sun", number: "4117", value: "#ffc500" },
        "4371": { name: "Deep Taupe", number: "4371", value: "#a68a68" },
        "4419": { name: "Sky Blue", number: "4419", value: "#00a4d9" },
        "4627": { name: "Wild Peacock", number: "4627", value: "#0b7f85" },
        "4735": { name: "Millard Green", number: "4735", value: "#002d1f" },
        "5552": { name: "Dark Blue", number: "5552", value: "#11263c" },
        "5554": { name: "Powder Blue", number: "5554", value: "#91b9e2" },
        "5557": { name: "Froggy Green", number: "5557", value: "#429648" },
        "8010": { name: "Stone Grey", number: "8010", value: "#878c8c" },
        ST10: { name: "White", number: "ST10", value: "#ffffff" },
        ST20: { name: "Black", number: "ST20", value: "#000000" },
        ST21: { name: "Light Neon Green", number: "ST21", value: "#edff50" },
        ST32: { name: "Neon Green", number: "ST32", value: "#96e845" },
        ST33: { name: "Light Neon Orange", number: "ST33", value: "#ffe756" },
        ST43: { name: "Med Neon Orange", number: "ST43", value: "#ff7824" },
        ST46: { name: "Neon Pink", number: "ST46", value: "#f28da6" },
        ST47: { name: "Neon Orange Pink", number: "ST47", value: "#c70c57" },
        T101: { name: "Silver", number: "T101", value: "#e22d2a" },
        T102: { name: "Silver Diamond", number: "T102", value: "#b8b8b8" },
        T112: { name: "Lava Stone", number: "T112", value: "#889186" },
        T115: { name: "Medium Grey", number: "T115", value: "#737f7f" },
        T116: { name: "Dark Platinum", number: "T116", value: "#565e5a" },
        T117: { name: "Charcoal", number: "T117", value: "#515250" },
        T118: { name: "Badger Grey", number: "T118", value: "#787668" },
        T135: { name: "Pumpkin Orange", number: "T135", value: "#ed572f" },
        T138: { name: "Turquoise", number: "T138", value: "#2ea59c" },
        T142: { name: "Dark Wedgewood", number: "T142", value: "#396276" },
        T213: { name: "Cardinal Red", number: "T213", value: "#9b3b40" },
        T216: { name: "Maroon", number: "T216", value: "#6c3e47" },
        T253: { name: "Rust", number: "T253", value: "#ba6e4d" },
        T255: { name: "Medium Rust", number: "T255", value: "#bb3d2e" },
        T301: { name: "Natural Pink", number: "T301", value: "#f9dfcf" },
        T303: { name: "Baby Pink", number: "T303", value: "#fbded6" },
        T304: { name: "Piggy Pink", number: "T304", value: "#f7cdd5" },
        T305: { name: "Sweet Pink", number: "T305", value: "#f2afb4" },
        T307: { name: "Blushing Pink", number: "T307", value: "#e8418c" },
        T309: { name: "Pink", number: "T309", value: "#e77f9d" },
        T313: { name: "Rose Pink", number: "T313", value: "#f06f8c" },
        T317: { name: "Green", number: "T317", value: "#008340" },
        T321: { name: "Shocking Pink", number: "T321", value: "#df99b6" },
        T325: { name: "Ruby", number: "T325", value: "#820052" },
        T333: { name: "Garnet", number: "T333", value: "#b1415f" },
        T345: { name: "Light Purple", number: "T345", value: "#c394ae" },
        T347: { name: "Medium Purple", number: "T347", value: "#a86e91" },
        T348: { name: "Dark Grape", number: "T348", value: "#694169" },
        T376: { name: "Pastel Light Pink", number: "T376", value: "#e6cfd5" },
        T379: { name: "Light Baby Blue", number: "T379", value: "#a8bed7" },
        T380: { name: "Crystal Blue", number: "T380", value: "#a0bfd7" },
        T381: { name: "Very Light Lavender", number: "T381", value: "#90a6c6" },
        T382: { name: "Cornflower", number: "T382", value: "#8fafc6" },
        T383: { name: "Lavender", number: "T383", value: "#b1b8d3" },
        T385: { name: "Denim", number: "T385", value: "#416c9b" },
        T386: { name: "Light Violet", number: "T386", value: "#7d77af" },
        T387: { name: "Misty Rose", number: "T387", value: "#fadaf4" },
        T390: { name: "Grape", number: "T390", value: "#664090" },
        T402: { name: "Lt. Weathered Blue", number: "T402", value: "#eaf0f9" },
        T403: { name: "Baby Blue", number: "T403", value: "#a6d8f6" },
        T404: { name: "Med Baby Blue", number: "T404", value: "#7b9cb0" },
        T406: { name: "Med Pastel Blue", number: "T406", value: "#648dc7" },
        T409: { name: "Blue Raspberry", number: "T409", value: "#3d6aa1" },
        T413: { name: "Med Royal Blue", number: "T413", value: "#2d4491" },
        T414: { name: "Ocean Blue", number: "T414", value: "#143d7a" },
        T415: { name: "Med Navy", number: "T415", value: "#113263" },
        T423: { name: "Dark Navy", number: "T423", value: "#0e1f38" },
        T432: { name: "Bright Sunshine", number: "T432", value: "#0e1f38" },
        T443: { name: "Teal", number: "T443", value: "#0091a5" },
        T448: { name: "Deep Teal", number: "T448", value: "#466e64" },
        T449: { name: "Dark Teal", number: "T449", value: "#00474d" },
        T466: { name: "Old Gold", number: "T466", value: "#e5b15c" },
        T501: { name: "Cream", number: "T501", value: "#d5bf9b" },
        T503: { name: "Pale Salmon", number: "T503", value: "#ffd085" },
        T505: { name: "Med Peach", number: "T505", value: "#f6b08e" },
        T506: { name: "Pink Salmon", number: "T506", value: "#b3e851" },
        T508: { name: "Dark Peach", number: "T508", value: "#f1a236" },
        T513: { name: "Dark Brown", number: "T513", value: "#6e4337" },
        T527: { name: "Pale Red", number: "T527", value: "#d8493e" },
        T541: { name: "Heron Blue", number: "T541", value: "#697698" },
        T601: { name: "Pale Yellow", number: "T601", value: "#fde896" },
        T602: { name: "Pastel Yellow", number: "T602", value: "#ede55d" },
        T609: { name: "Golden Puppy", number: "T609", value: "#dfa200" },
        T612: { name: "Buttercup", number: "T612", value: "#fde896" },
        T616: { name: "Treasure Gold", number: "T616", value: "#ceb24c" },
        T619: { name: "Old Gold", number: "T619", value: "#ad953e" },
        T627: { name: "Pale Apricot", number: "T627", value: "#fef9ea" },
        T628: { name: "Tan", number: "T628", value: "#bd9565" },
        T632: { name: "Mellow Yellow", number: "T632", value: "#fdf76c" },
        T633: { name: "Lemon", number: "T633", value: "#edef05" },
        T646: { name: "Amber", number: "T646", value: "#f8c300" },
        T649: { name: "Mandarina", number: "T649", value: "#e77817" },
        T650: { name: "Orange", number: "T650", value: "#e66535" },
        T652: { name: "Golden Rod", number: "T652", value: "#c69632" },
        T653: { name: "Light Olive", number: "T653", value: "#98996d" },
        T654: { name: "Bright Gold", number: "T654", value: "#c98300" },
        T688: { name: "Blue-Green", number: "T688", value: "#007b8d" },
        T695: { name: "Forrest Green", number: "T695", value: "#004d3d" },
        T697: { name: "Midnight Blue", number: "T697", value: "#007eba" },
        T700: { name: "Med Red", number: "T700", value: "#cf0040" },
        T809: { name: "Med Blue", number: "T809", value: "#28438c" },
        T812: { name: "Sweet Apricot", number: "T812", value: "#d0b478" },
        T818: { name: "Skin", number: "T818", value: "#e5be6c" },
        T825: { name: "Jade", number: "T825", value: "#449284" },
        T829: { name: "Light Silver", number: "T829", value: "#cfcfcf" },
        T831: { name: "Papaya Whip", number: "T831", value: "#dc875e" },
        T832: { name: "Cooper", number: "T832", value: "#b4705d" },
        T833: { name: "Light Pecan", number: "T833", value: "#9b5c4b" },
        T838: { name: "Burnt Rust", number: "T838", value: "#a93121" },
        T842: { name: "Vegas Gold", number: "T842", value: "#b18b00" },
        T857: { name: "Med Brown", number: "T857", value: "#86462e" },
        T859: { name: "Med Russett", number: "T859", value: "#614125" },
        T864: { name: "Med Copper", number: "T864", value: "#b25c31" },
        T873: { name: "Dark Driftwood", number: "T873", value: "#806a61" },
        T878: { name: "Birch", number: "T878", value: "#634831" },
        T891: { name: "Dark Chocolate", number: "T891", value: "#1a0c06" },
        T903: { name: "Sky Blue 2", number: "T903", value: "#96d5c8" },
        T904: { name: "Aquamarine", number: "T904", value: "#b4dcd8" },
        T905: { name: "Golden Brown", number: "T905", value: "#af7d3e" },
        T906: { name: "Sea Blue", number: "T906", value: "#00a3a0" },
        T913: { name: "Deep Sea", number: "T913", value: "#00405d" },
        T947: { name: "Pastel Mint", number: "T947", value: "#c9e3c5" },
        T949: { name: "True Green", number: "T949", value: "#55af78" },
        T951: { name: "Med Olive", number: "T951", value: "#858325" },
        T955: { name: "Olive", number: "T955", value: "#61601c" },
        T961: { name: "Light Jade", number: "T961", value: "#709188" },
        T984: { name: "Smith Apple", number: "T984", value: "#bedc8c" },
        T985: { name: "Light Lime", number: "T985", value: "#bee678" },
        T988: { name: "Grass Green", number: "T988", value: "#76c850" },
        T992: { name: "Med Forrest Green", number: "T992", value: "#356936" }
    }
}