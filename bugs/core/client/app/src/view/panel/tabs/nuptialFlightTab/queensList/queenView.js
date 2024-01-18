import { BaseHTMLView } from "@view/panel/base/baseHTMLView";
import queenTmpl from './queen.html';

class QueenView extends BaseHTMLView {

    constructor(queen) {
        let el = document.createElement('li');
        super(el);
        el.classList.add('queens-list__queen-item');
        this._queen = queen;

        this._render();

        this._el.addEventListener('click', this._onClick.bind(this));
    }

    toggleSelect(isSelected) {
        this._el.classList.toggle('queens-list__queen-item--selected', isSelected);
    }

    _render() {
        this._el.innerHTML = queenTmpl;

        this._el.querySelector('[data-queen-name]').innerHTML = this._queen.id;
    }

    _onClick() {
        this.events.emit('click');
    }
}

export {
    QueenView
}