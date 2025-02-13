import { EventEmitter } from "@utils/eventEmitter";
import { BaseView } from "./baseView";

class BaseHTMLView extends BaseView {

    constructor(el) {
        super();
        this._el = el;
        this.events = new EventEmitter();
    }

    get el() {
        return this._el;
    }

    toggle(isEnabled) {
        this._el.classList.toggle('hidden', !isEnabled);
    }

    remove() {
        this._el.remove();
        this.events.removeAllListeners();
    }
}

export {
    BaseHTMLView
}