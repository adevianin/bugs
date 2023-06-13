import { BaseHTMLView } from "../../../base/baseHTMLView"
import operationTabTmpl from './operationTabTmpl.html';

class OperationsTab extends BaseHTMLView {
    
    constructor(el) {
        super();
        this._el = el;

        this._render();

        this._addNewNestBtn.addEventListener('click', this._onAddNewNestClick.bind(this));
    }

    toggle(isEnabled) {
        this._el.classList.toggle('hidden', !isEnabled);
    }

    _render() {
        this._el.innerHTML = operationTabTmpl;

        this._addNewNestBtn = this._el.querySelector('[data-add-new-nest]');
    }

    _onAddNewNestClick() {
        OperationsPanel.domainFacade.buildNewNest({
            x: 1000,
            y: 500
        })
    }
}

export {
    OperationsTab
}