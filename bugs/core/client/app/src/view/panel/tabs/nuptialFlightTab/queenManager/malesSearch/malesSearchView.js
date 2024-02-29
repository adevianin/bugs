import { BaseHTMLView } from "@view/panel/base/baseHTMLView";
import malesSearchTmpl from './malesSearchTmpl.html';
import { NuptialMaleProfileView } from "./nuptialMaleProfileView";

class MalesSearchView extends BaseHTMLView {

    constructor(el) {
        super(el);
        this._males = [];

        this._render();

        this._searchBtn.addEventListener('click', this._onSearchBtnClick.bind(this));
        this._nextMaleBtn.addEventListener('click', this._onNextMaleBtnClick.bind(this));
        this._prevMaleBtn.addEventListener('click', this._onPrevMaleBtnClick.bind(this));
    }

    get selectedMale() {
        if (this._males.length == 0) {
            return null;
        }

        return this._males[this._selectedMaleIndex];
    }

    reset() {
        this._selectedMaleIndex = 0;
        this._males = [];
        this._maleProfile.reset();
    }

    _render() {
        this._el.innerHTML = malesSearchTmpl;

        this._searchBtn = this._el.querySelector('[data-search-btn]');
        this._nextMaleBtn = this._el.querySelector('[data-next-btn]');
        this._prevMaleBtn = this._el.querySelector('[data-previous-btn]');
        this._maleProfile = new NuptialMaleProfileView(this._el.querySelector('[data-male-profile]'));
    }

    _onSearchBtnClick() {
        this.$domainFacade.searchNuptialMales().then((nuptialMales) => {
            this._setMales(nuptialMales);
        });
    }

    _setMales(nuptialMales) {
        this._males = nuptialMales;
        this._selectMale(0);
    }

    _selectMale(index) {
        this._selectedMaleIndex = index;
        this._maleProfile.showMale(this._males[this._selectedMaleIndex]);
        this._renderChoosingMaleBtnsStatus();
    }

    _onNextMaleBtnClick() {
        this._selectMale(this._selectedMaleIndex + 1);
    }

    _onPrevMaleBtnClick() {
        this._selectMale(this._selectedMaleIndex - 1);
    }

    _renderChoosingMaleBtnsStatus() {
        this._nextMaleBtn.disabled = this._selectedMaleIndex + 1 == this._males.length;
        this._prevMaleBtn.disabled = this._selectedMaleIndex == 0;
    }

}

export {
    MalesSearchView
}