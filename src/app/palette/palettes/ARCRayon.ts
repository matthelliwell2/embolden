import { Palette } from "../palette.service"

export class ARCRayon implements Palette {
    name = "ARC Rayon"
    colours = {
        "10": { name: "White", number: "10", value: "#eaf5fd" },
        "15": { name: "White", number: "15", value: "#f4fcfd" },
        "20": { name: "Black", number: "20", value: "#383938" },
        "100": { name: "Vanilla Ice", number: "100", value: "#f0f0d8" },
        "103": { name: "Cashmere Blue", number: "103", value: "#abbecc" },
        "104": { name: "Medium Blue", number: "104", value: "#31678f" },
        "109": { name: "Parrot", number: "109", value: "#0ea190" },
        "110": { name: "Jade", number: "110", value: "#31867a" },
        "118": { name: "Quarry", number: "118", value: "#a0a9a4" },
        "120": { name: "Dark Grey / Blue", number: "120", value: "#383f4f" },
        "122": { name: "Dark Grey / Blue", number: "122", value: "#3b4154" },
        "123": { name: "Petrol Blue", number: "123", value: "#4a5466" },
        "126": { name: "Dark Turquoise Blue", number: "126", value: "#007385" },
        "129": { name: "Enchanted Sea", number: "129", value: "#31554e" },
        "138": { name: "Medium Green / Blue", number: "138", value: "#5da49c" },
        "142": { name: "Petrol Blue", number: "142", value: "#466888" },
        "144": { name: "Toast", number: "144", value: "#8e694a" },
        "145": { name: "Clayrust", number: "145", value: "#674d3e" },
        "146": { name: "Medium Brown", number: "146", value: "#945d3d" },
        "157": { name: "Isle Green", number: "157", value: "#008779" },
        "176": { name: "Blue / Green", number: "176", value: "#0098bd" },
        "177": { name: "Medium Turquoise Blue", number: "177", value: "#0083ae" },
        "185": { name: "Dark Green / Blue", number: "185", value: "#37726d" },
        "187": { name: "Terra Cotta", number: "187", value: "#ab3b3d" },
        "188": { name: "Terra Cotta", number: "188", value: "#af4a52" },
        "195": { name: "Light Bronze", number: "195", value: "#c09169" },
        "213": { name: "Dark Rust Red", number: "213", value: "#934240" },
        "214": { name: "Red Violet", number: "214", value: "#b75c6f" },
        "215": { name: "Medium Purple", number: "215", value: "#a74769" },
        "216": { name: "Dark Brown", number: "216", value: "#794148" },
        "217": { name: "Petrol Blue", number: "217", value: "#474767" },
        "218": { name: "Dark Blue / Green", number: "218", value: "#3a485e" },
        "219": { name: "Pale Beige", number: "219", value: "#efd32b" },
        "234": { name: "Sage Green", number: "234", value: "#a7a881" },
        "235": { name: "Medium Green / Yellow", number: "235", value: "#586047" },
        "236": { name: "Dark Salmon", number: "236", value: "#c8484d" },
        "237": { name: "Medium Green / Yellow", number: "237", value: "#817e53" },
        "238": { name: "Dark Grey / Green", number: "238", value: "#52543e" },
        "239": { name: "Olive Drab", number: "239", value: "#5d7144" },
        "240": { name: "Water Lilly", number: "240", value: "#556a50" },
        "242": { name: "Dark Jade Green", number: "242", value: "#3f5f56" },
        "243": { name: "Dark Green", number: "243", value: "#86887e" },
        "244": { name: "Trooper", number: "244", value: "#637273" },
        "245": { name: "Kahki Green", number: "245", value: "#4d5e53" },
        "246": { name: "Granite", number: "246", value: "#4b5152" },
        "247": { name: "Granite", number: "247", value: "#505351" },
        "254": { name: "Canyon Rose", number: "254", value: "#b06f5c" },
        "255": { name: "Medium Brown", number: "255", value: "#a25741" },
        "256": { name: "Brown", number: "256", value: "#a56247" },
        "257": { name: "Brown", number: "257", value: "#9f5b4b" },
        "258": { name: "Faded Rose", number: "258", value: "#bc6651" },
        "259": { name: "Medium Pink", number: "259", value: "#d45483" },
        "260": { name: "Medium Brown", number: "260", value: "#a7554b" },
        "261": { name: "Hot Pink", number: "261", value: "#d66999" },
        "263": { name: "Medium Pink", number: "263", value: "#c85485" },
        "266": { name: "Dark Salmon Pink", number: "266", value: "#ce4543" },
        "267": { name: "Aquamarine", number: "267", value: "#00b5c6" },
        "268": { name: "Aquamarine", number: "268", value: "#00b7c7" },
        "269": { name: "Light Blue / Green", number: "269", value: "#60d4da" },
        "270": { name: "Dale Blue", number: "270", value: "#518ca4" },
        "271": { name: "Dark Blue / Green", number: "271", value: "#0097a8" },
        "272": { name: "Limoges Blue", number: "272", value: "#6680a0" },
        "274": { name: "Pink", number: "274", value: "#e182a3" },
        "285": { name: "Banana Crepe", number: "285", value: "#e9daa2" },
        "286": { name: "Yellow / Gold", number: "286", value: "#edb846" },
        "287": { name: "Straw Yellow", number: "287", value: "#e7dea0" },
        "288": { name: "Tusk", number: "288", value: "#f6e8ae" },
        "289": { name: "Snapdragon", number: "289", value: "#fdda6d" },
        "290": { name: "Buff Orange", number: "290", value: "#feb871" },
        "301": { name: "Dusted Peri", number: "301", value: "#6f6f96" },
        "303": { name: "Dark Grey / Green", number: "303", value: "#484f41" },
        "305": { name: "Slate Blue", number: "305", value: "#646a9a" },
        "306": { name: "Storm Blue", number: "306", value: "#545185" },
        "307": { name: "Green Forest", number: "307", value: "#1e705f" },
        "309": { name: "Velvet Morning", number: "309", value: "#62567d" },
        "311": { name: "Medium Green", number: "311", value: "#92b76e" },
        "312": { name: "Medium Green", number: "312", value: "#91b772" },
        "315": { name: "Medium Green", number: "315", value: "#86bc7a" },
        "317": { name: "Medium Green", number: "317", value: "#009053" },
        "319": { name: "Sea Blue", number: "319", value: "#4e978e" },
        "320": { name: "Holly Green", number: "320", value: "#629459" },
        "323": { name: "Valerian", number: "323", value: "#ab758c" },
        "324": { name: "Enchanted Sea", number: "324", value: "#38584e" },
        "325": { name: "Light Purple", number: "325", value: "#ab8184" },
        "327": { name: "Salmon", number: "327", value: "#e9b0b3" },
        "330": { name: "Sepia", number: "330", value: "#693c3e" },
        "331": { name: "Intense Maroon", number: "331", value: "#603b44" },
        "333": { name: "Dark Brown", number: "333", value: "#854745" },
        "334": { name: "Medium Pink", number: "334", value: "#9c4e5e" },
        "335": { name: "Terra Cotta", number: "335", value: "#a14756" },
        "338": { name: "New Gold", number: "338", value: "#fbd69e" },
        "343": { name: "Medium Brown", number: "343", value: "#946c43" },
        "345": { name: "Medium Brown", number: "345", value: "#745344" },
        "352": { name: "Peach Whip", number: "352", value: "#e6c2b2" },
        "354": { name: "Dark Brown", number: "354", value: "#594941" },
        "355": { name: "Medium Green / Yellow", number: "355", value: "#806f5c" },
        "362": { name: "Olive", number: "362", value: "#759186" },
        "363": { name: "Cloudy Jade", number: "363", value: "#72877b" },
        "364": { name: "Kahki Green", number: "364", value: "#4d5e53" },
        "366": { name: "Grey / Blue", number: "366", value: "#444f7d" },
        "367": { name: "Veronica Violet", number: "367", value: "#725b8d" },
        "368": { name: "Light Blue", number: "368", value: "#d5efdc" },
        "376": { name: "Light Pink", number: "376", value: "#e2c5d1" },
        "380": { name: "Canal Blue", number: "380", value: "#a3bebe" },
        "381": { name: "Grey", number: "381", value: "#546673" },
        "382": { name: "Enchanted Sea", number: "382", value: "#37545c" },
        "384": { name: "Medium Orange / Brown", number: "384", value: "#c1833e" },
        "385": { name: "Pale Green / Blue", number: "385", value: "#5a8384" },
        "386": { name: "Medium Green / Blue", number: "386", value: "#426a73" },
        "387": { name: "Sunburst", number: "387", value: "#c38646" },
        "388": { name: "Persian Violet", number: "388", value: "#918bb0" },
        "389": { name: "Medium Blue", number: "389", value: "#55668d" },
        "391": { name: "Ash", number: "391", value: "#414b70" },
        "394": { name: "Almondine", number: "394", value: "#a69278" },
        "395": { name: "Medium Brown", number: "395", value: "#946a4b" },
        "396": { name: "Medium Yellow", number: "396", value: "#d5ac2d" },
        "399": { name: "Dark Brown", number: "399", value: "#844757" },
        "401": { name: "Oak Buff", number: "401", value: "#c4964e" },
        "402": { name: "Blue", number: "402", value: "#5690af" },
        "403": { name: "Tan", number: "403", value: "#d4ae7b" },
        "404": { name: "Tan", number: "404", value: "#d0ac79" },
        "405": { name: "New Wheat", number: "405", value: "#dfb578" },
        "412": { name: "Beige", number: "412", value: "#ae9573" },
        "416": { name: "Sepia", number: "416", value: "#6c3f46" },
        "419": { name: "Star Gold", number: "419", value: "#fddd63" },
        "432": { name: "Orange", number: "432", value: "#fda339" },
        "436": { name: "Charcoal", number: "436", value: "#7b776f" },
        "453": { name: "Medium Blue", number: "453", value: "#7093a4" },
        "466": { name: "Chamois", number: "466", value: "#edb15c" },
        "507": { name: "Regal Orchid", number: "507", value: "#a2819e" },
        "512": { name: "Medium Brown", number: "512", value: "#97543f" },
        "519": { name: "Orange", number: "519", value: "#e66540" },
        "520": { name: "Orange", number: "520", value: "#f8953a" },
        "521": { name: "Golden Poppy", number: "521", value: "#ff8c45" },
        "522": { name: "Cadmium Orange", number: "522", value: "#f39463" },
        "523": { name: "Autumn Sunset", number: "523", value: "#f2884b" },
        "524": { name: "Orange Glow", number: "524", value: "#ed744a" },
        "534": { name: "Alpine Teal", number: "534", value: "#00725b" },
        "535": { name: "Green Forest", number: "535", value: "#1f7355" },
        "536": { name: "Tropical Green", number: "536", value: "#316d48" },
        "537": { name: "Green Dust", number: "537", value: "#bfe790" },
        "538": { name: "Dark Green", number: "538", value: "#468345" },
        "539": { name: "Dull Blue", number: "539", value: "#5f8696" },
        "540": { name: "Slate Grey", number: "540", value: "#5c7d90" },
        "541": { name: "Dark Grey / Blue", number: "541", value: "#4a5d6a" },
        "542": { name: "Dark Grey / Blue", number: "542", value: "#4f5b5f" },
        "543": { name: "Aqua Lake", number: "543", value: "#9dc9d2" },
        "544": { name: "Dark Grey / Blue", number: "544", value: "#496179" },
        "550": { name: "Mellow Mauve", number: "550", value: "#9f616e" },
        "555": { name: "Pale Peach", number: "555", value: "#d8bd9a" },
        "557": { name: "Dark Green", number: "557", value: "#3a7a4f" },
        "560": { name: "Dark Green", number: "560", value: "#427b46" },
        "563": { name: "Dark Green", number: "563", value: "#3e6c62" },
        "566": { name: "Mustard", number: "566", value: "#f3f39a" },
        "568": { name: "Daffodil", number: "568", value: "#f5eb5b" },
        "571": { name: "Terra Cotta", number: "571", value: "#ad4b48" },
        "572": { name: "Dark Red / Orange", number: "572", value: "#a45148" },
        "575": { name: "Lilac Sachet", number: "575", value: "#ebb5c2" },
        "579": { name: "Medium Yellow", number: "579", value: "#d2ac2d" },
        "580": { name: "Gray Violet", number: "580", value: "#c5cabf" },
        "581": { name: "Pale Grey", number: "581", value: "#c2c8bd" },
        "582": { name: "Traditional Gray", number: "582", value: "#a9b3ac" },
        "585": { name: "Skylight", number: "585", value: "#bbbbad" },
        "586": { name: "Nostalgia Rose", number: "586", value: "#a87077" },
        "587": { name: "Highrise", number: "587", value: "#b3b6ac" },
        "588": { name: "Aqua Gray", number: "588", value: "#a5aca8" },
        "589": { name: "Lead", number: "589", value: "#7d8787" },
        "590": { name: "Dark Salmon Pink", number: "590", value: "#db5344" },
        "591": { name: "Spanish Olive", number: "591", value: "#908b75" },
        "592": { name: "Pale / Grey", number: "592", value: "#949485" },
        "593": { name: "Dark Grey", number: "593", value: "#666256" },
        "599": { name: "Aspen White", number: "599", value: "#f5e0c7" },
        "600": { name: "Twill", number: "600", value: "#b1a082" },
        "601": { name: "Evening Sand", number: "601", value: "#e7bea5" },
        "605": { name: "Peach", number: "605", value: "#edb89c" },
        "606": { name: "Flamingo", number: "606", value: "#f5ab8a" },
        "607": { name: "Peach Pink", number: "607", value: "#f29c7d" },
        "608": { name: "Medium Turquoise Blue", number: "608", value: "#008ead" },
        "611": { name: "Pink Mist", number: "611", value: "#f1c7c4" },
        "613": { name: "Dark Brown", number: "613", value: "#57473d" },
        "614": { name: "Light Orange", number: "614", value: "#eb8598" },
        "617": { name: "Moss", number: "617", value: "#98af90" },
        "618": { name: "Eucalyptus", number: "618", value: "#b2b28f" },
        "619": { name: "Gravel", number: "619", value: "#bac091" },
        "620": { name: "Tawny Birch", number: "620", value: "#af8a6c" },
        "623": { name: "Light Brown", number: "623", value: "#cdb584" },
        "624": { name: "Wicker", number: "624", value: "#ad7844" },
        "625": { name: "Mustard Yellow", number: "625", value: "#e4bc40" },
        "626": { name: "Pale Orange", number: "626", value: "#b8a488" },
        "627": { name: "Pale Peach", number: "627", value: "#e9d7ae" },
        "628": { name: "Beige", number: "628", value: "#b59872" },
        "630": { name: "Medium Green", number: "630", value: "#5cc399" },
        "632": { name: "Medium Orange", number: "632", value: "#e97966" },
        "634": { name: "Pale Green", number: "634", value: "#60cb83" },
        "635": { name: "Mint", number: "635", value: "#b3e8cf" },
        "636": { name: "Green Ash", number: "636", value: "#99dea5" },
        "637": { name: "Peppermint", number: "637", value: "#3bc4a0" },
        "638": { name: "Medium Green / Blue", number: "638", value: "#00b382" },
        "639": { name: "Lilac Pink", number: "639", value: "#cca3ba" },
        "640": { name: "Violet Toule", number: "640", value: "#cd93b0" },
        "641": { name: "Purple Heather", number: "641", value: "#c6b8ca" },
        "642": { name: "Light Lilac", number: "642", value: "#a08bac" },
        "644": { name: "Smoky Grape", number: "644", value: "#c286a8" },
        "647": { name: "Purple Haze", number: "647", value: "#8e6893" },
        "650": { name: "Dark Grey / Green", number: "650", value: "#475243" },
        "652": { name: "Steel", number: "652", value: "#5e4f75" },
        "655": { name: "Dark Green / Grey", number: "655", value: "#585237" },
        "659": { name: "Light Pink", number: "659", value: "#e7bdce" },
        "660": { name: "Medium Blue / Grey", number: "660", value: "#859ab4" },
        "661": { name: "Popcorn", number: "661", value: "#fbe292" },
        "662": { name: "Celery", number: "662", value: "#f5f3c3" },
        "663": { name: "Cornsilk", number: "663", value: "#ffca57" },
        "664": { name: "Medium Orange", number: "664", value: "#ffb933" },
        "665": { name: "Transparent Yellow", number: "665", value: "#f5ebbd" },
        "667": { name: "Light Yellow / Orange", number: "667", value: "#e5dfab" },
        "670": { name: "Candy Pink", number: "670", value: "#f4b2ba" },
        "671": { name: "Aqua Green", number: "671", value: "#5bbca6" },
        "672": { name: "Silver Moon", number: "672", value: "#938e8d" },
        "673": { name: "Dark Blue / Green", number: "673", value: "#3b6267" },
        "674": { name: "Gray", number: "674", value: "#b5b29b" },
        "675": { name: "Metal", number: "675", value: "#656e6b" },
        "676": { name: "Peppermint", number: "676", value: "#00a986" },
        "677": { name: "Steel Gray", number: "677", value: "#6a6d6b" },
        "678": { name: "Platinum", number: "678", value: "#898d8c" },
        "679": { name: "Tropical Wave", number: "679", value: "#83dbbe" },
        "680": { name: "Aquamarine", number: "680", value: "#00c6d0" },
        "681": { name: "Seafrost", number: "681", value: "#8aded0" },
        "682": { name: "Pale Blue", number: "682", value: "#97bac7" },
        "683": { name: "Hemlock", number: "683", value: "#9cc79b" },
        "684": { name: "Pale Aqua Green", number: "684", value: "#93cacc" },
        "687": { name: "Light Aqua", number: "687", value: "#479d98" },
        "688": { name: "Light Green / Blue", number: "688", value: "#007e7e" },
        "689": { name: "Dark Blue / Green", number: "689", value: "#2f626a" },
        "690": { name: "Medium Green / Yellow", number: "690", value: "#85ab55" },
        "691": { name: "Tender Teal", number: "691", value: "#309a94" },
        "692": { name: "Lt. Olive", number: "692", value: "#6e7b4c" },
        "693": { name: "Peppermint", number: "693", value: "#2cc8b9" },
        "695": { name: "Kahki Green", number: "695", value: "#446652" },
        "696": { name: "Milky Blue", number: "696", value: "#74b4c1" },
        "697": { name: "Medium Turquoise Blue", number: "697", value: "#0080ac" },
        "705": { name: "Light Pink", number: "705", value: "#f4d1d3" },
        "706": { name: "Fawn", number: "706", value: "#b3968b" },
        "707": { name: "Crystal Pink", number: "707", value: "#f6d7c7" },
        "708": { name: "Salmon", number: "708", value: "#f09c95" },
        "710": { name: "Light Pink", number: "710", value: "#f3d9da" },
        "713": { name: "Light Orange", number: "713", value: "#eb8595" },
        "722": { name: "Moss Green", number: "722", value: "#5c7846" },
        "732": { name: "Light Orange", number: "732", value: "#ed918e" },
        "737": { name: "Bluestone", number: "737", value: "#00b293" },
        "742": { name: "Chalk", number: "742", value: "#ecd3ca" },
        "745": { name: "Dark Purple", number: "745", value: "#70406a" },
        "753": { name: "Medium Green / Yellow", number: "753", value: "#8a814c" },
        "754": { name: "Pale Green / Yellow", number: "754", value: "#b09d5b" },
        "755": { name: "Dark Green / Grey", number: "755", value: "#555137" },
        "763": { name: "Cornsilk", number: "763", value: "#ffc855" },
        "764": { name: "Golden Lights", number: "764", value: "#ffb625" },
        "766": { name: "Sunburst", number: "766", value: "#d68144" },
        "776": { name: "Jade", number: "776", value: "#007d60" },
        "783": { name: "Dull Blue", number: "783", value: "#628b9a" },
        "784": { name: "Medium Blue", number: "784", value: "#3a7a9f" },
        "785": { name: "Delphinium Blue", number: "785", value: "#709bae" },
        "790": { name: "Nile", number: "790", value: "#b5c581" },
        "791": { name: "Nile", number: "791", value: "#afc177" },
        "793": { name: "Medium Green / Yellow", number: "793", value: "#8e9d4e" },
        "805": { name: "Slate Blue", number: "805", value: "#64779c" },
        "806": { name: "Slate Blue", number: "806", value: "#3e5f95" },
        "807": { name: "Dark Blue", number: "807", value: "#00659c" },
        "808": { name: "Medium Purple", number: "808", value: "#365e94" },
        "809": { name: "Imperial Blue", number: "809", value: "#2c5c84" },
        "815": { name: "Medium Grey", number: "815", value: "#afb7c9" },
        "816": { name: "Dark Lilac", number: "816", value: "#8682ac" },
        "817": { name: "Dark Lilac", number: "817", value: "#857da5" },
        "820": { name: "Pale Blue", number: "820", value: "#c4d4c9" },
        "821": { name: "Light Blue Green", number: "821", value: "#cfdbc9" },
        "822": { name: "Aqualine", number: "822", value: "#aac3c9" },
        "828": { name: "Glass Green", number: "828", value: "#e8e6c9" },
        "830": { name: "Pale Gray Green", number: "830", value: "#cec2a6" },
        "837": { name: "Penguin Grey", number: "837", value: "#897e8c" },
        "856": { name: "Vanilla", number: "856", value: "#f5ecca" },
        "857": { name: "Cream", number: "857", value: "#e9debd" },
        "877": { name: "Medium Brown", number: "877", value: "#7d6751" },
        "878": { name: "Medium Brown", number: "878", value: "#7a5c45" },
        "879": { name: "Black Chrome", number: "879", value: "#47403d" },
        "880": { name: "Black Chrome", number: "880", value: "#493d3a" },
        "882": { name: "Amber", number: "882", value: "#e8aa43" },
        "920": { name: "Dark Navy", number: "920", value: "#424549" },
        "921": { name: "Dark Navy", number: "921", value: "#42464d" },
        "925": { name: "Dark Salmon Pink", number: "925", value: "#ce403a" }
    }
}
