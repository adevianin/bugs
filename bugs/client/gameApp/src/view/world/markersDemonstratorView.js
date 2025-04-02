import { BaseGraphicView } from "@view/base/baseGraphicView";
import * as PIXI from 'pixi.js';
import { MarkerTypes } from "@domain/enum/markerTypes";
import { UI_CONSTS } from "@common/view/ui_consts";

class MarkersDemonstratorView extends BaseGraphicView {

    constructor(container) {
        super();
        this._container = container;
        this._markerViews = [];

        this.$eventBus.on('showMarkersRequest', this._onShowMarkersRequest.bind(this));
        this.$eventBus.on('hideMarkersRequest', this._onHideMarkersRequest.bind(this));

    }

    _renderMarkerConnection(x1, y1, x2, y2) {
        let line = new PIXI.Graphics();
        line.setStrokeStyle({
            color: UI_CONSTS.WORLD_VIEW_MARKERS_CONNECTOR_COLOR,
            width: 2
        });
        line.moveTo(x1, y1);
        line.lineTo(x2, y2);
        line.stroke();
        return line;
    }

    _renderConnectedMarkers(markers) {
        let views = [];
        for (let i = 0; i < markers.length; i++) {
            let marker = markers[i];
            let markerView = this._renderMarker(marker);
            views.push(markerView);
            let hasNext = i + 1 < markers.length;
            if (hasNext) {
                let nextMarker = markers[i + 1];
                let connectionView = this._renderMarkerConnection(marker.point.x, marker.point.y, nextMarker.point.x, nextMarker.point.y);
                views.push(connectionView);
            }
        }

        for (let markerView of views) {
            this._container.addChild(markerView);
        }

        return views;
    }

    _renderMarker(marker) {
        switch (marker.type) {
            case MarkerTypes.POINTER:
                return this._renderPointerMarker(marker);
            case MarkerTypes.CROSS:
            case MarkerTypes.EAT:
            case MarkerTypes.LOAD:
            case MarkerTypes.PILLAGE:
            case MarkerTypes.SHIELD:
            case MarkerTypes.UNLOAD:
                return this._renderGenericMarker(marker);
            default:
                throw 'unknown type of marker';
        }
    }

    _renderPointerMarker(marker) {
        let container = new PIXI.Container();
        container.position.set(marker.point.x, marker.point.y);

        let sprite = new PIXI.Sprite(this.$textureManager.getTexture(`marker_${MarkerTypes.POINTER}.png`));
        sprite.anchor.set(0.5, 1); 
        container.addChild(sprite);

        if (marker.params.area) {
            let area = new PIXI.Graphics();
            area
                .circle(0,0, marker.params.area)
                .stroke({
                    color: UI_CONSTS.WORLD_VIEW_NEST_AREA_COLOR,
                    width: 1
                });
            container.addChild(area);
        }

        return container;
    }

    _renderGenericMarker(marker) {
        let markerView = new PIXI.Sprite(this.$textureManager.getTexture(`marker_${marker.type}.png`));
        markerView.anchor.set(0.5, 0.5); 
        markerView.position.set(marker.point.x, marker.point.y);
        return markerView;
    }

    _clearMarkers() {
        for (let view of this._markerViews) {
            this._container.removeChild(view);
            view.destroy();
        }
        this._markerViews = [];
    }

    _onShowMarkersRequest(markers) {
        this._clearMarkers();
        this._markerViews = this._renderConnectedMarkers(markers);
    }

    _onHideMarkersRequest() {
        this._clearMarkers();
    }

}

export {
    MarkersDemonstratorView
}