import { EntityView } from './entityView';
import * as PIXI from 'pixi.js';
import { SEASON_TYPES } from '@domain/enum/season_types';
import { distance_point } from '@utils/distance';

class TreeView extends EntityView {

    constructor(entity, entityContainer, entitiesLayer) {
        super(entity, entityContainer, entitiesLayer);

        this._render();

        this.$eventBus.on('viewPointChanged', this._onViewPointChange.bind(this));
        this.$domain.events.on('currentSeasonChanged', this._onSeasonChanged.bind(this));
    }

    get _entityWidth() {
        return this._spriteSpring.width;
    }

    get _entityHeight() {
        return this._spriteSpring.height;
    }

    remove() {
        super.remove();
        
    }

    _render() {
        this._bodyContainer = new PIXI.Container();
        this._bodyContainer.eventMode = 'none';
        this._entityContainer.addChild(this._bodyContainer);

        this._spriteSpring = new PIXI.Sprite(this.$textureManager.getTexture(`tree_${SEASON_TYPES.SPRING}.png`));
        this._bodyContainer.addChild(this._spriteSpring);
        this._spriteSummer = new PIXI.Sprite(this.$textureManager.getTexture(`tree_${SEASON_TYPES.SUMMER}.png`));
        this._bodyContainer.addChild(this._spriteSummer);
        this._spriteAutumn = new PIXI.Sprite(this.$textureManager.getTexture(`tree_${SEASON_TYPES.AUTUMN}.png`));
        this._bodyContainer.addChild(this._spriteAutumn);
        this._spriteWinter = new PIXI.Sprite(this.$textureManager.getTexture(`tree_${SEASON_TYPES.WINTER}.png`));
        this._bodyContainer.addChild(this._spriteWinter);

        this._entityContainer.pivot.x = this._entityWidth / 2;
        this._entityContainer.pivot.y = this._entityHeight;

        this._renderEntityState();

        this._treeTextureCenter = {
            x: this._entity.position.x,
            y: this._entity.position.y - this._entityHeight / 2
        }

        // this._renderTreeCenterDebug();
    }

    _renderEntityState() {
        super._renderEntityState();
        this._renderCurrentSeasonSprite();
    }

    _renderCurrentSeasonSprite() {
        let currenSeason = this.$domain.currentSeason;
        this._spriteSpring.renderable = currenSeason == SEASON_TYPES.SPRING;
        this._spriteSummer.renderable = currenSeason == SEASON_TYPES.SUMMER;
        this._spriteAutumn.renderable = currenSeason == SEASON_TYPES.AUTUMN;
        this._spriteWinter.renderable = currenSeason == SEASON_TYPES.WINTER;
    }

    _renderTreeCenterDebug() {
        let graphics = new PIXI.Graphics();
        graphics.rect(this._treeTextureCenter.x, this._treeTextureCenter.y, 5, 5);
        graphics.fill({
            color: 'red'
        });
        this._parentContainer.addChild(graphics);
    }

    _onSeasonChanged() {
        this._setTimeout(() => {
            this._renderCurrentSeasonSprite();
        }, Math.random() * 10000);
    }

    _onViewPointChange(viewPoint, viewRect) {
        this._bodyContainer.alpha = distance_point(viewPoint, this._treeTextureCenter) < 150 ? 0.5 : 1;
    }

}

export {
    TreeView
}