import * as PIXI from 'pixi.js';
import { BaseGraphicView } from "@view/base/baseGraphicView";

class BorderView extends BaseGraphicView {

    constructor(container) {
        super();
        this._container = container;

        this._render();
    }

    activate() {
        this._container.renderable = true;
    }

    deactivate() {
        this._container.renderable = false;
    }

    _render() {
        this._container.renderable = false;
        this._renderBorder();

        this.$pixiApp.ticker.add(this._checkIfNeededRerenderBorder.bind(this));
    }

    _renderBorder() {
        this._clearBorder();
        this._size = {
            width: this.$pixiApp.renderer.width,
            height: this.$pixiApp.renderer.height
        }
        let margin = 3;
        this._border = new PIXI.Graphics();
        this._container.addChild(this._border);
        this._border.setStrokeStyle({
            color: 0xff0000,
            width: 4,
            alignment: 0.5
        });
        this._border.moveTo(margin, margin);
        this._border.lineTo(this._size.width - margin, margin);
        this._border.lineTo(this._size.width - margin, this._size.height - margin);
        this._border.lineTo(margin, this._size.height - margin);
        this._border.lineTo(margin, margin);
        this._border.stroke();
    }

    _clearBorder() {
        if (this._border) {
            this._container.removeChild(this._border);
            this._border = null;
        }
    }

    _checkIfNeededRerenderBorder() {
        if (this._container.renderable) { // if activated
            if (this._size.width != this.$pixiApp.renderer.width || this._size.height != this.$pixiApp.renderer.height) {
                this._renderBorder();
            }
        }
    }

    

}

export {
    BorderView
}