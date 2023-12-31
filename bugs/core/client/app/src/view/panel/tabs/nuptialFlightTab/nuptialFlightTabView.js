import { BaseHTMLView } from "@view/base/baseHTMLView";
import nuptialFlightTabTmpl from './nuptialFlightTab.html';
import { QueensListView } from "./queensList"; 

class NuptialFlightTabView extends BaseHTMLView {

    constructor(el) {
        super(el);

        this._render();
    }

    _render() {
        this._el.innerHTML = nuptialFlightTabTmpl;
        this._queensList = new QueensListView(this._el.querySelector('[data-queens-list]'));
    }
}

export {
    NuptialFlightTabView
}