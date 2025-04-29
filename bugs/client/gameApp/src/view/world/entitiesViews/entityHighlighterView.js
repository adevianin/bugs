import { BaseGraphicView } from "@view/base/baseGraphicView";
import * as PIXI from 'pixi.js';

class EntityHightlighterView extends BaseGraphicView {

    static HIGHLIGHT_TIME = 10000;

    static registerHighlightEntityRequest(params) {
        this._lastRequest = {
            params,
            time: performance.now()
        }
    }

    static calcLeftTimeForLastHighlightRequest() {
        if (!this._lastRequest) {
            return 0;
        }
        let elapsedTime = performance.now() - this._lastRequest.time;
        let leftTime = EntityHightlighterView.HIGHLIGHT_TIME - elapsedTime;
        return leftTime;
    }

    constructor(container, entity) {
        super();
        this._container = container;
        this._entity = entity;

        this._render();

        this._stopListenHightlightEntityRequest = this.$eventBus.on('highlightEntity', this._onHightlightRequest.bind(this));

        let leftTimeForLastRequest = EntityHightlighterView.calcLeftTimeForLastHighlightRequest();
        if (leftTimeForLastRequest > 0) {
            this._handleHightlightRequest(EntityHightlighterView._lastRequest.params, leftTimeForLastRequest);
        }
    }

    remove() {
        clearTimeout(this._timer);
        this._stopListenHightlightEntityRequest();
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

    _highlight(type, time) {
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

        this._timer = setTimeout(() => {
            this._stopHightlight();
        }, time);
    }

    _stopHightlight() {
        if (this._isHighlighting) {
            this._isHighlighting = false;
            this._enemyIcon.renderable = false;
            this._pointerIcon.renderable = false;
        }
    }

    _onHightlightRequest(params) {
        this._handleHightlightRequest(params);
    }

    _handleHightlightRequest(params, time) {
        if (!time) {
            time = EntityHightlighterView.HIGHLIGHT_TIME;
        }

        if (params.colonyId) {
            if (this._entity.fromColony == params.colonyId) {
                this._highlight(params.type, time);
            } else {
                this._stopHightlight();
            }
        } else if (params.entityId) {
            if (this._entity.id == params.entityId) {
                this._highlight(params.type, time);
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