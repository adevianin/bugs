import { BaseGraphicView } from "@view/base/baseGraphicView";
import * as PIXI from 'pixi.js';

class BasePickerView extends BaseGraphicView {

    static AREA_LINE_WIDTH = 2;
    static EXCLUSION_AREA_LINE_COLOR = 0xff0000;
    static ICON_RADIUS = 15;
    static ICON_LINE_WIDTH = 4;
    static ICON_COLOR = 0xff0000;

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
        this._stopListenNestBorn = this.$domain.events.on('nestBorn', this._onNestBorn.bind(this));
        this._stopListenNestDied = this.$domain.events.on('nestDied', this._onNestDied.bind(this));
    }

    deactivate() {
        if (!this._isActivated) {
            throw 'already deactivated';
        }
        this._isActivated = false;
        this._stopListenSomeChunkVisibilityStateChanged();
        this._stopListenNestBorn();
        this._stopListenNestDied();
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
            .rect(
                -pickableCircle.radius, 
                -pickableCircle.radius, 
                worldSize[0] + pickableCircle.radius, 
                worldSize[1] + pickableCircle.radius
            ) // for some reason, the pixi.js doesn't cut if the circle goes beyond the edge of map 
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
            let exclusionGraphic = new PIXI.Graphics();

            exclusionGraphic
                .circle(exclusion.center.x, exclusion.center.y, exclusion.radius)
                .stroke({
                    color: BasePickerView.EXCLUSION_AREA_LINE_COLOR,
                    width: BasePickerView.AREA_LINE_WIDTH
                });

            
            exclusionGraphic
                .circle(exclusion.center.x, exclusion.center.y, BasePickerView.ICON_RADIUS)
                .stroke({
                    color: BasePickerView.ICON_COLOR,
                    width: BasePickerView.ICON_LINE_WIDTH
                });

            let angle = Math.PI / 4;
            
            let lineStartX = exclusion.center.x - BasePickerView.ICON_RADIUS * Math.cos(angle);
            let lineStartY = exclusion.center.y - BasePickerView.ICON_RADIUS * Math.sin(angle);
            let lineEndX = exclusion.center.x + BasePickerView.ICON_RADIUS * Math.cos(angle);
            let lineEndY = exclusion.center.y + BasePickerView.ICON_RADIUS * Math.sin(angle);

            exclusionGraphic
                .moveTo(lineStartX, lineStartY)
                .lineTo(lineEndX, lineEndY)
                .stroke({
                    color: BasePickerView.ICON_COLOR,
                    width: BasePickerView.ICON_LINE_WIDTH
                });
            this._exclusionsContainer.addChild(exclusionGraphic);
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

    _onNestBorn(nest) {
        this._updateArea();
    }

    _onNestDied(nest) {
        this._updateArea();
    }
}

export {
    BasePickerView
}