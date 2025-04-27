import { BaseView } from "./baseView";

class BaseHTMLView extends BaseView {

    constructor(el) {
        super();
        this._el = el;
    }

    get el() {
        return this._el;
    }

    toggle(isEnabled) {
        this._el.classList.toggle('g-hidden', !isEnabled);
    }

    isVisible() {
        return this._el.closest('.g-hidden') === null;
    }

    remove() {
        this._el.remove();
        super.remove();
    }

}

export {
    BaseHTMLView
}