import { BaseGraphicView } from "../../base/baseGraphicView";
import * as PIXI from 'pixi.js';
import { NewNestMarkerPlacerView } from "./markerPlacers/newNestMarkerPlacerView";

class MarkerManagerView extends BaseGraphicView {

    constructor(markersContainer) {
        super();
        this._markersContainer = markersContainer;
        this._currentMarkerPlacer = null;

        this._render();

        this.$eventBus.on('placeNewNestMarker', this._onPlaceNewNestMarkerRequest.bind(this));
        this.$eventBus.on('cancelAnyMarkerPlacer', this._onMarkerPlacerCancel.bind(this));
    }

    _render() {
        
    }

    _onPlaceNewNestMarkerRequest(callback) {
        let newMarkerContainer = new PIXI.Container();
        this._markersContainer.addChild(newMarkerContainer);
        this._currentMarkerPlacer = new NewNestMarkerPlacerView(newMarkerContainer, callback);
    }

    _onMarkerPlacerCancel() {
        if (this._currentMarkerPlacer) {
            this._currentMarkerPlacer.remove();
            this._currentMarkerPlacer = null;
        }
    }
}

export {
    MarkerManagerView
}