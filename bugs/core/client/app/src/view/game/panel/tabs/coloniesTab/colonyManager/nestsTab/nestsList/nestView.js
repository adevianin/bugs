import { BaseHTMLView } from "@view/base/baseHTMLView";
import nestTmpl from './nestTmpl.html';

class NestView extends BaseHTMLView {

    constructor(el, nest) {
        super(el);
        this._nest = nest;

        this._render();

        this._el.addEventListener('click', this._onClick.bind(this));
    } 

    toggleSelected(isSelected) {
        this._el.classList.toggle('colony-manager__nest_item--selected', isSelected);
    }

    _render() {
        this._el.innerHTML = nestTmpl;
        this._el.classList.add('colony-manager__nest_item');

        this._el.querySelector('[data-nest-name]').innerHTML = this._nest.name + `(${this._nest.id})`;
    }

    _onClick() {
        this.events.emit('click');
    }

}

export {
    NestView
}