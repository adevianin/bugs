import { BaseGraphicView } from "@view/base/baseGraphicView";
import * as PIXI from 'pixi.js';

class BasePickerView extends BaseGraphicView {

    constructor(container) {
        super();
        this._container = container;
        this._pickableCircle = null;
        this._exclusions = [];
        this._isActivated = false;
    }

    get isActivated() {
        return this._isActivated;
    }

    activate() {
        if (this._isActivated) {
            throw 'already activated';
        }
        this._isActivated = true;
        this._stopListenSomeChunkVisibilityStateChanged = this.$eventBus.on('someChunkVisibilityStateChanged', this._onSomeChunkVisibilityStateChanged.bind(this));
    }

    deactivate() {
        if (!this._isActivated) {
            throw 'already deactivated';
        }
        this._isActivated = false;
        this._stopListenSomeChunkVisibilityStateChanged();
        this._clearArea();
    }

    _updateArea() {
        this._prepareAreaData();
        this._renderAreaData();
    }

    _prepareAreaData() {
        throw 'not realized';
    }

    _updateAreaData(pickableCircle, exclusions) {
        this._pickableCircle = pickableCircle;
        this._exclusions = exclusions || [];
    }

    _renderAreaData() {
        this._clearArea();
        
        if (this._pickableCircle) {
            this._renderPickableCircle(this._pickableCircle);
        }

        if (this._exclusions.length > 0) {
            this._renderExclusions(this._exclusions, this._pickableCircle);
        }
    }

    _renderPickableCircle(pickableCircle) {
        let worldSize = this.$domain.getWorldSize();
        this._notPickableArea = new PIXI.Graphics();
        this._notPickableArea
            .rect(0, 0, worldSize[0], worldSize[1])
            .fill({
                color: 0xff0000,
                alpha: 0.5,
            })
            .circle(pickableCircle.center.x, pickableCircle.center.y, pickableCircle.radius)
            .cut();
        this._container.addChild(this._notPickableArea);
    }

    _removePickableCircle() {
        if (this._notPickableArea) {
            this._container.removeChild(this._notPickableArea);
            this._notPickableArea = null;
        }
    }

    _renderCircleMaskFor(container, circle) {
        let mask = new PIXI.Graphics();
        mask
            .circle(circle.center.x, circle.center.y, circle.radius)
            .fill({
                color: 0x000000
            });
        container.mask = mask;
        container.addChild(mask);
    }

    _renderExclusions(exclusions, circleMask) {
        this._exclusionsContainer = new PIXI.Container();
        this._container.addChild(this._exclusionsContainer);
        if (circleMask) {
            this._renderCircleMaskFor(this._exclusionsContainer, circleMask);
        }
        for (let exclusion of exclusions) {
            let excelusionGraphic = new PIXI.Graphics();
            excelusionGraphic
                .circle(exclusion.center.x, exclusion.center.y, exclusion.radius)
                .fill({
                    color: 0xff0000,
                    alpha: 0.5,
                });
            this._exclusionsContainer.addChild(excelusionGraphic);
        }
    }

    _removeExclusions() {
        if (this._exclusionsContainer) {
            this._container.removeChild(this._exclusionsContainer);
            this._exclusionsContainer = null;
        }
    }

    _clearArea() {
        this._removePickableCircle();
        this._removeExclusions();
    }

    _onSomeChunkVisibilityStateChanged() {
        this._updateArea();
    }
}

export {
    BasePickerView
}