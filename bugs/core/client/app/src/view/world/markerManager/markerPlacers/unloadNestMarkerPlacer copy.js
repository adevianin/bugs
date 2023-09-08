import { BaseGraphicView } from "../../../base/baseGraphicView";
import * as PIXI from 'pixi.js';

class UnloadNestMarkerPlacerView extends BaseGraphicView {

    constructor(markerContainer, callback) {
        super();
        this._markerContainer = markerContainer;
        this._callback = callback;

        this._render();

        this._markerContainer.on('pointerdown', this._onClick.bind(this));
    }

    _render() {
        this._markerContainer.eventMode = 'static'; 
        let worldSize = this.$domainFacade.getWorldSize();
        this._markerContainer.hitArea = new PIXI.Rectangle(0, 0, worldSize[0], worldSize[1]);
    }

    _onClick(e) {
        let point = this._markerContainer.toLocal(e.client);
        let nest = this.$domainFacade.findMyNearestNestForOperation(point);

        if (nest) {
            this._callback(nest);
            this.remove();
        }
    }

    remove() {
        this._markerContainer.destroy();
    }
}

export {
    UnloadNestMarkerPlacerView
}