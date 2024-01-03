import './style.css';
import { BaseHTMLView } from "@view/base/baseHTMLView";
import queenManagerTmpl from './queenManagerTmpl.html';

class QueenManagerView extends BaseHTMLView {

    constructor(el) {
        super(el);

        this._render();
    }

    manageQueen(queen) {
        this._queen = queen;

        this._renderQueen();
    }

    _render() {
        this._el.innerHTML = queenManagerTmpl;
    }

    _renderQueen() {
        this._el.querySelector('[data-queen-name]').innerHTML = this._queen.id;
    }
}

export {
    QueenManagerView
}