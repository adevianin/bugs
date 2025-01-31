import { BaseGraphicView } from "@view/base/baseGraphicView";
import * as PIXI from 'pixi.js';

class MarkersDemonstratorView extends BaseGraphicView {

    constructor(container) {
        super();
        this._container = container;
        this._operationMarkersViewPacks = {};

        this.$eventBus.on('operationMarkersShowRequest', this._onOperationMarkersShowRequest.bind(this));
        this.$eventBus.on('operationMarkersHideRequest', this._onOperationMarkersHideRequest.bind(this));
    }

    // _renderMarkers(markers) {
    //     this._container.removeChildren();
    //     markers.forEach((marker) => {
    //         this._renderMarker(marker);
    //     });
    // }

    _renderMarker(marker) {
        let markerView = new PIXI.Sprite(this.$textureManager.getTexture(`marker_${marker.type}.png`));
        markerView.anchor.set(0.5, 0.5); 
        markerView.position.x = marker.point[0];
        markerView.position.y = marker.point[1];
        this._container.addChild(markerView);
        return markerView;
    }

    _onOperationMarkersShowRequest(operation) {
        if (this._operationMarkersViewPacks[operation.id]) {
            return;
        }
        let markerViews = [];
        operation.markers.forEach((marker) => {
            let markerView = this._renderMarker(marker);
            markerViews.push(markerView);
        });
        this._operationMarkersViewPacks[operation.id] = {
            views: markerViews
        }
    }

    _onOperationMarkersHideRequest(operation) {
        if (!this._operationMarkersViewPacks[operation.id]) {
            return;
        }
        for (let view of this._operationMarkersViewPacks[operation.id].views) {
            this._container.removeChild(view);
        }
        delete this._operationMarkersViewPacks[operation.id];
    }

}

export {
    MarkersDemonstratorView
}