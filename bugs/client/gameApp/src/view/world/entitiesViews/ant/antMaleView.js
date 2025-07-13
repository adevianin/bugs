import { BaseAntView } from "./baseAntView";

class AntMaleView extends BaseAntView {

    constructor(entity, entityContainer, entitiesLayer, hudLayer) {
        super(entity, entityContainer, entitiesLayer, hudLayer);

        this._render();
    }
}

export {
    AntMaleView
}