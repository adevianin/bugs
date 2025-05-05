import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';
import { VIEW_SETTINGS } from '@view/viewSettings';

class NestView extends BaseGameHTMLView {

    constructor(el, nest) {
        super(el);
        this._nest = nest;

        this._render();

        this._stopListenNameChange = this._nest.on('nameChanged', this._onNameChanged.bind(this));
    }

    remove() {
        super.remove();
        this._stopListenNameChange();
    }

    _render() {
        this._el.value = this._nest.id;
        this._renderName();
    }

    _renderName() {
        let nestId = VIEW_SETTINGS.renderNestId ? `(${this._nest.id})` : '';
        this._el.innerHTML = this._nest.name + nestId;
    }

    _onNameChanged() {
        this._renderName();
    }

}

export {
    NestView
}