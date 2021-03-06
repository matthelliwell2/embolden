import { Palette } from "../palette.service"

export class RAL implements Palette {
    name = "RAL"
    colours = {
        "1000": { name: "Green Beige", number: "1000", value: "#d6c794" },
        "1001": { name: "Beige", number: "1001", value: "#d9ba8c" },
        "1002": { name: "Sand Yellow", number: "1002", value: "#d6b075" },
        "1003": { name: "Signal Yellow", number: "1003", value: "#fca329" },
        "1004": { name: "Golden Yellow", number: "1004", value: "#e39624" },
        "1005": { name: "Honey Yellow", number: "1005", value: "#c98721" },
        "1006": { name: "Maize Yellow", number: "1006", value: "#e0821f" },
        "1007": { name: "Daffodil Yellow", number: "1007", value: "#e37a1f" },
        "1011": { name: "Brown Beige", number: "1011", value: "#ad7a4f" },
        "1012": { name: "Lemon Yellow", number: "1012", value: "#e3b838" },
        "1013": { name: "Oyster White", number: "1013", value: "#fff5e3" },
        "1014": { name: "Ivory", number: "1014", value: "#f0d6ab" },
        "1015": { name: "Light Ivory", number: "1015", value: "#fcebcc" },
        "1016": { name: "Sulfur Yellow", number: "1016", value: "#fff542" },
        "1017": { name: "Saffron Yellow", number: "1017", value: "#ffab59" },
        "1018": { name: "Zinc Yellow", number: "1018", value: "#ffd64d" },
        "1019": { name: "Grey Beige", number: "1019", value: "#a38c7a" },
        "1020": { name: "Olive Yellow", number: "1020", value: "#9c8f61" },
        "1021": { name: "Rape Yellow", number: "1021", value: "#fcbd1f" },
        "1023": { name: "Traffic Yellow", number: "1023", value: "#fcb821" },
        "1024": { name: "Ochre Yellow", number: "1024", value: "#b58c4f" },
        "1026": { name: "Luminous Yellow", number: "1026", value: "#ffff0a" },
        "1027": { name: "Curry", number: "1027", value: "#997521" },
        "1028": { name: "Melon Yellow", number: "1028", value: "#ff8c1a" },
        "1032": { name: "Broom Yellow", number: "1032", value: "#e3a329" },
        "1033": { name: "Dahlia Yellow", number: "1033", value: "#ff9436" },
        "1034": { name: "Pastel Yellow", number: "1034", value: "#f7995c" },
        "2000": { name: "Yellow Orange", number: "2000", value: "#e05e1f" },
        "2001": { name: "Red Orange", number: "2001", value: "#ba2e21" },
        "2002": { name: "Vermilion", number: "2002", value: "#cc241c" },
        "2003": { name: "Pastel Orange", number: "2003", value: "#ff6336" },
        "2004": { name: "Pure Orange", number: "2004", value: "#f23b1c" },
        "2005": { name: "Luminous Orange", number: "2005", value: "#fc1c14" },
        "2007": { name: "Luminous Bright Orange", number: "2007", value: "#ff7521" },
        "2008": { name: "Bright Red Orange", number: "2008", value: "#fa4f29" },
        "2009": { name: "Traffic Orange", number: "2009", value: "#eb3b1c" },
        "2010": { name: "Signal Orange", number: "2010", value: "#d44529" },
        "2011": { name: "Deep Orange", number: "2011", value: "#ed5c29" },
        "2012": { name: "Salmon Orange", number: "2012", value: "#de5247" },
        "3000": { name: "Flame Red", number: "3000", value: "#ab1f1c" },
        "3001": { name: "Signal Red", number: "3001", value: "#a3171a" },
        "3002": { name: "Carmine Red", number: "3002", value: "#a31a1a" },
        "3003": { name: "Ruby Red", number: "3003", value: "#8a1214" },
        "3004": { name: "Purple Red", number: "3004", value: "#690f14" },
        "3005": { name: "Wine Red", number: "3005", value: "#4f121a" },
        "3007": { name: "Black Red", number: "3007", value: "#2e121a" },
        "3009": { name: "Oxide Red", number: "3009", value: "#5e2121" },
        "3011": { name: "Brown Red", number: "3011", value: "#781417" },
        "3012": { name: "Beige Red", number: "3012", value: "#cc8273" },
        "3013": { name: "Tomato Red", number: "3013", value: "#961f1c" },
        "3014": { name: "Antique Pink", number: "3014", value: "#d96675" },
        "3015": { name: "Light Pink", number: "3015", value: "#e89cb5" },
        "3016": { name: "Coral Red", number: "3016", value: "#a62426" },
        "3017": { name: "Rose", number: "3017", value: "#d13654" },
        "3018": { name: "Strawberry Red", number: "3018", value: "#cf2942" },
        "3020": { name: "Traffic Red", number: "3020", value: "#c71712" },
        "3022": { name: "Salmon Pink", number: "3022", value: "#d9594f" },
        "3024": { name: "Luminous Red", number: "3024", value: "#fc0a1c" },
        "3026": { name: "Luminous Bright Red", number: "3026", value: "#fc1414" },
        "3027": { name: "Raspberry Red", number: "3027", value: "#b51233" },
        "3031": { name: "Orient Red", number: "3031", value: "#a61c2e" },
        "4001": { name: "Red Lilac", number: "4001", value: "#824080" },
        "4002": { name: "Red Violet", number: "4002", value: "#8f2640" },
        "4003": { name: "Heather Violet", number: "4003", value: "#c9388c" },
        "4004": { name: "Claret Violet", number: "4004", value: "#5c082b" },
        "4005": { name: "Blue Lilac", number: "4005", value: "#633d9c" },
        "4006": { name: "Traffic Purple", number: "4006", value: "#910f66" },
        "4007": { name: "Purple Violet", number: "4007", value: "#380a2e" },
        "4008": { name: "Signal Violet", number: "4008", value: "#7d1f7a" },
        "4009": { name: "Pastel Violet", number: "4009", value: "#9e7394" },
        "4010": { name: "Telemagenta", number: "4010", value: "#bf1773" },
        "5000": { name: "Violet Blue", number: "5000", value: "#17336b" },
        "5001": { name: "Green Blue", number: "5001", value: "#0a3354" },
        "5002": { name: "Ultramarine Blue", number: "5002", value: "#000f75" },
        "5003": { name: "Sapphire Blue", number: "5003", value: "#001745" },
        "5004": { name: "Black Blue", number: "5004", value: "#030d1f" },
        "5005": { name: "Signal Blue", number: "5005", value: "#002e7a" },
        "5007": { name: "Brillant Blue", number: "5007", value: "#264f87" },
        "5008": { name: "Gray Blue", number: "5008", value: "#1a2938" },
        "5009": { name: "Azure Blue", number: "5009", value: "#174570" },
        "5010": { name: "Gentian Blue", number: "5010", value: "#002b70" },
        "5011": { name: "Steel Blue", number: "5011", value: "#03142e" },
        "5012": { name: "Light Blue", number: "5012", value: "#2973b8" },
        "5013": { name: "Cobalt Blue", number: "5013", value: "#001245" },
        "5014": { name: "Pigeon Blue", number: "5014", value: "#4d6999" },
        "5015": { name: "Sky Blue", number: "5015", value: "#1761ab" },
        "5017": { name: "Traffic Blue", number: "5017", value: "#003b80" },
        "5018": { name: "Turquoise Blue", number: "5018", value: "#389482" },
        "5019": { name: "Capri Blue", number: "5019", value: "#0a4278" },
        "5020": { name: "Ocean Blue", number: "5020", value: "#053333" },
        "5021": { name: "Water Blue", number: "5021", value: "#1a7a63" },
        "5022": { name: "Night Blue", number: "5022", value: "#00084f" },
        "5023": { name: "Distant Blue", number: "5023", value: "#2e528f" },
        "5024": { name: "Pastel Blue", number: "5024", value: "#578cb5" },
        "6000": { name: "Patina Green", number: "6000", value: "#337854" },
        "6001": { name: "Emerald Green", number: "6001", value: "#266629" },
        "6002": { name: "Leaf Green", number: "6002", value: "#265721" },
        "6003": { name: "Olive Green", number: "6003", value: "#3d452e" },
        "6004": { name: "Blue Green", number: "6004", value: "#0d3b2e" },
        "6005": { name: "Moss Green", number: "6005", value: "#0a381f" },
        "6006": { name: "Grey Olive", number: "6006", value: "#292b24" },
        "6007": { name: "Bottle Green", number: "6007", value: "#1c2617" },
        "6008": { name: "Brown Green", number: "6008", value: "#21211a" },
        "6009": { name: "Fir Green", number: "6009", value: "#17291c" },
        "6010": { name: "Grass Green", number: "6010", value: "#366926" },
        "6011": { name: "Reseda Green", number: "6011", value: "#5e7d4f" },
        "6012": { name: "Black Green", number: "6012", value: "#1f2e2b" },
        "6013": { name: "Reed Green", number: "6013", value: "#75734f" },
        "6014": { name: "Yellow Olive", number: "6014", value: "#333026" },
        "6015": { name: "Black Olive", number: "6015", value: "#292b26" },
        "6016": { name: "Turquoise Green", number: "6016", value: "#0f7033" },
        "6017": { name: "Yellow Green", number: "6017", value: "#408236" },
        "6018": { name: "May Green", number: "6018", value: "#4fa833" },
        "6019": { name: "Pastel Green", number: "6019", value: "#bfe3ba" },
        "6020": { name: "Chrome Green", number: "6020", value: "#263829" },
        "6021": { name: "Pale Green", number: "6021", value: "#85a67a" },
        "6022": { name: "Olive Drab", number: "6022", value: "#2b261c" },
        "6024": { name: "Traffic Green", number: "6024", value: "#249140" },
        "6025": { name: "Fern Green", number: "6025", value: "#4a6e33" },
        "6026": { name: "Opal Green", number: "6026", value: "#0a5c33" },
        "6027": { name: "Light Green", number: "6027", value: "#7dccbd" },
        "6028": { name: "Pine Green", number: "6028", value: "#264a33" },
        "6029": { name: "Mint Green", number: "6029", value: "#127826" },
        "6032": { name: "Signal Green", number: "6032", value: "#298a40" },
        "6033": { name: "Mint Turquoise", number: "6033", value: "#428c78" },
        "6034": { name: "Pastel Turquoise", number: "6034", value: "#7dbdb5" },
        "7000": { name: "Squirrel Grey", number: "7000", value: "#738591" },
        "7001": { name: "Silver Grey", number: "7001", value: "#8794a6" },
        "7002": { name: "Olive Grey", number: "7002", value: "#7a7561" },
        "7003": { name: "Moss Grey", number: "7003", value: "#707061" },
        "7004": { name: "Signal Grey", number: "7004", value: "#9c9ca6" },
        "7005": { name: "Mouse Grey", number: "7005", value: "#616969" },
        "7006": { name: "Beige Grey", number: "7006", value: "#6b6157" },
        "7008": { name: "Khaki Grey", number: "7008", value: "#695438" },
        "7009": { name: "Green Grey", number: "7009", value: "#4d524a" },
        "7010": { name: "Tarpaulin Grey", number: "7010", value: "#4a4f4a" },
        "7011": { name: "Iron Grey", number: "7011", value: "#404a54" },
        "7012": { name: "Basalt Grey", number: "7012", value: "#4a5459" },
        "7013": { name: "Brown Grey", number: "7013", value: "#474238" },
        "7015": { name: "Slate Grey", number: "7015", value: "#3d4252" },
        "7016": { name: "Anthracite Grey", number: "7016", value: "#262e38" },
        "7021": { name: "Black Grey", number: "7021", value: "#1a2129" },
        "7022": { name: "Umbra Grey", number: "7022", value: "#3d3d3b" },
        "7023": { name: "Concrete Grey", number: "7023", value: "#7a7d75" },
        "7024": { name: "Graphite Grey", number: "7024", value: "#303845" },
        "7026": { name: "Granite Grey", number: "7026", value: "#263338" },
        "7030": { name: "Stone Grey", number: "7030", value: "#918f87" },
        "7031": { name: "Blue Grey", number: "7031", value: "#4d5c6b" },
        "7032": { name: "Pebble Grey", number: "7032", value: "#bdbaab" },
        "7033": { name: "Cement Grey", number: "7033", value: "#7a8275" },
        "7034": { name: "Yellow Grey", number: "7034", value: "#8f8770" },
        "7035": { name: "Light Grey", number: "7035", value: "#d4d9db" },
        "7036": { name: "Platinum Grey", number: "7036", value: "#9e969c" },
        "7037": { name: "Dusty Grey", number: "7037", value: "#7a7d80" },
        "7038": { name: "Agate Grey", number: "7038", value: "#babdba" },
        "7039": { name: "Quartz Grey", number: "7039", value: "#615e59" },
        "7040": { name: "Window Grey", number: "7040", value: "#9ea3b0" },
        "7042": { name: "Verkehrsgrau A", number: "7042", value: "#8f9699" },
        "7043": { name: "Verkehrsgrau B", number: "7043", value: "#404545" },
        "7044": { name: "Silk Grey", number: "7044", value: "#c2bfb8" },
        "7045": { name: "Telegrau 1", number: "7045", value: "#8f949e" },
        "7046": { name: "Telegrau 2", number: "7046", value: "#78828c" },
        "7047": { name: "Telegrau 4", number: "7047", value: "#d9d6db" },
        "8000": { name: "Green Brown", number: "8000", value: "#7d5c38" },
        "8001": { name: "Ocher Brown", number: "8001", value: "#91522e" },
        "8002": { name: "Signal Brown", number: "8002", value: "#6e3b30" },
        "8003": { name: "Clay Brown", number: "8003", value: "#733b24" },
        "8004": { name: "Copper Brown", number: "8004", value: "#85382b" },
        "8007": { name: "Fawn Brown", number: "8007", value: "#5e331f" },
        "8008": { name: "Olive Brown", number: "8008", value: "#633d24" },
        "8011": { name: "Nut Brown", number: "8011", value: "#47261c" },
        "8012": { name: "Red Brown", number: "8012", value: "#541f1f" },
        "8014": { name: "Sepia Brown", number: "8014", value: "#38261c" },
        "8015": { name: "Chestnut Brown", number: "8015", value: "#4d1f1c" },
        "8016": { name: "Mahogany Brown", number: "8016", value: "#3d1f1c" },
        "8017": { name: "Chocolate Brown", number: "8017", value: "#2e1c1c" },
        "8019": { name: "Grey Brown", number: "8019", value: "#2b2629" },
        "8022": { name: "Black Brown", number: "8022", value: "#0d080d" },
        "8023": { name: "Orange Brown", number: "8023", value: "#9c4529" },
        "8024": { name: "Beige Brown", number: "8024", value: "#6e4030" },
        "8025": { name: "Pale Brown", number: "8025", value: "#664a3d" },
        "8028": { name: "Terra Brown", number: "8028", value: "#402e21" },
        "9001": { name: "Cream", number: "9001", value: "#fffcf0" },
        "9002": { name: "Grey White", number: "9002", value: "#f0ede6" },
        "9003": { name: "Signal White", number: "9003", value: "#ffffff" },
        "9004": { name: "Signal Black", number: "9004", value: "#1c1c21" },
        "9005": { name: "Jet Black", number: "9005", value: "#03050a" },
        "9006": { name: "White Aluminium", number: "9006", value: "#a6abb5" },
        "9007": { name: "Grey Aluminium", number: "9007", value: "#7d7a78" },
        "9010": { name: "Pure White", number: "9010", value: "#faffff" },
        "9011": { name: "Graphite Black", number: "9011", value: "#0d121a" },
        "9016": { name: "Traffic White", number: "9016", value: "#fcffff" },
        "9017": { name: "Traffic Black", number: "9017", value: "#14171c" },
        "9018": { name: "Papyrus White", number: "9018", value: "#dbe3de" }
    }
}
