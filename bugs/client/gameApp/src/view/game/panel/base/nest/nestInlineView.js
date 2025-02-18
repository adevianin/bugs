import { BaseHTMLView } from "@view/base/baseHTMLView";

class NestInlineView extends BaseHTMLView {

    constructor(el, nest) {
        super(el);
        this._nest = nest;

        this._renderNest();
    }

    get value() {
        return this._nest;
    }

    set value(nest) {
        this._nest = nest;
        this._renderNest();
    }

    _renderNest() {
        this._el.innerHTML = this._nest ? this._nest.name : this.$messages.not_specified;
    }

}

export {
    NestInlineView
}