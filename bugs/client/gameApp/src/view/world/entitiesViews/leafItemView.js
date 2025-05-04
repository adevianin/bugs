import { ItemView } from "./itemView";
import * as PIXI from 'pixi.js';
import { SEASON_TYPES } from "@domain/enum/season_types";

class LeafItemView extends ItemView {

    constructor(entity, entitiesContainer, entitiesLayer) {
        super(entity, entitiesContainer, entitiesLayer);

        this._stopListenSeasonChange = this.$domain.events.on('currentSeasonChanged', this._onSeasonChanged.bind(this));
    }

    remove() {
        super.remove();
        this._stopListenSeasonChange();
    }

    _render() {
        this._autumnSprite = new PIXI.Sprite(this.$textureManager.getTexture(`item_${ this._entity.itemType }_${ this._entity.itemVariety }v_autumn.png`));
        this._entityContainer.addChild(this._autumnSprite);

        super._render();
    }

    _renderEntityState() {
        super._renderEntityState();
        this._renderCurrentSeasonSprite();
    }

    _renderCurrentSeasonSprite() {
        let currenSeason = this.$domain.currentSeason;
        this._sprite.renderable = currenSeason == SEASON_TYPES.SPRING || currenSeason == SEASON_TYPES.SUMMER;
        this._autumnSprite.renderable = currenSeason == SEASON_TYPES.AUTUMN || currenSeason == SEASON_TYPES.WINTER;
    }

    _onSeasonChanged() {
        this._setTimeout(() => {
            this._renderCurrentSeasonSprite();
        }, Math.random() * 10000);
        
    }
}

export {
    LeafItemView
}
