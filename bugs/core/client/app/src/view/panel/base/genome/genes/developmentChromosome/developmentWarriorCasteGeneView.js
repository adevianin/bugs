import { DevelopmentCasteGeneView } from "./base/developmentCasteGeneView";
import { AntTypes } from "@domain/enum/antTypes";

class DevelopmentWarriorCasteGeneView extends DevelopmentCasteGeneView {

    get _antType() {
        return AntTypes.WARRIOR;
    }
}

export {
    DevelopmentWarriorCasteGeneView
}