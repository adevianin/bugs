import { EntityView } from './entityView';
import * as PIXI from 'pixi.js';

class NestView extends EntityView { 

    constructor(entity, entityContainer) {
        super(entity, entityContainer);

        this._built_nest_sprite = new PIXI.Sprite(this.$textureManager.getTexture('nest.png'));
        this._built_nest_sprite.anchor.set(0.5);
        entityContainer.addChild(this._built_nest_sprite);
        this._built_nest_sprite.eventMode = 'static';
        this._built_nest_sprite.x = this._entity.position.x;
        this._built_nest_sprite.y = this._entity.position.y;

        this._building_nest_sprite = new PIXI.Sprite(this.$textureManager.getTexture('nest_building.png'));
        this._building_nest_sprite.anchor.set(0.5);
        entityContainer.addChild(this._building_nest_sprite);
        this._building_nest_sprite.eventMode = 'static';
        this._building_nest_sprite.x = this._entity.position.x;
        this._building_nest_sprite.y = this._entity.position.y;

        if (this.$domainFacade.isNestMine(entity)) {
            this._built_nest_sprite.on('pointerdown', this._onClick.bind(this));
        }

        this._unbindBuildStatusChangedListener = this.entity.on('buildStatusChanged', this._renderBuildState.bind(this));

        this._renderBuildState();
    }

    remove() {
        this._unbindBuildStatusChangedListener();
        super.remove();
    }

    _renderBuildState() {
        console.log(1);
        this._building_nest_sprite.renderable = !this.entity.isBuilt;
        this._built_nest_sprite.renderable = this.entity.isBuilt;
    }

    _onClick() {
        NestView.popupManager.openNestPopup(this._entity);
    }

}

export {
    NestView
}