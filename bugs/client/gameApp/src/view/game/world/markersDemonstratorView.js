import { BaseGraphicView } from "@view/base/baseGraphicView";
import * as PIXI from 'pixi.js';

class MarkersDemonstratorView extends BaseGraphicView {

    constructor(container) {
        super();
        this._container = container;
        this._markerViews = [];

        this.$eventBus.on('showMarkersRequest', this._onShowMarkersRequest.bind(this));
        this.$eventBus.on('hideMarkersRequest', this._onHideMarkersRequest.bind(this));

    }

    _renderMarker(marker) {
        let markerView = new PIXI.Sprite(this.$textureManager.getTexture(`marker_${marker.type}.png`));
        markerView.anchor.set(0.5, 0.5); 
        markerView.position.x = marker.point[0];
        markerView.position.y = marker.point[1];
        return markerView;
    }

    _renderMarkerConnection(x1, y1, x2, y2) {
        let line = new PIXI.Graphics();
        line.setStrokeStyle({
            color: 0xff0000,
            width: 2,
            alignment: 0.5,
        });
        line.moveTo(x1, y1);
        line.lineTo(x2, y2);
        line.stroke();
        return line;
    }

    _renderMarkers(markers) {
        let views = [];
        for (let i = 0; i < markers.length; i++) {
            let marker = markers[i];
            let markerView = this._renderMarker(marker);
            views.push(markerView);
            let hasNext = i + 1 < markers.length;
            if (hasNext) {
                let nextMarker = markers[i + 1];
                let connectionView = this._renderMarkerConnection(marker.point[0], marker.point[1], nextMarker.point[0], nextMarker.point[1]);
                views.push(connectionView);
            }
        }

        for (let markerView of views) {
            this._container.addChild(markerView);
        }

        return views;
    }

    _clearMarkers() {
        for (let view of this._markerViews) {
            this._container.removeChild(view);
        }
        this._markerViews = [];
    }

    _onShowMarkersRequest(markers) {
        this._clearMarkers();
        this._markerViews = this._renderMarkers(markers);
    }

    _onHideMarkersRequest() {
        this._clearMarkers();
    }

}

export {
    MarkersDemonstratorView
}