import './styles.css'

import panelTmpl from './panelTmpl.html';
import { BaseHTMLView } from '@view/base/baseHTMLView';
import { UserTab } from './tabs/userTab/userTab';
import { ColoniesTabView } from './tabs/coloniesTab';
import { TabSwitcher } from './base/tabSwitcher';
import { NuptialFlightTabView } from './tabs/nuptialFlightTab';
import { SpecieBuilderTabView } from './tabs/specieBuilderTab';
import { ClimateTabView } from './tabs/climateTab';
import { NotificationsTabView } from './tabs/notificationsTab';
import { RatingTabView } from './tabs/ratingTab';

class Panel extends BaseHTMLView {

    constructor(el) {
        super(el);

        this._render();

        this.$eventBus.on('nestManageRequest', this._onNestManageRequest.bind(this));
        this.$eventBus.on('bornNewAntaraBtnClick', this._onBornNewAntaraBtnClick.bind(this));
    }

    _render() {
        this._renderTabViews();
    }

    _renderTabViews() {
        this._el.innerHTML = panelTmpl;

        this._userTab = new UserTab(this._el.querySelector('[data-user-tab]'));
        this._coloniesTab = new ColoniesTabView(this._el.querySelector('[data-colonies-tab]'));
        this._nuptialFlightTab = new NuptialFlightTabView(this._el.querySelector('[data-nuptial-flight-tab]'));
        this._specieBuildertTab = new SpecieBuilderTabView(this._el.querySelector('[data-specie-builder-tab]'));
        this._climateTab = new ClimateTabView(this._el.querySelector('[data-climate-tab]'));
        this._notificationsTab = new NotificationsTabView(this._el.querySelector('[data-notifications-tab]'));
        this._ratingTab = new RatingTabView(this._el.querySelector('[data-rating-tab]'));

        this._tabSwitcher = new TabSwitcher(this._el.querySelector('[data-tab-switcher]'), [
            { name: 'user', label: 'Користувач', tab: this._userTab },
            { name: 'colonies', label: 'Колонії', tab: this._coloniesTab },
            { name: 'nuptial_flight', label: 'Шлюбний політ', tab: this._nuptialFlightTab },
            { name: 'specie_builder', label: 'Вид', tab: this._specieBuildertTab },
            { name: 'climate', label: 'Клімат', tab: this._climateTab },
            { name: 'notifications', label: 'Сповіщення', tab: this._notificationsTab },
            { name: 'rating', label: 'Рейтинг', tab: this._ratingTab },
        ]);
    }

    _onNestManageRequest(nest) {
        this._tabSwitcher.activateTab('colonies');
        this._coloniesTab.showNestManagerFor(nest);
    }

    _onBornNewAntaraBtnClick() {
        this._tabSwitcher.activateTab('nuptial_flight');
    }

}

export {
    Panel
}