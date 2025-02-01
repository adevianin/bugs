import { BaseGraphicView } from "@view/base/baseGraphicView";
import * as PIXI from 'pixi.js';

class MarkersDemonstratorView extends BaseGraphicView {

    constructor(container) {
        super();
        this._container = container;
        this._demonstratingOperation = null;
        this._demonstratingOperationMarkerViews = [];

        this.$eventBus.on('operationMarkersShowRequest', this._onOperationMarkersShowRequest.bind(this));
        this.$eventBus.on('operationMarkersHideRequest', this._onOperationMarkersHideRequest.bind(this));
    }

    _renderMarker(marker) {
        let markerView = new PIXI.Sprite(this.$textureManager.getTexture(`marker_${marker.type}.png`));
        markerView.anchor.set(0.5, 0.5); 
        markerView.position.x = marker.point[0];
        markerView.position.y = marker.point[1];
        this._container.addChild(markerView);
        return markerView;
    }

    _clearOperationMarkers() {
        for (let view of this._demonstratingOperationMarkerViews) {
            this._container.removeChild(view);
        }
        this._demonstratingOperationMarkerViews = [];
    }

    _onOperationMarkersShowRequest(operation) {
        this._clearOperationMarkers();
        let markerViews = [];
        for (let marker of operation.markers) {
            let markerView = this._renderMarker(marker);
            markerViews.push(markerView);
        }
        this._demonstratingOperationMarkerViews = markerViews;
    }

    _onOperationMarkersHideRequest() {
        this._clearOperationMarkers();
    }

}

export {
    MarkersDemonstratorView
}