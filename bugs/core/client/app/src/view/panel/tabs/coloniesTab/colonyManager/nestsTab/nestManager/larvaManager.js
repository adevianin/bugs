import larvaTmpl from './larva.html';
import larvaManagerTmpl from './larvaManager.html';
import { BaseHTMLView } from '@view/base/baseHTMLView';
import { antTypesLabels } from '@view/labels/antTypesLabels';

class LarvaManager extends BaseHTMLView {

    constructor(el) {
        super(el);

        this._render();

        this._addNewLarvaBtnEl.addEventListener('click', this._onAddLarvaBtnClick.bind(this));
    }

    manageNest(nest) {
        if (this._nest) {
            this._stopListenNest();
        }

        this._nest = nest;
        this._listenNest();

        this._renderLarvae();
        this._toggleAddingNewLarva(this._nest.canAddLarva());
    }

    _listenNest() {
        this._unbindLarvaeChangedListener = this._nest.on('larvaeChanged', this._onLarvaeChanged.bind(this));
    }

    _stopListenNest() {
        this._unbindLarvaeChangedListener();
    }

    _render() {
        this._el.innerHTML = larvaManagerTmpl;

        this._larvaeListEl = this._el.querySelector('[data-larvae-list]');
        this._addingNewLarvaEl = this._el.querySelector('[data-adding-new-larva]');
        this._newLarvaTypeSelectEl = this._el.querySelector('[data-new-larva-type-select]');
        this._addNewLarvaBtnEl = this._el.querySelector('[data-add-new-larva-btn]');
        this._isQueenInsideIndicatorEl = this._el.querySelector('[data-is-queen-inside]');

        this._renderLarvaTypeSelector();
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