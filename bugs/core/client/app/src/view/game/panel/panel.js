import './styles.css'

import panelTmpl from './panelTmpl.html';
import { BaseHTMLView } from '@view/base/baseHTMLView';
import { UserTab } from './tabs/userTab/userTab';
import { ColoniesTabView } from './tabs/coloniesTab';
import { TabSwitcher } from './base/tabSwitcher';
import { NuptialFlightTabView } from './tabs/nuptialFlightTab';
import { SpecieBuilderTabView } from './tabs/specieBuilderTab';

class Panel extends BaseHTMLView {

    constructor(el) {
        super(el);

        this.$eventBus.on('nestManageRequest', this._onNestManageRequest.bind(this));
    }

    turnOn() {
        this.toggle(true);
        this._renderTabViews();
    }

    turnOff() {
        this.toggle(false);
        if (this._tabSwitcher) {
            this._tabSwitcher.remove();
            this._tabSwitcher = null;
        }
    }

    _renderTabViews() {
        this._el.innerHTML = panelTmpl;

        this._userTab = new UserTab(this._el.querySelector('[data-user-tab]'));
        this._coloniesTab = new ColoniesTabView(this._el.querySelector('[data-colonies-tab]'));
        this._nuptialFlightTab = new NuptialFlightTabView(this._el.querySelector('[data-nuptial-flight-tab]'));
        this._specieBuildertTab = new SpecieBuilderTabView(this._el.querySelector('[data-specie-builder-tab]'));

        this._tabSwitcher = new TabSwitcher(this._el.querySelector('[data-tab-switcher]'), [
            { name: 'user', label: 'Користувач', tab: this._userTab },
            { name: 'colonies', label: 'Колонії', tab: this._coloniesTab },
            { name: 'nuptial_flight', label: 'Шлюбний політ', tab: this._nuptialFlightTab },
            { name: 'specie_builder', label: 'Вид', tab: this._specieBuildertTab },
        ]);
    }

    _onNestManageRequest(nest) {
        this._tabSwitcher.activateTab('colonies');
        this._coloniesTab.showNestManagerFor(nest);
    }

}

export {
    Panel
}