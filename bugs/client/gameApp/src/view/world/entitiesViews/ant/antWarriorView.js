import { BaseAntView } from "./baseAntView";

class AntWarriorView extends BaseAntView {

    constructor(entity, entityContainer, entitiesLayer, hudLayer) {
        super(entity, entityContainer, entitiesLayer, hudLayer);

        this._render();
    }

}

export {
    AntWarriorView
}