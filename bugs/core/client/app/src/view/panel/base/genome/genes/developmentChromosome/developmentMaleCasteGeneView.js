import { DevelopmentCasteGeneView } from "./base/developmentCasteGeneView";
import { AntTypes } from "@domain/enum/antTypes";

class DevelopmentMaleCasteGeneView extends DevelopmentCasteGeneView {

    get _antType() {
        return AntTypes.MALE;
    }
}

export {
    DevelopmentMaleCasteGeneView
}