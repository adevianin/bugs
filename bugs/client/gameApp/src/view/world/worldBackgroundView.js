import { BaseGraphicView } from "@view/base/baseGraphicView";
import * as PIXI from 'pixi.js';
import { SEASON_TYPES } from '@domain/enum/season_types';

class WorldBackgroundView extends BaseGraphicView {

    constructor(container) {
        super();
        this._container = container;

        this._render();

        this.$domain.events.on('currentSeasonChanged', this._onSeasonChanged.bind(this));
    }

    updateTilePosition(cameraX, cameraY) {
        this._bgSprite.tilePosition.x = cameraX % this._summerTexture.width;
        this._bgSprite.tilePosition.y = cameraY % this._summerTexture.height;
    }

    updateScale(scale) {
        this._bgSprite.width = window.screen.width / scale;
        this._bgSprite.height = window.screen.height / scale;
    }

    _render() {
        this._summerTexture = this.$textureManager.getTexture('grass_summer.png');
        this._autumnTexture = this.$textureManager.getTexture('grass_autumn.png');
        this._winterTexture = this.$textureManager.getTexture('grass_winter.png');

        this._bgSprite = new PIXI.TilingSprite();

        this._container.addChild(this._bgSprite);

        this._renderCurrentSeason();
    }

    _renderCurrentSeason() {
        switch(this.$domain.currentSeason) {
            case SEASON_TYPES.SPRING:
            case SEASON_TYPES.SUMMER:
                this._bgSprite.texture = this._summerTexture;
                break;
            case SEASON_TYPES.AUTUMN:
                this._bgSprite.texture = this._autumnTexture;
                break;
            case SEASON_TYPES.WINTER:
                this._bgSprite.texture = this._winterTexture;
                break;
        }
    }

    _onSeasonChanged() {
        this._renderCurrentSeason();
    }

}

export {
    WorldBackgroundView
}