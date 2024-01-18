import { BaseHTMLView } from "@view/panel/base/baseHTMLView";
import colonyTmpl from './colony.html';

class ColonyView extends BaseHTMLView {

    constructor(el, colony) {
        super(el)
        this._colony = colony;

        this._render();

        this._el.addEventListener('click', this._onClick.bind(this));
    }

    toggleSelect(isSelected) {
        this._colonyEl.classList.toggle('colonies-list__colony--selected', isSelected);
    }

    _render() {
        this._el.innerHTML = colonyTmpl;
        this._el.querySelector('[data-colony-id]').innerHTML = this._colony.id;
        this._colonyEl = this._el.querySelector('[data-colony]');
    }

    _onClick() {
        this.events.emit('click');
    }

}

export {
    ColonyView
}