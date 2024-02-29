import { DevelopmentCasteGeneView } from "./base/developmentCasteGeneView";
import { AntTypes } from "@domain/enum/antTypes";

class DevelopmentWorkerCasteGeneView extends DevelopmentCasteGeneView {

    get _antType() {
        return AntTypes.WORKER;
    }
}

export {
    DevelopmentWorkerCasteGeneView
}