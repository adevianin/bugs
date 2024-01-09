import { BaseHTMLView } from "@view/base/baseHTMLView";
import malesSearchTmpl from './malesSearchTmpl.html';

class MalesSearchView extends BaseHTMLView {

    constructor(el) {
        super(el);
        this._render();

        this._searchBtn.addEventListener('click', this._onSearchBtnClick.bind(this));
    }

    _render() {
        this._el.innerHTML = malesSearchTmpl;

        this._searchBtn = this._el.querySelector('[data-search-btn]');
    }

    _onSearchBtnClick() {
        this.$domainFacade.generateNuptialMales();
    }

}

export {
    MalesSearchView
}