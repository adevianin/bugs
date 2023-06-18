import { BaseGraphicView } from "view/base/baseGraphicView";
import * as PIXI from 'pixi.js';

class MarkersList extends BaseGraphicView {

    constructor(container) {
        super();
        this._container = container;
        this._myColony = this.$domainFacade.findMyColony();

        this._renderMarkers();

        this._myColony.on('operationsChanged', this._renderMarkers.bind(this));
        this.$eventBus.on('operationsViewActivationChanged', this._onOperationsViewActivationChanged.bind(this));
    }

    _renderMarkers() {
        this._container.removeChildren();
        this._myColony.operations.forEach(operation => {
            operation.markers.forEach(marker => {
                this._renderMarker(marker);
            });
        });
    }

    _renderMarker(marker) {
        let sprite = new PIXI.Sprite(this.$textureManager.getTexture(`marker_${marker.type}.png`));
        sprite.anchor.set(0.5, 1);
        sprite.x = marker.point[0];
        sprite.y = marker.point[1];
        this._container.addChild(sprite);
    }

    _onOperationsViewActivationChanged(isEnabled) {
        this._container.renderable = isEnabled;
    }

}

export {
    MarkersList
}