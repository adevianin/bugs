import { BaseHTMLView } from "../../base/baseHTMLView"
import tmpl from './template.html';

class OperationsPanel extends BaseHTMLView {
    
    constructor(el) {
        super();
        this._el = el;

        this._render();

        this._addNewTownBtn.addEventListener('click', this._onAddNewTownClick.bind(this));
    }

    _render() {
        this._el.innerHTML = tmpl;

        this._addNewTownBtn = this._el.querySelector('[data-add-new-town]');
    }

    _onAddNewTownClick() {
        OperationsPanel.domainFacade.buildNewTown({
            x: 1000,
            y: 500
        })
    }
}

export {
    OperationsPanel
}