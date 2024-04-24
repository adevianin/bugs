import { BaseGraphicView } from "@view/base/baseGraphicView";
import * as PIXI from 'pixi.js';

class HpLineView extends BaseGraphicView {
    constructor(entity, position, width, container) {
        super();
        this._container = container;
        this._entity = entity;
        this._position = position;
        this._width = width;

        this._unbindHpChangeListener = this._entity.on('hpChanged', this._renderHpValue.bind(this));

        this._render();
    }

    remove() {
        this._unbindHpChangeListener();
    }

    _render() {
        this._hpLine = new PIXI.Graphics();
        this._hpLine.y = this._position.y;
        this._hpLine.x = this._position.x;
        this._container.addChild(this._hpLine);

        this._renderHpValue();
    }

    _renderHpValue() {
        let hpLineMaxWidth = this._width;
        let hpInPercent = (this._entity.hp * 100) / this._entity.maxHp;
        let lineWidth = (hpLineMaxWidth / 100) * hpInPercent;
        let color = 0x00ff00;
        if (hpInPercent < 60) {
            color = 0xffff00;
        }
        if (hpInPercent < 30) {
            color = 0xff0000;
        }
        this._hpLine.clear();
        this._hpLine.beginFill(color);
        this._hpLine.drawRect(0, 0, lineWidth, 5);
    }

}

export {
    HpLineView
}