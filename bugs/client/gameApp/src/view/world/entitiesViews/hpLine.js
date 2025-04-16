import { BaseGraphicView } from "@view/base/baseGraphicView";
import * as PIXI from 'pixi.js';

class HpLineView extends BaseGraphicView {

    static HP_LINE_HEIGHT = 5;
    static HP_LINE_COLOR_SAFE = 0x00ff00;
    static HP_LINE_COLOR_WARNING = 0xffff00;
    static HP_LINE_COLOR_DANGER = 0xff0000;

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
        this._hpLine.destroy();
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
        let color = HpLineView.HP_LINE_COLOR_SAFE;
        if (hpInPercent < 70) {
            color = HpLineView.HP_LINE_COLOR_WARNING;
        }
        if (hpInPercent < 30) {
            color = HpLineView.HP_LINE_COLOR_DANGER;
        }
        this._hpLine
            .clear()
            .rect(0, 0, lineWidth, HpLineView.HP_LINE_HEIGHT)
            .fill({color})
            .rect(0, 0, hpLineMaxWidth, HpLineView.HP_LINE_HEIGHT)
            .stroke({
                color: HpLineView.HP_LINE_COLOR_SAFE,
                alignment: 1
            })
    }

}

export {
    HpLineView
}