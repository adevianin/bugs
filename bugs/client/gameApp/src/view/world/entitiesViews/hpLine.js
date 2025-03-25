import { BaseGraphicView } from "@view/base/baseGraphicView";
import * as PIXI from 'pixi.js';

class HpLineView extends BaseGraphicView {
    constructor(position, width, maxHp, container) {
        super();
        this._container = container;
        this._position = position;
        this._width = width;
        this._maxHp = maxHp;

        this._render();
    }

    showValue(value) {
        this._renderHpValue(value);
    }

    remove() {
        this._container.removeChild(this._hpLine);
    }

    _render() {
        this._hpLine = new PIXI.Graphics();
        this._hpLine.y = this._position.y;
        this._hpLine.x = this._position.x;
        this._container.addChild(this._hpLine);
    }

    _renderHpValue(value) {
        let hpLineMaxWidth = this._width;
        let hpInPercent = (value * 100) / this._maxHp;
        let lineWidth = (hpLineMaxWidth / 100) * hpInPercent;
        let color = 0x00ff00;
        if (hpInPercent < 60) {
            color = 0xffff00;
        }
        if (hpInPercent < 30) {
            color = 0xff0000;
        }
        this._hpLine.clear();
        this._hpLine.rect(0, 0, lineWidth, 5);
        this._hpLine.fill({color});
    }

}

export {
    HpLineView
}