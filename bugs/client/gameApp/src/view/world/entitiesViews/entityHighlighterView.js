import { BaseGraphicView } from "@view/base/baseGraphicView";
import * as PIXI from 'pixi.js';

class EntityHightlighterView extends BaseGraphicView {

    constructor(container, entity) {
        super();
        this._container = container;
        this._entity = entity;

        this._render();

        this._stopListenHightlightEntityRequest = this.$eventBus.on('highlightEntity', this._onHightlightRequest.bind(this));
    }

    remove() {
        super.remove();
        this._stopListenHightlightEntityRequest
    }

    _render() {
        this._enemyIcon = new PIXI.Sprite(this.$textureManager.getTexture('enemy_icon.png'));
        this._enemyIcon.anchor.set(0.5, 1);
        this._enemyIcon.renderable = false;
        this._enemyIcon.setSize(20, 20);
        this._container.addChild(this._enemyIcon);

        this._pointerIcon = new PIXI.Sprite(this.$textureManager.getTexture('pointer_icon.png'));
        this._pointerIcon.anchor.set(0.5, 1);
        this._pointerIcon.renderable = false;
        this._pointerIcon.setSize(20, 20);
        this._container.addChild(this._pointerIcon);
    }

    _highlight(type) {
        this._stopHightlight();
        this._isHighlighting = true;

        switch (type) {
            case 'enemy':
                this._enemyIcon.renderable = true;
                break;
            case 'pointer':
                this._pointerIcon.renderable = true;
                break;
            default:
                throw 'unknown type of hightlight';
        }

        this._timerId = setTimeout(() => {
            this._timerId = null;
            this._stopHightlight();
        }, 10000);
    }

    _stopHightlight() {
        if (this._isHighlighting) {
            if (this._timerId) {
                clearTimeout(this._timerId);
            }
            this._isHighlighting = false;
            this._enemyIcon.renderable = false;
            this._pointerIcon.renderable = false;
        }
    }

    _onHightlightRequest(params) {
        if (params.colonyId) {
            if (this._entity.fromColony == params.colonyId) {
                this._highlight(params.type);
            } else {
                this._stopHightlight();
            }
        } else if (params.entityId) {
            if (this._entity.id == params.entityId) {
                this._highlight(params.type);
            } else {
                this._stopHightlight();
            }
        } else {
            throw 'invalid hightlight request';
        }
    }


}

export {
    EntityHightlighterView
}