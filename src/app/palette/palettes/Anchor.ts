import { Palette } from "../palette.service"

export class Anchor implements Palette {
    name = "Anchor"
    colours = {
        "1": { name: "Snow White", number: "1", value: "#ffffff" },
        "2": { name: "White", number: "2", value: "#ffffff" },
        "6": { name: "Salmon Very Light", number: "6", value: "#ffc4b8" },
        "8": { name: "Salmon Light", number: "8", value: "#ffc68c" },
        "9": { name: "Salmon Medium Light", number: "9", value: "#ff9d90" },
        "10": { name: "Salmon Medium", number: "10", value: "#ff8087" },
        "11": { name: "Salmon Medium Dark", number: "11", value: "#ed455a" },
        "13": { name: "Salmon Dark", number: "13", value: "#db1855" },
        "22": { name: "Burgundy Very Dark", number: "22", value: "#995c30" },
        "23": { name: "Carnation Ultra Light", number: "23", value: "#ffeaeb" },
        "24": { name: "Carnation Very Light", number: "24", value: "#ffb1ae" },
        "25": { name: "Carnation Light", number: "25", value: "#ffd3d4" },
        "26": { name: "Carnation Medium Light", number: "26", value: "#ff8cbf" },
        "27": { name: "Carnation Medium", number: "27", value: "#ffc2bf" },
        "28": { name: "Carnation Medium Dark", number: "28", value: "#cc3377" },
        "29": { name: "Carnation Dark", number: "29", value: "#e60066" },
        "31": { name: "Blush Light", number: "31", value: "#fed4db" },
        "33": { name: "Blush Medium", number: "33", value: "#ff806d" },
        "35": { name: "Blush Dark", number: "35", value: "#ff555b" },
        "36": { name: "Blossem Pink Light", number: "36", value: "#ff9d96" },
        "38": { name: "Blossem Pink Dark", number: "38", value: "#db244f" },
        "40": { name: "Carmine Rose Light", number: "40", value: "#ff6d73" },
        "41": { name: "Carmine Rose Medium Light", number: "41", value: "#f3959d" },
        "42": { name: "Carmine Rose Medium", number: "42", value: "#d62b5b" },
        "43": { name: "Carmine Rose Medium Dark", number: "43", value: "#a6005b" },
        "45": { name: "Carmine Rose Dark", number: "45", value: "#a20058" },
        "46": { name: "Crimson Red", number: "46", value: "#d52756" },
        "47": { name: "Carmine Red", number: "47", value: "#e71261" },
        "48": { name: "China Rose Very Light", number: "48", value: "#ffeaeb" },
        "49": { name: "China Rose Light", number: "49", value: "#ffd5d8" },
        "50": { name: "China Rose Medium", number: "50", value: "#ffccd0" },
        "52": { name: "China Rose Medium Dark", number: "52", value: "#e96d73" },
        "54": { name: "Rose Dark China", number: "54", value: "#ff6d73" },
        "55": { name: "Beauty Rose Light", number: "55", value: "#ffbdca" },
        "57": { name: "Beauty Rose Medium", number: "57", value: "#de3969" },
        "59": { name: "China Rose", number: "59", value: "#c94f5b" },
        "60": { name: "Magenta Light", number: "60", value: "#fa9790" },
        "62": { name: "Magenta Medium", number: "62", value: "#ff738c" },
        "63": { name: "Magenta Dark", number: "63", value: "#e7547a" },
        "65": { name: "Rose Very Dark Antique", number: "65", value: "#c94f5b" },
        "66": { name: "Raspberry Light", number: "66", value: "#fa9790" },
        "68": { name: "Raspberry Medium Light", number: "68", value: "#cb4e61" },
        "72": { name: "Raspberry Very Dark", number: "72", value: "#e60066" },
        "73": { name: "Antique Rose Very Light", number: "73", value: "#ffe9e9" },
        "74": { name: "Antique Rose Light", number: "74", value: "#ffd6d1" },
        "75": { name: "Antique Rose Medium Light", number: "75", value: "#ff9a94" },
        "76": { name: "Antique Rose Medium", number: "76", value: "#cb4e61" },
        "77": { name: "Antique Rose Medium Dark", number: "77", value: "#cb4e61" },
        "78": { name: "Antique Rose Dark", number: "78", value: "#ab165f" },
        "85": { name: "Orchid Light", number: "85", value: "#ffd6e5" },
        "86": { name: "Orchid Medium Light", number: "86", value: "#f798b6" },
        "87": { name: "Orchid Medium", number: "87", value: "#e74f86" },
        "88": { name: "Orchid Medium Dark", number: "88", value: "#db3779" },
        "89": { name: "Orchid Dark", number: "89", value: "#ab165f" },
        "90": { name: "Plum Light", number: "90", value: "#cca3cc" },
        "92": { name: "Plum Medium", number: "92", value: "#a06492" },
        "94": { name: "Plum Dark", number: "94", value: "#ab165f" },
        "95": { name: "Violet Very Light", number: "95", value: "#ffd6e5" },
        "96": { name: "Violet Light", number: "96", value: "#f798b6" },
        "97": { name: "Violet Medium Light", number: "97", value: "#f3cee1" },
        "98": { name: "Violet Medium", number: "98", value: "#a06492" },
        "99": { name: "Violet", number: "99", value: "#925582" },
        "100": { name: "Violet Medium Dark", number: "100", value: "#3d0067" },
        "101": { name: "Violet Dark", number: "101", value: "#6d1261" },
        "102": { name: "Violet Very Dark", number: "102", value: "#6d1261" },
        "103": { name: "Very Light Plum", number: "103", value: "#f3dae4" },
        "108": { name: "Lavender Light", number: "108", value: "#eccfe1" },
        "109": { name: "Lavender Medium Light", number: "109", value: "#ce94ba" },
        "110": { name: "Lavender Medium", number: "110", value: "#945b80" },
        "117": { name: "Thistle Light", number: "117", value: "#91b4c5" },
        "118": { name: "Thistle Medium", number: "118", value: "#a279a4" },
        "119": { name: "Thistle Dark", number: "119", value: "#7f5482" },
        "120": { name: "Bleuberry Light", number: "120", value: "#e6ece8" },
        "121": { name: "Bleuberry Medium Light", number: "121", value: "#bbd0da" },
        "122": { name: "Medium Bleuberry", number: "122", value: "#7759b3" },
        "123": { name: "Bleuberry Dark", number: "123", value: "#47375d" },
        "127": { name: "Indigo", number: "127", value: "#000049" },
        "128": { name: "Cobalt Bleu Light", number: "128", value: "#f7f6f8" },
        "129": { name: "Cobalt Bleu", number: "129", value: "#cae2e5" },
        "130": { name: "Cobalt Bleu Medium Light", number: "130", value: "#bec1cd" },
        "131": { name: "Cobalt Bleu Medium", number: "131", value: "#67738d" },
        "132": { name: "Cobalt Bleu Medium Dark", number: "132", value: "#1e4263" },
        "133": { name: "Cobalt Bleu Dark", number: "133", value: "#1e3a5f" },
        "134": { name: "Cobalt Bleu Very Dark", number: "134", value: "#1e3655" },
        "136": { name: "Wedgewood Light", number: "136", value: "#849cb6" },
        "137": { name: "Wedgewood Medium", number: "137", value: "#67738d" },
        "139": { name: "Wedgewood Dark", number: "139", value: "#1e4263" },
        "140": { name: "Copen Bleu Light", number: "140", value: "#9eb0ce" },
        "142": { name: "Copen Bleu Medium", number: "142", value: "#67738d" },
        "143": { name: "Copen Bleu Dark", number: "143", value: "#1e4263" },
        "144": { name: "Delft Bleu Very Light", number: "144", value: "#e9eee9" },
        "145": { name: "Light Delft Bleu", number: "145", value: "#849cb6" },
        "146": { name: "Delft Bleu", number: "146", value: "#67738d" },
        "147": { name: "Delft Bleu Medium Light", number: "147", value: "#1e4263" },
        "148": { name: "Delft Bleu Medium", number: "148", value: "#004f61" },
        "149": { name: "Delft Bleu Medium Dark", number: "149", value: "#244967" },
        "150": { name: "Delft Bleu Dark", number: "150", value: "#244967" },
        "152": { name: "Delft Bleu Very Dark", number: "152", value: "#000031" },
        "158": { name: "Sapphire Very Light", number: "158", value: "#f0f7ef" },
        "160": { name: "Sapphire Medium Light", number: "160", value: "#d5e7e8" },
        "161": { name: "Sapphire Medium", number: "161", value: "#afc3cd" },
        "162": { name: "Sapphire Medium Dark", number: "162", value: "#107f87" },
        "164": { name: "Sapphire Dark", number: "164", value: "#0066b3" },
        "167": { name: "Surf Bleu Very Light", number: "167", value: "#18656f" },
        "168": { name: "Surf Bleu Light", number: "168", value: "#80a7a0" },
        "169": { name: "Surf Bleu Medium", number: "169", value: "#1e8285" },
        "170": { name: "Surf Bleu Dark", number: "170", value: "#188086" },
        "175": { name: "Ocean Bleu Light", number: "175", value: "#bbd0da" },
        "176": { name: "Ocean Bleu", number: "176", value: "#938ba4" },
        "177": { name: "Ocean Bleu Medium", number: "177", value: "#8060bf" },
        "178": { name: "Ocean Bleu Dark", number: "178", value: "#47375d" },
        "185": { name: "Sea Green Light", number: "185", value: "#d0e0d2" },
        "186": { name: "Sea Green Medium Light", number: "186", value: "#abceb1" },
        "187": { name: "Sea Green Medium", number: "187", value: "#00a082" },
        "188": { name: "Sea Green Medium Dark", number: "188", value: "#53a682" },
        "189": { name: "Sea Green Dark", number: "189", value: "#0e8c56" },
        "203": { name: "Mint Green Light", number: "203", value: "#aad5a4" },
        "204": { name: "Mint Green Medium", number: "204", value: "#99bc95" },
        "205": { name: "Mint Green Dark", number: "205", value: "#318061" },
        "206": { name: "Spruce Light", number: "206", value: "#d6e6cc" },
        "208": { name: "Spruce Medium Light", number: "208", value: "#b6d4b4" },
        "209": { name: "Spruce", number: "209", value: "#739e73" },
        "210": { name: "Spruce Medium", number: "210", value: "#618661" },
        "212": { name: "Spruce Dark", number: "212", value: "#3b604c" },
        "213": { name: "Juniper Very Light", number: "213", value: "#ceddc1" },
        "214": { name: "Juniper Light", number: "214", value: "#b5cea2" },
        "215": { name: "Juniper Medium Light", number: "215", value: "#8a9978" },
        "216": { name: "Juniper Medium", number: "216", value: "#618661" },
        "217": { name: "Juniper Medium Dark", number: "217", value: "#5f705b" },
        "218": { name: "Juniper Dark", number: "218", value: "#4f564c" },
        "225": { name: "Emerald Light", number: "225", value: "#4f7942" },
        "226": { name: "Emerald Medium Light", number: "226", value: "#4f7942" },
        "227": { name: "Emerald Medium", number: "227", value: "#4f6c45" },
        "228": { name: "Emerald Medium Dark", number: "228", value: "#00602f" },
        "229": { name: "Emerald Dark", number: "229", value: "#30745b" },
        "231": { name: "Rose Grey Light", number: "231", value: "#ebcfb9" },
        "232": { name: "Rose Grey Medium", number: "232", value: "#d2b9af" },
        "233": { name: "Rose Grey", number: "233", value: "#b3978f" },
        "234": { name: "Charcoal Grey Light", number: "234", value: "#e8e8e5" },
        "235": { name: "Charcoal Grey Medium", number: "235", value: "#a78b88" },
        "236": { name: "Charcoal Grey", number: "236", value: "#514c53" },
        "238": { name: "Medium Spring Dark Grey", number: "238", value: "#79904c" },
        "239": { name: "Spring Grey Dark", number: "239", value: "#4f7942" },
        "240": { name: "Grass Green Light", number: "240", value: "#ced5b0" },
        "241": { name: "Grass Green", number: "241", value: "#a1c47d" },
        "242": { name: "Grass Green Medium Light", number: "242", value: "#97b76e" },
        "243": { name: "Grass Green Medium", number: "243", value: "#86916e" },
        "244": { name: "Grass Green Medium Dark", number: "244", value: "#536149" },
        "245": { name: "Grass Green Dark", number: "245", value: "#536149" },
        "246": { name: "Grass Green Very Dark", number: "246", value: "#3a5241" },
        "253": { name: "Parrot Green Very Light", number: "253", value: "#f0ffc8" },
        "254": { name: "Parrot Green Light", number: "254", value: "#eeffb6" },
        "255": { name: "Parrot Green Medium Light", number: "255", value: "#b9c866" },
        "256": { name: "Parrot Green Medium", number: "256", value: "#8fa359" },
        "257": { name: "Parrot Green Medium Dark", number: "257", value: "#627739" },
        "258": { name: "Parrot Green Dark", number: "258", value: "#4e5f39" },
        "259": { name: "Loden Green Very Light", number: "259", value: "#e7f9cb" },
        "260": { name: "Loden Green Light", number: "260", value: "#a1a787" },
        "261": { name: "Loden Green Medium Light", number: "261", value: "#bbb394" },
        "262": { name: "Loden Green Medium", number: "262", value: "#898d72" },
        "263": { name: "Loden Green Dark", number: "263", value: "#605f54" },
        "264": { name: "Avocado Very Light", number: "264", value: "#eaf9c2" },
        "265": { name: "Avocado Light", number: "265", value: "#e1f9be" },
        "266": { name: "Light Avocado Medium", number: "266", value: "#b0bb8c" },
        "267": { name: "Avocado Medium", number: "267", value: "#74725c" },
        "268": { name: "Avocado Medium Dark", number: "268", value: "#495637" },
        "269": { name: "Avocado Dark", number: "269", value: "#454531" },
        "271": { name: "Soft Carnation", number: "271", value: "#f8f7dd" },
        "273": { name: "Stone Grey Dark", number: "273", value: "#717171" },
        "274": { name: "Bleu Mist Light", number: "274", value: "#e1e0d8" },
        "275": { name: "Citrus Ultra Light", number: "275", value: "#f6eadb" },
        "276": { name: "Pearl", number: "276", value: "#efd6bc" },
        "277": { name: "Desert Very Dark", number: "277", value: "#885f12" },
        "278": { name: "Olive Green Light", number: "278", value: "#cef407" },
        "279": { name: "Olive Green Medium Light", number: "279", value: "#bac405" },
        "280": { name: "Olive Green Medium", number: "280", value: "#9e9e07" },
        "281": { name: "Olive Green Dark", number: "281", value: "#707014" },
        "288": { name: "Canary Yellow Light", number: "288", value: "#ffffbe" },
        "289": { name: "Canary Yellow Medium Light", number: "289", value: "#ffe76d" },
        "290": { name: "Canary Yellow Medium", number: "290", value: "#ffb000" },
        "291": { name: "Canary Yellow Dark", number: "291", value: "#ffb000" },
        "292": { name: "Jonquil Very Light", number: "292", value: "#ffffdc" },
        "293": { name: "Jonquil Light", number: "293", value: "#ffeba8" },
        "295": { name: "Jonquil Medium Light", number: "295", value: "#ffe080" },
        "297": { name: "Jonquil Medium", number: "297", value: "#ffc243" },
        "298": { name: "Jonquil Dark", number: "298", value: "#ff9200" },
        "300": { name: "Citrus Light", number: "300", value: "#fff0c5" },
        "301": { name: "Citrus", number: "301", value: "#ffefaa" },
        "302": { name: "Citrus Medium Light", number: "302", value: "#ffe692" },
        "303": { name: "Citrus Medium", number: "303", value: "#ffb755" },
        "304": { name: "Citrus Dark", number: "304", value: "#ff8e04" },
        "305": { name: "Topaz Light", number: "305", value: "#ffc87c" },
        "306": { name: "Topaz Medium Light", number: "306", value: "#fff280" },
        "307": { name: "Topaz Medium", number: "307", value: "#cc7742" },
        "308": { name: "Topaz Medium Dark", number: "308", value: "#b56b38" },
        "309": { name: "Topaz Dark", number: "309", value: "#b5622e" },
        "310": { name: "Topaz Very Dark", number: "310", value: "#b26746" },
        "311": { name: "Tangerine Very Light", number: "311", value: "#ffcc80" },
        "313": { name: "Tangerine Light", number: "313", value: "#ffb569" },
        "314": { name: "Tangerine Medium Light", number: "314", value: "#ff8e04" },
        "316": { name: "Tangerine Dark", number: "316", value: "#ff6a00" },
        "323": { name: "Apricot Light", number: "323", value: "#ff926d" },
        "326": { name: "Apricot Dark", number: "326", value: "#c8242b" },
        "328": { name: "Melon Light", number: "328", value: "#ffaca2" },
        "329": { name: "Melon Medium", number: "329", value: "#ff7b67" },
        "330": { name: "Melon Dark Medium", number: "330", value: "#ff5b00" },
        "332": { name: "Blaze Light", number: "332", value: "#f44900" },
        "333": { name: "Blaze Medium Light", number: "333", value: "#ce2b00" },
        "334": { name: "Blaze Medium", number: "334", value: "#ff0000" },
        "335": { name: "Blaze Dark", number: "335", value: "#ff0000" },
        "336": { name: "Terra Cotta Light", number: "336", value: "#ffaca2" },
        "337": { name: "Terra Cotta Medium Light", number: "337", value: "#ed7a64" },
        "338": { name: "Terra Cotta", number: "338", value: "#ed7a64" },
        "339": { name: "Terra Cotta Medium", number: "339", value: "#c55e58" },
        "340": { name: "Terra Cotta Medium Dark", number: "340", value: "#b44b52" },
        "341": { name: "Terra Cotta Dark", number: "341", value: "#a8444c" },
        "342": { name: "Lilac Light", number: "342", value: "#f3dae4" },
        "343": { name: "Slate Bleu", number: "343", value: "#c2d1ce" },
        "347": { name: "Bark Light", number: "347", value: "#c2654c" },
        "349": { name: "Bark Medium", number: "349", value: "#d16654" },
        "351": { name: "Bark Medium Dark", number: "351", value: "#9d3c27" },
        "352": { name: "Bark Dark", number: "352", value: "#8f3926" },
        "355": { name: "Mocha Medium", number: "355", value: "#9e4312" },
        "357": { name: "Mocha Dark", number: "357", value: "#975414" },
        "358": { name: "Coffee", number: "358", value: "#975414" },
        "359": { name: "Coffee Medium", number: "359", value: "#7b4714" },
        "360": { name: "Coffee Dark", number: "360", value: "#763713" },
        "361": { name: "Nutmeg Light", number: "361", value: "#f4c38b" },
        "362": { name: "Nutmeg Medium Light", number: "362", value: "#eeab79" },
        "373": { name: "Dessert Medium", number: "373", value: "#bf9d69" },
        "374": { name: "Dessert Medium Dark", number: "374", value: "#8c5b2b" },
        "375": { name: "Dessert Dark", number: "375", value: "#995c30" },
        "376": { name: "Fawn Light", number: "376", value: "#d9ae82" },
        "378": { name: "Fawn Medium", number: "378", value: "#a6815b" },
        "379": { name: "Fawn Dark", number: "379", value: "#80551e" },
        "380": { name: "Fudge", number: "380", value: "#5e381b" },
        "381": { name: "Fudge Medium", number: "381", value: "#632710" },
        "382": { name: "Fudge Dark", number: "382", value: "#532510" },
        "386": { name: "Citrus Very Light", number: "386", value: "#fffacc" },
        "387": { name: "Ecru", number: "387", value: "#ffecbf" },
        "388": { name: "Ecru Medium", number: "388", value: "#dbc2a4" },
        "390": { name: "Linen Light", number: "390", value: "#f2eadb" },
        "391": { name: "Linen", number: "391", value: "#efdbbe" },
        "392": { name: "Linen Medium", number: "392", value: "#e7cfb2" },
        "393": { name: "Linen Dark", number: "393", value: "#8c756d" },
        "397": { name: "Grey Light", number: "397", value: "#d2d0cd" },
        "398": { name: "Grey", number: "398", value: "#ddddda" },
        "399": { name: "Grey Medium Light", number: "399", value: "#c5c6be" },
        "400": { name: "Grey Medium", number: "400", value: "#a78b88" },
        "401": { name: "Grey Dark", number: "401", value: "#555559" },
        "403": { name: "Black", number: "403", value: "#000000" },
        "410": { name: "Electric Bleu Dark", number: "410", value: "#007b86" },
        "433": { name: "Electric Bleu", number: "433", value: "#aadee1" },
        "681": { name: "Forest Dark", number: "681", value: "#554900" },
        "683": { name: "Turf Green", number: "683", value: "#2b3929" },
        "778": { name: "Flesh Light", number: "778", value: "#ffdcc1" },
        "779": { name: "Bleu Mist Medium Dark", number: "779", value: "#5c6e6c" },
        "830": { name: "Sierra Very Light", number: "830", value: "#e6bf88" },
        "831": { name: "Sierra Light", number: "831", value: "#dbb07a" },
        "832": { name: "Sierra Medium", number: "832", value: "#cb9867" },
        "842": { name: "Fern Green Light", number: "842", value: "#ccc481" },
        "843": { name: "Fern Green", number: "843", value: "#abaa59" },
        "844": { name: "Fern Green Medium", number: "844", value: "#968c28" },
        "845": { name: "Fern Green Medium Dark", number: "845", value: "#847711" },
        "846": { name: "Fern Green Dark", number: "846", value: "#7b7711" },
        "847": { name: "Bleu Mist Very Light", number: "847", value: "#e9e9df" },
        "848": { name: "Bleu Mist", number: "848", value: "#c8c6c2" },
        "849": { name: "Bleu Mist Medium Light", number: "849", value: "#c8c6c2" },
        "850": { name: "Bleu Mist Medium", number: "850", value: "#607473" },
        "851": { name: "Bleu Mist Dark", number: "851", value: "#566364" },
        "852": { name: "Turf Very Light", number: "852", value: "#ffecd3" },
        "853": { name: "Turf Light", number: "853", value: "#cba26b" },
        "854": { name: "Turf Medium Light", number: "854", value: "#c49b64" },
        "855": { name: "Turf Medium", number: "855", value: "#b88a57" },
        "856": { name: "Turf Dark", number: "856", value: "#b88a57" },
        "858": { name: "Laurel Green Light", number: "858", value: "#bdc597" },
        "859": { name: "Laurel Green", number: "859", value: "#acb78e" },
        "860": { name: "Laurel Green Medium Light", number: "860", value: "#9fa98e" },
        "861": { name: "Laurel Green Medium", number: "861", value: "#433f2f" },
        "862": { name: "Laurel Green Dark", number: "862", value: "#374912" },
        "868": { name: "Flesh Medium", number: "868", value: "#ffb193" },
        "869": { name: "Amethyst Light", number: "869", value: "#ebebe7" },
        "870": { name: "Amethyst", number: "870", value: "#e1cdc8" },
        "871": { name: "Amethyst Medium Light", number: "871", value: "#be9ba7" },
        "872": { name: "Amethyst Medium", number: "872", value: "#9c7d85" },
        "873": { name: "Amethyst Dark", number: "873", value: "#9c7d85" },
        "874": { name: "Saffron Medium", number: "874", value: "#f2d18e" },
        "875": { name: "Pine Light", number: "875", value: "#b6f2d8" },
        "876": { name: "Pine", number: "876", value: "#8fbfab" },
        "877": { name: "Pine Medium", number: "877", value: "#628c7a" },
        "878": { name: "Pine Medium Dark", number: "878", value: "#435549" },
        "879": { name: "Pine Dark", number: "879", value: "#2b3929" },
        "880": { name: "Copper Light", number: "880", value: "#ffe5bc" },
        "881": { name: "Copper", number: "881", value: "#ffcea4" },
        "883": { name: "Copper Medium", number: "883", value: "#c2654c" },
        "884": { name: "Copper Dark", number: "884", value: "#c55e58" },
        "885": { name: "Sand Stone Light", number: "885", value: "#f4e9ca" },
        "886": { name: "Sand Stone", number: "886", value: "#ffe7b6" },
        "887": { name: "Sand Stone Medium Light", number: "887", value: "#e5c18b" },
        "888": { name: "Sand Stone Medium", number: "888", value: "#d89769" },
        "889": { name: "Sand Stone Medium Dark", number: "889", value: "#976854" },
        "890": { name: "Light Brass", number: "890", value: "#f3b080" },
        "891": { name: "Brass", number: "891", value: "#ffce9e" },
        "893": { name: "Rose Wine", number: "893", value: "#ffc7b0" },
        "895": { name: "Rose Wine Medium", number: "895", value: "#db8073" },
        "896": { name: "Rose Wine Dark", number: "896", value: "#b84b4d" },
        "897": { name: "Rose Wine Very Dark", number: "897", value: "#9c294a" },
        "898": { name: "Sierra", number: "898", value: "#9e6d5b" },
        "899": { name: "Tawny Light", number: "899", value: "#ceaf90" },
        "900": { name: "Pewter Light", number: "900", value: "#cacaca" },
        "901": { name: "Brass Medium", number: "901", value: "#d18c67" },
        "903": { name: "Tawny Medium", number: "903", value: "#bc9c78" },
        "904": { name: "Tawny", number: "904", value: "#71472a" },
        "905": { name: "Tawny Dark", number: "905", value: "#64472a" },
        "906": { name: "Brass Dark", number: "906", value: "#825a08" },
        "907": { name: "Saffron Dark", number: "907", value: "#b27737" },
        "914": { name: "Flesh Medium Dark", number: "914", value: "#c2654c" },
        "920": { name: "Denim Light", number: "920", value: "#7c8791" },
        "921": { name: "Denim Medium", number: "921", value: "#7c8791" },
        "922": { name: "Denim Dark", number: "922", value: "#667a8c" },
        "923": { name: "Emerald Very Dark", number: "923", value: "#005b06" },
        "924": { name: "Olive Green Very Dark", number: "924", value: "#8c6700" },
        "925": { name: "Tangerine Very Dark", number: "925", value: "#ff7361" },
        "926": { name: "Ecru Very Light", number: "926", value: "#f5f0db" },
        "928": { name: "Larkspur Light", number: "928", value: "#e3eae6" },
        "933": { name: "Fawn Very Light", number: "933", value: "#efd6bc" },
        "936": { name: "Fawn Very Dark", number: "936", value: "#a24d34" },
        "939": { name: "Stormy Bleu Medium", number: "939", value: "#9eb0ce" },
        "940": { name: "Stormy Bleu Medium Dark", number: "940", value: "#476174" },
        "941": { name: "Stormy Bleu Very Dark", number: "941", value: "#616180" },
        "942": { name: "Wheat Light", number: "942", value: "#f4c38b" },
        "943": { name: "Wheat Medium", number: "943", value: "#edac7b" },
        "944": { name: "Wheat Dark", number: "944", value: "#995c30" },
        "945": { name: "Harvest Medium", number: "945", value: "#f2d18e" },
        "956": { name: "Harvest Light", number: "956", value: "#dbb07a" },
        "968": { name: "Wineberry Light", number: "968", value: "#ffc7b8" },
        "969": { name: "Wineberry Medium", number: "969", value: "#db8073" },
        "970": { name: "Wineberry Medium Dark", number: "970", value: "#cb4e61" },
        "972": { name: "Wineberry Dark", number: "972", value: "#a10048" },
        "975": { name: "Sea Bleu Light", number: "975", value: "#edf7ee" },
        "976": { name: "Sea Bleu Medium Light", number: "976", value: "#c2d1ce" },
        "977": { name: "Sea Bleu Medium", number: "977", value: "#738caa" },
        "978": { name: "Sea Bleu Medium Dark", number: "978", value: "#516d87" },
        "979": { name: "Sea Bleu Dark", number: "979", value: "#3a5467" },
        "1001": { name: "Antique Gold Medium", number: "1001", value: "#f68d39" },
        "1002": { name: "Antique Gold Light", number: "1002", value: "#ffa449" },
        "1003": { name: "Amberglow", number: "1003", value: "#ce675b" },
        "1004": { name: "Apricot Very Dark", number: "1004", value: "#c55e58" },
        "1005": { name: "Cherry Red Medium", number: "1005", value: "#b3005b" },
        "1006": { name: "Cherry Red", number: "1006", value: "#bc0061" },
        "1007": { name: "Chicory Dark", number: "1007", value: "#ad533e" },
        "1008": { name: "Chicory Medium", number: "1008", value: "#e78667" },
        "1009": { name: "Copper Very Light", number: "1009", value: "#fffae0" },
        "1010": { name: "Cinnamon Very Light", number: "1010", value: "#ffe5bc" },
        "1011": { name: "Flesh Very Light", number: "1011", value: "#fff3e7" },
        "1012": { name: "Chickory Light", number: "1012", value: "#fbe3d1" },
        "1013": { name: "Brick Medium", number: "1013", value: "#ed7a64" },
        "1014": { name: "Brick Very Dark", number: "1014", value: "#bd492f" },
        "1015": { name: "Brick Ultra Dark", number: "1015", value: "#bf4024" },
        "1016": { name: "Antique Mauve Light", number: "1016", value: "#ffc7c4" },
        "1017": { name: "Antique Mauve Medium", number: "1017", value: "#dc8d8d" },
        "1018": { name: "Antique Mauve Dark", number: "1018", value: "#c3767b" },
        "1019": { name: "Antique Mauve Very Dark", number: "1019", value: "#a35a5b" },
        "1020": { name: "Peony Very Light", number: "1020", value: "#fde5d9" },
        "1021": { name: "Peony Light", number: "1021", value: "#ffc9bc" },
        "1022": { name: "Peony Medium Light", number: "1022", value: "#f9a092" },
        "1023": { name: "Peony", number: "1023", value: "#e6656b" },
        "1024": { name: "Peony Medium", number: "1024", value: "#bc4055" },
        "1025": { name: "Peony Medium Dark", number: "1025", value: "#c22443" },
        "1026": { name: "Wineberry Very Light", number: "1026", value: "#fff0e4" },
        "1027": { name: "Rose Wine Medium Dark", number: "1027", value: "#b85958" },
        "1028": { name: "Raspberry Medium Dark", number: "1028", value: "#a1354f" },
        "1029": { name: "Antique Rose Ultra Dark", number: "1029", value: "#aa185b" },
        "1030": { name: "Thistle Medium Dark", number: "1030", value: "#9566a2" },
        "1031": { name: "Antique Bleu Ultra Light", number: "1031", value: "#edf7f7" },
        "1032": { name: "Antique Bleu Very Light", number: "1032", value: "#c2d1ce" },
        "1033": { name: "Antique Bleu Light", number: "1033", value: "#b6bac2" },
        "1034": { name: "Antique Bleu Medium", number: "1034", value: "#7c8791" },
        "1035": { name: "Antique Bleu Dark", number: "1035", value: "#667a8c" },
        "1036": { name: "Antique Bleu Very Dark", number: "1036", value: "#0c5b6c" },
        "1037": { name: "Sea Bleu Very Light", number: "1037", value: "#f8f8fc" },
        "1038": { name: "Glacier Bleu Medium", number: "1038", value: "#c2d1cf" },
        "1039": { name: "Glacier Bleu Medium Dark", number: "1039", value: "#66949a" },
        "1040": { name: "Pewter Medium", number: "1040", value: "#bebeb9" },
        "1041": { name: "Stone Grey Very Dark", number: "1041", value: "#6b6766" },
        "1042": { name: "Pine Very Light", number: "1042", value: "#ceddc1" },
        "1043": { name: "Grass Green Very Light", number: "1043", value: "#f3fad1" },
        "1044": { name: "Grass Green Ultra Dark", number: "1044", value: "#595c4e" },
        "1045": { name: "Toast Light", number: "1045", value: "#e79873" },
        "1046": { name: "Toast", number: "1046", value: "#eaaf0f" },
        "1047": { name: "Cinnamon Light", number: "1047", value: "#ffbea4" },
        "1048": { name: "Red Cinnamon", number: "1048", value: "#dd6d5b" },
        "1049": { name: "Cinnamon", number: "1049", value: "#d16654" },
        "1050": { name: "Mocha Brown Dark", number: "1050", value: "#71472a" },
        "1060": { name: "Teal Ultra Light", number: "1060", value: "#ccffff" },
        "1062": { name: "Teal Very Light", number: "1062", value: "#d0dfcd" },
        "1064": { name: "Teal Light", number: "1064", value: "#809784" },
        "1066": { name: "Teal Medium", number: "1066", value: "#009999" },
        "1068": { name: "Teal", number: "1068", value: "#006b6b" },
        "1070": { name: "Jade Light", number: "1070", value: "#c0e0c8" },
        "1072": { name: "Jade Medium Light", number: "1072", value: "#92b7a5" },
        "1074": { name: "Jade Medium", number: "1074", value: "#468c6e" },
        "1076": { name: "Jade", number: "1076", value: "#2f5b49" },
        "1080": { name: "Taupe Light", number: "1080", value: "#dbc2a4" },
        "1082": { name: "Taupe Medium Light", number: "1082", value: "#bc866b" },
        "1084": { name: "Taupe", number: "1084", value: "#80551e" },
        "1086": { name: "Taupe Dark", number: "1086", value: "#6d4227" },
        "1088": { name: "Taupe Very Dark", number: "1088", value: "#5e381b" },
        "1089": { name: "Electric Bleu Medium", number: "1089", value: "#4d79ff" },
        "1090": { name: "Electric Bleu Light", number: "1090", value: "#80dcff" },
        "1092": { name: "Sea Green Very Light", number: "1092", value: "#d0e0d2" },
        "1094": { name: "Beauty Rose Very Light", number: "1094", value: "#ffcfd6" },
        "1096": { name: "Slate Bleu Light", number: "1096", value: "#edf7f7" },
        "1098": { name: "Crimson Red Light", number: "1098", value: "#ff2c00" },
        "4146": { name: "Flesh Medium Light", number: "4146", value: "#efa27f" },
        "5975": { name: "Brick Dark", number: "5975", value: "#b35212" },
        "8581": { name: "Stone Grey", number: "8581", value: "#acacaa" },
        "9046": { name: "Christmas Red", number: "9046", value: "#e71261" },
        "9159": { name: "Glacier Bleu", number: "9159", value: "#edf7ee" },
        "9575": { name: "Bleu Medium Light", number: "9575", value: "#ffb193" }
    }
}
