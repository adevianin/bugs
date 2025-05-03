import { BaseGameHTMLView } from "@view/base/baseGameHTMLView";

class NestOptionView extends BaseGameHTMLView {

    constructor(el, nest) {
        super(el);
        this._nest = nest;

        this._render();

        this._stopListenNameChange = this._nest.on('nameChanged', this._onNameChanged.bind(this));
    }

    remove() {
        this._stopListenNameChange();
        super.remove();
    }

    _render() {
        this._renderName();
    }

    _renderName() {
        this._el.innerHTML = this._nest.name;
    }

    _onNameChanged() {
        this._renderName();
    }
}

export {
    NestOptionView
}