import { EntityView } from './entityView';
import * as PIXI from 'pixi.js';
import { HpLineView } from './hpLine';

class NestView extends EntityView { 

    constructor(entity, entityContainer) {
        super(entity, entityContainer);

        this._render();

        this._unbindStateChangeListener = this._entity.on('stateChanged', this._renderVisualState.bind(this));
        this._unbindFortificationChangeListener = this._entity.on('fortificationChanged', this._renderFortificationValue.bind(this));
    }

    _render() {
        this._nestContainer = new PIXI.Container();
        this._bodyContainer = new PIXI.Container();
        this._uiContainer = new PIXI.Container();
        this._nestContainer.addChild(this._bodyContainer);
        this._nestContainer.addChild(this._uiContainer);
        this._entityContainer.addChild(this._nestContainer);

        this._builtNestSprite = new PIXI.Sprite(this.$textureManager.getTexture('nest.png'));
        this._builtNestSprite.eventMode = 'static';
        this._bodyContainer.addChild(this._builtNestSprite);

        this._buildingNestSprite = new PIXI.Sprite(this.$textureManager.getTexture('nest_building.png'));
        this._bodyContainer.addChild(this._buildingNestSprite);

        this._destroyedNestSprite = new PIXI.Sprite(this.$textureManager.getTexture('nest_destroyed.png'));
        this._bodyContainer.addChild(this._destroyedNestSprite);

        let nestHalfWidth = this._builtNestSprite.width / 2;
        let nestHalfHeight = this._builtNestSprite.height / 2;

        this._bodyContainer.pivot.x = nestHalfWidth;
        this._bodyContainer.pivot.y = nestHalfHeight;
        this._uiContainer.pivot.x = nestHalfWidth;
        this._uiContainer.pivot.y = nestHalfHeight;

        // this._nestContainer.x = this._entity.position.x;
        // this._nestContainer.y = this._entity.position.y;

        if (this.$domain.isEntityMy(this._entity)) {
            this._builtNestSprite.on('pointerdown', this._onClick.bind(this));
        }

        this._renderVisualState();

        this._hpLineView = new HpLineView(this._entity, { x: 0, y: -13 }, this._builtNestSprite.width, this._uiContainer);

        this._fortificationLine = new PIXI.Graphics();
        this._fortificationLine.x = 0;
        this._fortificationLine.y = -8;
        this._uiContainer.addChild(this._fortificationLine);
        this._renderFortificationValue();

        this._renderEntityState();
    }

    remove() {
        super.remove();
        this._unbindStateChangeListener();
        this._hpLineView.remove();
    }

    _renderVisualState() {
        let state = this._entity.state;

        this._builtNestSprite.renderable = state == 'built';
        this._buildingNestSprite.renderable = state == 'building';
        this._destroyedNestSprite.renderable = state == 'dead';
    }

    _renderFortificationValue() {
        let fortLineMaxWidth = this._builtNestSprite.width;
        let fortInPercent = (this._entity.fortification * 100) / this._entity.maxFortification;
        let lineWidth = (fortLineMaxWidth / 100) * fortInPercent;

        let color = 0x800080;
        this._fortificationLine.clear();
        this._fortificationLine.fill(color);
        this._fortificationLine.rect(0, 0, lineWidth, 5);
    }

    _onClick() {
        this.$eventBus.emit('nestManageRequest', this._entity);
    }

}

export {
    NestView
}