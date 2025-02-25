import { BaseHTMLView } from "@view/base/baseHTMLView";

class BorderView extends BaseHTMLView {

    constructor(el) {
        super(el);
        
        this._render();
    }

    _render() {
        this._textEl = document.createElement('div');
        this._textEl.classList.add('app__map-picker-label');
        this._el.appendChild(this._textEl);

        this.deactivate();
    }

    activate(text) {
        this._el.classList.remove('hidden');
        this._textEl.innerHTML = text;
    }

    deactivate() {
        this._el.classList.add('hidden');
    }

}

export {
    BorderView
}