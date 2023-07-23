import { EntityView } from './entityView';
import * as PIXI from 'pixi.js';

class NestView extends EntityView { 

    constructor(entity, entityContainer) {
        super(entity, entityContainer);

        this._render();

        this._unbindStateChangeListener = this._entity.on('stateChanged', this._renderState.bind(this));
    }

    _render() {
        this._nestContainer = new PIXI.Container();
        this._entityContainer.addChild(this._nestContainer);

        this._builtNestSprite = new PIXI.Sprite(this.$textureManager.getTexture('nest.png'));
        this._builtNestSprite.anchor.set(0.5);
        this._builtNestSprite.eventMode = 'static';
        this._builtNestSprite.x = this._entity.position.x;
        this._builtNestSprite.y = this._entity.position.y;
        this._nestContainer.addChild(this._builtNestSprite);

        this._buildingNestSprite = new PIXI.Sprite(this.$textureManager.getTexture('nest_building.png'));
        this._buildingNestSprite.anchor.set(0.5);
        this._buildingNestSprite.eventMode = 'static';
        this._buildingNestSprite.x = this._entity.position.x;
        this._buildingNestSprite.y = this._entity.position.y;
        this._nestContainer.addChild(this._buildingNestSprite);

        this._destroyedNestSprite = new PIXI.Sprite(this.$textureManager.getTexture('nest_destroyed.png'));
        this._destroyedNestSprite.anchor.set(0.5);
        this._destroyedNestSprite.x = this._entity.position.x;
        this._destroyedNestSprite.y = this._entity.position.y;
        this._nestContainer.addChild(this._destroyedNestSprite);

        if (this.$domainFacade.isNestMine(this._entity)) {
            this._builtNestSprite.on('pointerdown', this._onClick.bind(this));
        }

        this._renderState();
    }

    remove() {
        this._unbindStateChangeListener();
        this._entityContainer.removeChild(this._nestContainer);
        super.remove();
    }

    _renderState() {
        let state = this._entity.state;

        this._builtNestSprite.renderable = state == 'built';
        this._buildingNestSprite.renderable = state == 'building';
        this._destroyedNestSprite.renderable = state == 'destroyed';
    }

    _onClick() {
        NestView.popupManager.openNestPopup(this._entity);
    }

}

export {
    NestView
}