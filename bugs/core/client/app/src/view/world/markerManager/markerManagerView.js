import { BaseGraphicView } from "../../base/baseGraphicView";
import * as PIXI from 'pixi.js';
import { NewNestMarkerPlacerView } from "./markerPlacers/newNestMarkerPlacerView";
import { DestroyNestMarkerPlacerView } from "./markerPlacers/destroyNestMarkerPlacerView";
import { MarkersList } from "./markersList/markersList";

class MarkerManagerView extends BaseGraphicView {

    constructor(markersManagerContainer) {
        super();
        this._markersManagerContainer = markersManagerContainer;
        this._currentMarkerPlacer = null;

        this._render();

        this.$eventBus.on('placeNewNestMarkerRequest', this._onPlaceNewNestMarkerRequest.bind(this));
        this.$eventBus.on('placeDestroyNestMarkerRequest', this._onPlaceDestroyNestMarkerRequest.bind(this));
        this.$eventBus.on('cancelAnyMarkerPlacerRequest', this._onMarkerPlacerCancel.bind(this));
    }

    _render() {
        let container = new PIXI.Container();
        this._markersManagerContainer.addChild(container);
        this._markersList = new MarkersList(container);
    }

    _onPlaceNewNestMarkerRequest(callback) {
        let newMarkerContainer = new PIXI.Container();
        this._markersManagerContainer.addChild(newMarkerContainer);
        this._currentMarkerPlacer = new NewNestMarkerPlacerView(newMarkerContainer, callback);
    }

    _onPlaceDestroyNestMarkerRequest(callback) {
        let newMarkerContainer = new PIXI.Container();
        this._markersManagerContainer.addChild(newMarkerContainer);
        this._currentMarkerPlacer = new DestroyNestMarkerPlacerView(newMarkerContainer, callback);
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