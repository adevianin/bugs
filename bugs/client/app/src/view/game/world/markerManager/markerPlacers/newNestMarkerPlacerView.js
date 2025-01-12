import { BaseGraphicView } from "@view/base/baseGraphicView";
import * as PIXI from 'pixi.js';

class NewNestMarkerPlacerView extends BaseGraphicView {

    constructor(markerContainer, callback) {
        super();
        this._markerContainer = markerContainer;
        this._callback = callback;

        this._render();

        this._markerContainer.on('pointerdown', this._onClick.bind(this));
    }

    _render() {
        //todo render nest areas
        this._markerContainer.eventMode = 'static'; 
        let worldSize = this.$domainFacade.getWorldSize();
        this._markerContainer.hitArea = new PIXI.Rectangle(0, 0, worldSize[0], worldSize[1]);
    }

    _onClick(e) {
        //check nest area click
        let point = this._markerContainer.toLocal(e.client);
        this._callback({x: point.x, y: point.y});
        this.remove();
    }

    remove() {
        this._markerContainer.destroy();
    }
}

export {
    NewNestMarkerPlacerView
}