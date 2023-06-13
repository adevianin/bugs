import './styles.css'

import panelTmpl from './panelTmpl.html';
import { BaseHTMLView } from '../base/baseHTMLView';
import { UserTab } from './tabs/userTab/userTab';
import { OperationsTab } from './tabs/operationsTab/operationsTab';

class Panel extends BaseHTMLView {

    constructor(el) {
        super();
        this._el = el;

        this._render();

        this._el.querySelector('[data-tab-switcher]').addEventListener('change', this._switchTabToSelected.bind(this));
    }

    _render() {
        this._el.innerHTML = panelTmpl;

        this._userTab = new UserTab(this._el.querySelector('[data-user-tab]'));
        this._operationsTab = new OperationsTab(this._el.querySelector('[data-operations-tab]'));

        this._switchTabToSelected();
    }

    _switchTabToSelected() {
        let tabName = this._getTabSwitcherValue();
        
        this._userTab.toggle(tabName == 'user');
        this._operationsTab.toggle(tabName == 'operations');
    }

    _getTabSwitcherValue() {
        let inputs = this._el.querySelectorAll('[data-tab-switcher] input');
        let checkedInputEl = Array.from(inputs).find(input => input.checked);
        return checkedInputEl.value;
    }

}

export {
    Panel
}