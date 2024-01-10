import { BaseHTMLView } from "@view/base/baseHTMLView";
import malesSearchTmpl from './malesSearchTmpl.html';
import { MalesListView } from "./malesListView";

class MalesSearchView extends BaseHTMLView {

    constructor(el) {
        super(el);
        this._render();

        this._searchBtn.addEventListener('click', this._onSearchBtnClick.bind(this));
    }

    get selectedMale() {
        return this._malesList.selectedMale;
    }

    reset() {
        this._malesList.reset();
    }

    _render() {
        this._el.innerHTML = malesSearchTmpl;

        this._searchBtn = this._el.querySelector('[data-search-btn]');
        this._malesList = new MalesListView(this._el.querySelector('[data-males-list]'));
    }

    _onSearchBtnClick() {
        this.$domainFacade.searchNuptialMales().then((nuptialMales) => {
            this._malesList.setMales(nuptialMales);
        });
    }

}

export {
    MalesSearchView
}