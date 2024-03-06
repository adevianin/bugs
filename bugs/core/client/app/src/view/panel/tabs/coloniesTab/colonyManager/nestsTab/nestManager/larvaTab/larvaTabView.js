import { BaseHTMLView } from "@view/panel/base/baseHTMLView";
import { antTypesLabels } from '@view/panel/base/labels/antTypesLabels';
import larvaTmpl from './larva.html';
import larvaManagerTmpl from './larvaManager.html';

class LarvaTabView extends BaseHTMLView {

    constructor(el) {
        super(el);

        this._render();

    }

    manageNest(nest) {
        if (this._nest) {
            this._stopListenNest();
        }

        this._nest = nest;
        this._listenNest();

        this._renderLarvae();
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
        this._isQueenInsideIndicatorEl = this._el.querySelector('[data-is-queen-inside]');
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

    _onLarvaeChanged() {
        this._renderLarvae();
    }

}

export {
    LarvaTabView
}