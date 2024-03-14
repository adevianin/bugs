import './style.css';
import { BaseHTMLView } from "@view/panel/base/baseHTMLView";
import nuptialFlightTabTmpl from './nuptialFlightTab.html';
import { QueensListView } from "./queensList"; 
import { QueenManagerView } from "./queenManager";

class NuptialFlightTabView extends BaseHTMLView {

    constructor(el) {
        super(el);

        this._render();
        this._queensList.events.on('selectedQueenChanged', this._manageSelectedQueen.bind(this));
    }

    remove() {
        super.remove();
        this._queensList.remove();
        this._queenManager.remove();
    }

    _render() {
        this._el.innerHTML = nuptialFlightTabTmpl;
        this._queensList = new QueensListView(this._el.querySelector('[data-queens-list]'));
        this._queenManager = new QueenManagerView(this._el.querySelector('[data-queen-manager]'));
        if (this._queensList.selectedQueen) {
            this._manageSelectedQueen();
        }
    }

    _manageSelectedQueen() {
        this._queenManager.manageQueen(this._queensList.selectedQueen);
    }
}

export {
    NuptialFlightTabView
}