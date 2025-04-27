import { EntityView } from './entityView';
import * as PIXI from 'pixi.js';
import { SEASON_TYPES } from '@domain/enum/season_types';

class TreeView extends EntityView {

    constructor(entity, entityContainer) {
        super(entity, entityContainer);
        this._treeRect = null

        this._render();

        // this.$eventBus.on('viewPointChanged', this._onViewPointChange.bind(this));
        // this.$domain.events.on('currentSeasonChanged', this._onSeasonChanged.bind(this));
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

        this._treeRect = new PIXI.Rectangle(
            this._entity.position.x - this._entityWidth / 2,
            this._entity.position.y - this._entityHeight,
            this._entityWidth,
            this._entityHeight
        )

        // this._renderTreeRectDebug();
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

    _renderTreeRectDebug() {
        let graphics = new PIXI.Graphics();
        graphics.rect(this._treeRect.x, this._treeRect.y, this._treeRect.width, this._treeRect.height);
        graphics.stroke({
            color: 'red',
            alpha: 0.5
        });
        this._parentContainer.addChild(graphics);
    }

    _onSeasonChanged() {
        this._setTimeout(() => {
            this._renderCurrentSeasonSprite();
        }, Math.random() * 10000);
    }

    _onViewPointChange(viewPoint, viewRect) {
        if (this._isCurrentChunkVisible) {
            this._bodyContainer.alpha = this._treeRect.contains(viewPoint.x, viewPoint.y) ? 0.5 : 1;
        }
    }

}

export {
    TreeView
}