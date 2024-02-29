import { DevelopmentCasteGeneView } from "./base/developmentCasteGeneView";
import { AntTypes } from "@domain/enum/antTypes";

class DevelopmentQueenCasteGeneView extends DevelopmentCasteGeneView {
    get _antType() {
        return AntTypes.QUEEN;
    }
}

export {
    DevelopmentQueenCasteGeneView
}