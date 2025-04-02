import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';
import maleSelectorTmpl from './maleSelectorTmpl.html';
import { MaleProfileView } from "./maleProfileView";

class MaleSelectorView extends BaseGameHTMLView {

    constructor(el) {
        super(el);
        this._males = this.$domain.getMyNuptialMales();

        this._render();

        this.$domain.events.on('nuptialMalesChanged', this._onNuptialMalesChanged.bind(this));
        this._nextMaleBtn.addEventListener('click', this._onNextMaleBtnClick.bind(this));
        this._prevMaleBtn.addEventListener('click', this._onPrevMaleBtnClick.bind(this));
    }

    get selectedMale() {
        if (this._males.length == 0) {
            return null;
        }

        return this._males[this._selectedMaleIndex];
    }

    _render() {
        this._el.innerHTML = maleSelectorTmpl;

        this._malesPlaceholder = this._el.querySelector('[data-males-place-holder]');
        this._malesEl = this._el.querySelector('[data-males]');
        this._nextMaleBtn = this._el.querySelector('[data-next-btn]');
        this._prevMaleBtn = this._el.querySelector('[data-previous-btn]');
        this._maleProfile = new MaleProfileView(this._el.querySelector('[data-male-profile]'));

        this._renderMales();
    }

    _renderMales() {
        if (this._males.length > 0) {
            this._renderEmptyState(false);
            this._selectMale(0);
            this._renderChoosingMaleBtnsStatus();
        } else {
            this._renderEmptyState(true);
        }
    }

    _renderEmptyState(isEmpty) {
        this._malesPlaceholder.classList.toggle('g-hidden', !isEmpty);
        this._malesEl.classList.toggle('g-hidden', isEmpty);
    }

    _renderChoosingMaleBtnsStatus() {
        this._nextMaleBtn.disabled = this._selectedMaleIndex + 1 == this._males.length;
        this._prevMaleBtn.disabled = this._selectedMaleIndex == 0;
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

    _onNuptialMalesChanged(males) {
        this._males = males;
        this._renderMales();
    }

}

export {
    MaleSelectorView
}