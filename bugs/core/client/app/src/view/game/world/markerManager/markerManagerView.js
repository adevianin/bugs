import { BaseGraphicView } from "@view/base/baseGraphicView";
import * as PIXI from 'pixi.js';
import { NewNestMarkerPlacerView } from "./markerPlacers/newNestMarkerPlacerView";
import { DestroyNestMarkerPlacerView } from "./markerPlacers/destroyNestMarkerPlacerView";
import { PillageNestMarkerPlacerView } from "./markerPlacers/pillageNestMarkerPlacer";
import { MarkersList } from "./markersList/markersList";

class MarkerManagerView extends BaseGraphicView {

    constructor(markersManagerContainer) {
        super();
        this._markersManagerContainer = markersManagerContainer;
        this._currentMarkerPlacer = null;

        this._render();

        this._stopListenPlaceNewNestMarkerRequest = this.$eventBus.on('placeNewNestMarkerRequest', this._onPlaceNewNestMarkerRequest.bind(this));
        this._stopListenPlaceDestroyNestMarkerRequest = this.$eventBus.on('placeDestroyNestMarkerRequest', this._onPlaceDestroyNestMarkerRequest.bind(this));
        this._stopListenPillageDestroyNestMarkerRequest = this.$eventBus.on('placePillageNestMarkerRequest', this._onPlacePillageNestMarkerRequest.bind(this));
        this._stopListenCancelAnyMarkerPlacerRequest = this.$eventBus.on('cancelAnyMarkerPlacerRequest', this._onMarkerPlacerCancel.bind(this));
    }

    clear() {
        this._removeMarkerPlacerPlacer();
    }

    remove() {
        this._removeMarkerPlacerPlacer();
        this._stopListenPlaceNewNestMarkerRequest();
        this._stopListenPlaceDestroyNestMarkerRequest();
        this._stopListenPillageDestroyNestMarkerRequest();
        this._stopListenCancelAnyMarkerPlacerRequest();
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

    _onPlaceDestroyNestMarkerRequest(performingColonyId, callback) {
        let newMarkerContainer = new PIXI.Container();
        this._markersManagerContainer.addChild(newMarkerContainer);
        this._currentMarkerPlacer = new DestroyNestMarkerPlacerView(newMarkerContainer, performingColonyId, callback);
    }

    _onPlacePillageNestMarkerRequest(performingColonyId, callback) {
        let newMarkerContainer = new PIXI.Container();
        this._markersManagerContainer.addChild(newMarkerContainer);
        this._currentMarkerPlacer = new PillageNestMarkerPlacerView(newMarkerContainer, performingColonyId, callback);
    }

    _onMarkerPlacerCancel() {
        this._removeMarkerPlacerPlacer();
    }

    _removeMarkerPlacerPlacer() {
        if (this._currentMarkerPlacer) {
            this._currentMarkerPlacer.remove();
            this._currentMarkerPlacer = null;
        }
    }
}

export {
    MarkerManagerView
}