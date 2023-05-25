import larvaTmpl from './larva.html';
import larvaManagerTmpl from './larvaManager.html';
import { BaseHTMLView } from '../../base/baseHTMLView';
import { antTypesLabels } from '../../labels/antTypesLabels';

class LarvaManager extends BaseHTMLView {

    constructor(el, town) {
        super();
        this._el = el;
        this._town = town;

        this._render();
    }

    _render() {
        this._el.innerHTML = larvaManagerTmpl;
        this._larvaeListEl = this._el.querySelector('[data-larvae-list]');
        this._addingNewLarvaEl = this._el.querySelector('[data-adding-new-larva]');

        this._renderLarvae();
        this._toggleAddingNewLarva(this._town.canAddLarva());
        this._renderLarvaTypeSelector();
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
        let antTypeSelectEl = this._el.querySelector('[data-new-larva-type-select]');
        for (let antType in antTypesLabels) {
            let optionEl = document.createElement('option');
            optionEl.innerHTML = antTypesLabels[antType];
            optionEl.value = antType;
            antTypeSelectEl.append(optionEl);
        }
    }

}

export {
    LarvaManager
}