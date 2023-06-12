import { BaseHTMLView } from "../../base/baseHTMLView"
import tmpl from './template.html';

class OperationsPanel extends BaseHTMLView {
    
    constructor(el) {
        super();
        this._el = el;

        this._render();

        this._addNewNestBtn.addEventListener('click', this._onAddNewNestClick.bind(this));
    }

    _render() {
        this._el.innerHTML = tmpl;

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
    OperationsPanel
}