import larvaTmpl from './larva.html';
import larvaManagerTmpl from './larvaManager.html';
import { BaseHTMLView } from '../../base/baseHTMLView';
import { antTypesLabels } from '../../labels/antTypesLabels';

class LarvaManager extends BaseHTMLView {

    constructor(el, nest) {
        super(el);
        this._nest = nest;
        this._myQueen = LarvaManager.domainFacade.findMyQueen();

        this._render();

        this._addNewLarvaBtnEl.addEventListener('click', this._onAddLarvaBtnClick.bind(this));
        this._unbindLarvaeChangedListener = this._nest.on('larvaeChanged', this._onLarvaeChanged.bind(this));
        this._unbindQueenLocatedInNestListener = this._myQueen.on('locatedInNestChanged', this._renderIsQueenInNest.bind(this));
    }

    remove() {
        this._unbindLarvaeChangedListener();
        this._unbindQueenLocatedInNestListener();
    }

    _render() {
        this._el.innerHTML = larvaManagerTmpl;

        this._larvaeListEl = this._el.querySelector('[data-larvae-list]');
        this._addingNewLarvaEl = this._el.querySelector('[data-adding-new-larva]');
        this._newLarvaTypeSelectEl = this._el.querySelector('[data-new-larva-type-select]');
        this._addNewLarvaBtnEl = this._el.querySelector('[data-add-new-larva-btn]');
        this._isQueenInsideIndicatorEl = this._el.querySelector('[data-is-queen-inside]');

        this._renderLarvae();
        this._toggleAddingNewLarva(this._nest.canAddLarva());
        this._renderLarvaTypeSelector();
        this._renderIsQueenInNest();
    }

    _renderLarvae() {
        this._larvaeListEl.innerHTML = '';
        let tempEl = document.createElement('div');
        this._nest.larvae.forEach(larva => {
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

    _renderIsQueenInNest() {
        let isQueenInNest = this._myQueen.locatedInNestId == this._nest.id;
        if (isQueenInNest) {
            this._addNewLarvaBtnEl.removeAttribute('disabled');
        } else {
            this._addNewLarvaBtnEl.setAttribute('disabled', '');
        }

        this._isQueenInsideIndicatorEl.innerHTML = isQueenInNest ? '+' : '-';
        
    }

    _onAddLarvaBtnClick() {
        let antType = this._newLarvaTypeSelectEl.value;
        this._nest.addNewLarva(antType);
    }

    _onLarvaeChanged() {
        this._renderLarvae();
        this._toggleAddingNewLarva(this._nest.canAddLarva());
    }

}

export {
    LarvaManager
}