import { BaseGraphicView } from "@view/base/baseGraphicView";
import * as PIXI from 'pixi.js';

class MarkersDemonstratorView extends BaseGraphicView {

    constructor(container) {
        super();
        this._container = container;

        this.$eventBus.on('markersDemonstrateRequest', this._onMarkersDemonstrateRequest.bind(this));
    }

    _renderMarkers(markers) {
        this._container.removeChildren();
        markers.forEach((marker) => {
            this._renderMarker(marker);
        });
    }

    _renderMarker(marker) {
        let markerView = new PIXI.Sprite(this.$textureManager.getTexture(`marker_${marker.type}.png`));
        markerView.anchor.set(0.5, 0.5); 
        markerView.position.x = marker.point[0];
        markerView.position.y = marker.point[1];
        this._container.addChild(markerView);
    }

    _onMarkersDemonstrateRequest(markers) {
        this._renderMarkers(markers);
    }

}

export {
    MarkersDemonstratorView
}