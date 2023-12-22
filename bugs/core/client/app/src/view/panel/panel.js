import './styles.css'

import panelTmpl from './panelTmpl.html';
import { BaseHTMLView } from '../base/baseHTMLView';
import { UserTab } from './tabs/userTab/userTab';
import { OperationsTab } from './tabs/operationsTab/operationsTab';
import { ColoniesTabView } from './tabs/coloniesTab';
import { TabSwitcher } from '@view/base/tabSwitcher/tabSwitcher';

class Panel extends BaseHTMLView {

    constructor(el) {
        super(el);

        this.$domainFacade.events.on('worldCleared', this._removeTabViews.bind(this));
        this.$domainFacade.events.on('wholeWorldInited', this._buildTabViews.bind(this));
        if (this.$domainFacade.isWholeWorldInited()) {
            this._buildTabViews();
        }
        this.$eventBus.on('nestManageRequest', this._onNestManageRequest.bind(this));
    }

    _buildTabViews() {
        this._el.innerHTML = panelTmpl;

        this._userTab = new UserTab(this._el.querySelector('[data-user-tab]'));
        this._operationsTab = new OperationsTab(this._el.querySelector('[data-operations-tab]'));
        this._coloniesTab = new ColoniesTabView(this._el.querySelector('[data-colonies-tab]'));

        this._tabSwitcher = new TabSwitcher(this._el.querySelector('[data-tab-switcher]'), [
            { name: 'user', label: 'Користувач', tab: this._userTab },
            { name: 'operations', label: 'Операції', tab: this._operationsTab },
            { name: 'colonies', label: 'Колонії', tab: this._coloniesTab }
        ]);
    }

    _removeTabViews() {
        this._userTab.remove();
        this._operationsTab.remove();
    }

    _onNestManageRequest(nest) {
        this._tabSwitcher.activateTab('colonies');
        this._coloniesTab.showNestManagerFor(nest);
    }

}

export {
    Panel
}