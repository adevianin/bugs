import larvaTmpl from './larva.html';
import larvaManagerTmpl from './larvaManager.html';
import { BaseHTMLView } from '../../base/baseHTMLView';
import { antTypesLabels } from '../../labels/antTypesLabels';

class LarvaManager extends BaseHTMLView {

    constructor(el, town) {
        super();
        this._el = el;
        this._town = town;
        this._myQueen = LarvaManager.domainFacade.findMyQueen();

        this._render();

        this._addNewLarvaBtnEl.addEventListener('click', this._onAddLarvaBtnClick.bind(this));
        this._unbindLarvaeChangedListener = this._town.on('larvaeChanged', this._onLarvaeChanged.bind(this));
        this._unbindQueenLocatedInTownListener = this._myQueen.on('locatedInTownChanged', this._renderIsQueenInTown.bind(this));
    }

    remove() {
        super.remove();
        this._unbindLarvaeChangedListener();
        this._unbindQueenLocatedInTownListener();
    }

    _render() {
        this._el.innerHTML = larvaManagerTmpl;

        this._larvaeListEl = this._el.querySelector('[data-larvae-list]');
        this._addingNewLarvaEl = this._el.querySelector('[data-adding-new-larva]');
        this._newLarvaTypeSelectEl = this._el.querySelector('[data-new-larva-type-select]');
        this._addNewLarvaBtnEl = this._el.querySelector('[data-add-new-larva-btn]');
        this._isQueenInsideIndicatorEl = this._el.querySelector('[data-is-queen-inside]');

        this._renderLarvae();
        this._toggleAddingNewLarva(this._town.canAddLarva());
        this._renderLarvaTypeSelector();
        this._renderIsQueenInTown();
    }

    _renderLarvae() {
        this._larvaeListEl.innerHTML = '';
        let tempEl = document.createElement('div');
        this._town.larvae.forEach(larva => {
            tempEl.innerHTML = larvaTmpl;
            tempEl.querySelector('[data-type]').innerHTML = antTypesLabels[larva.antType];
            tempEl.querySelector('[data-progress]').innerHTML = larva.progress;
            this._larvaeListEl.append(tempEl.firstChild);
        });
    }

    _toggleAddingNewLarva(isEnabled) {
        this._addingNewLarvaEl.classList.toggle('hidden', !isEnabled);
    }

    _renderLarvaTypeSelector() {
        for (let antType in antTypesLabels) {
            let optionEl = document.createElement('option');
            optionEl.innerHTML = antTypesLabels[antType];
            optionEl.value = antType;
            this._newLarvaTypeSelectEl.append(optionEl);
        }
    }

    _renderIsQueenInTown() {
        let isQueenInTown = this._myQueen.locatedInTownId == this._town.id;
        if (isQueenInTown) {
            this._addNewLarvaBtnEl.removeAttribute('disabled');
        } else {
            this._addNewLarvaBtnEl.setAttribute('disabled', '');
        }

        this._isQueenInsideIndicatorEl.innerHTML = isQueenInTown ? '+' : '-';
        
    }

    _onAddLarvaBtnClick() {
        let antType = this._newLarvaTypeSelectEl.value;
        this._town.addNewLarva(antType);
    }

    _onLarvaeChanged() {
        this._renderLarvae();
        this._toggleAddingNewLarva(this._town.canAddLarva());
    }

}

export {
    LarvaManager
}