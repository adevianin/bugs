import { EntityView } from './entityView';
import * as PIXI from 'pixi.js';

class ItemView extends EntityView {

    constructor(entity, entitiesContainer) {
        super(entity, entitiesContainer);

        this._unbindIsPickedChangeListener = this._entity.on('isPickedChanged', this._renderIsPicked.bind(this));
        this._unbindPositionChangeListener = this._entity.on('positionChanged', this._renderPosition.bind(this));

        this._render();
    }

    _render() {
        this._sprite = new PIXI.Sprite(this.$textureManager.getTexture(`item_${ this._entity.itemType }_${ this._entity.itemVariety }v.png`));
        this._entityContainer.addChild(this._sprite);

        let halfWidth = this._sprite.width / 2;
        let halfHeight = this._sprite.height / 2;

        this._entityContainer.pivot.x = halfWidth;
        this._entityContainer.pivot.y = halfHeight;

        this._renderPosition();
        this._renderIsPicked();
    }

    _renderPosition() {
        this._entityContainer.x = this.entity.position.x;
        this._entityContainer.y = this.entity.position.y;
    }

    _renderIsPicked() {
        this._sprite.renderable = !this._entity.isPicked;
    }

    remove() {
        this._unbindIsPickedChangeListener();
        this._unbindPositionChangeListener();
        super.remove();
    }
    
}

export {
    ItemView
}