import { EntityView } from './entityView';
import * as PIXI from 'pixi.js';

class TreeView extends EntityView {

    constructor(entity, entityContainer) {
        super(entity, entityContainer);

        this._render();

        this._bodyContainer.on('mouseover', this._onMouseover.bind(this));
        this._bodyContainer.on('mouseout', this._onMouseout.bind(this));
    }

    _render() {
        this._bodyContainer = new PIXI.Container();
        this._bodyContainer.eventMode = 'none';
        this._entityContainer.addChild(this._bodyContainer);

        this._sprite = new PIXI.Sprite(this.$textureManager.getTexture(`tree_summer.png`));
        this._bodyContainer.addChild(this._sprite);

        this._entityContainer.x = this._entity.position.x;
        this._entityContainer.y = this._entity.position.y;

        this._entityContainer.pivot.x = this._sprite.width / 2;
        this._entityContainer.pivot.y = this._sprite.height;
    }

    _onMouseover() {
        this._bodyContainer.alpha = 0.5;
    }

    _onMouseout() {
        this._bodyContainer.alpha = 1;
    }
}

export {
    TreeView
}