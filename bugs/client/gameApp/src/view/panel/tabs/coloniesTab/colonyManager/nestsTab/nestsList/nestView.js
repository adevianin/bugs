import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';
import nestTmpl from './nestTmpl.html';
import { VIEW_SETTINGS } from '@view/viewSettings';

class NestView extends BaseGameHTMLView {

    constructor(el, nest) {
        super(el);
        this._nest = nest;

        this._render();

        this._el.addEventListener('click', this._onClick.bind(this));
        this._stopListenNameChange = this._nest.on('nameChanged', this._onNameChanged.bind(this));
    } 

    toggleSelected(isSelected) {
        this._el.classList.toggle('colony-manager__nest_item--selected', isSelected);
    }

    remove() {
        super.remove();
        this._stopListenNameChange();
    }

    _render() {
        this._el.innerHTML = nestTmpl;
        this._el.classList.add('colony-manager__nest_item');

        this._nameEl = this._el.querySelector('[data-nest-name]');

        this._renderName();
    }

    _renderName() {
        let nestId = VIEW_SETTINGS.renderNestId ? `(${this._nest.id})` : '';
        this._nameEl.innerHTML = this._nest.name + nestId;
    }

    _onClick() {
        this.events.emit('click');
    }

    _onNameChanged() {
        this._renderName();
    }

}

export {
    NestView
}