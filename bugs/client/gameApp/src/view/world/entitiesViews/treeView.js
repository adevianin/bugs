import { EntityView } from './entityView';
import * as PIXI from 'pixi.js';

class TreeView extends EntityView {

    constructor(entity, entityContainer) {
        super(entity, entityContainer);
        this._treeRect = null

        this._render();

        this.$eventBus.on('viewPointChanged', this._onViewPointChange.bind(this));
    }

    _render() {
        this._bodyContainer = new PIXI.Container();
        this._bodyContainer.eventMode = 'none';
        this._entityContainer.addChild(this._bodyContainer);

        this._sprite = new PIXI.Sprite(this.$textureManager.getTexture(`tree_summer.png`));
        this._bodyContainer.addChild(this._sprite);

        this._entityContainer.pivot.x = this._sprite.width / 2;
        this._entityContainer.pivot.y = this._sprite.height;

        this._bodyContainer.alpha = 0.5;
        this._renderEntityState();

        this._treeRect = new PIXI.Rectangle(
            this._entity.position.x - this._sprite.width / 2,
            this._entity.position.y - this._sprite.height,
            this._sprite.width,
            this._sprite.height
        )

        // this._renderTreeRectDebug();
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

    _onViewPointChange(viewPoint, viewRect) {
        if (this._isCurrentChunkVisible) {
            this._bodyContainer.alpha = this._treeRect.contains(viewPoint.x, viewPoint.y) ? 0.5 : 1;
        }
    }

}

export {
    TreeView
}