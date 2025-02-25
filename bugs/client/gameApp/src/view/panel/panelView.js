import './styles.css'

import panelTmpl from './panelTmpl.html';
import { BaseHTMLView } from '@view/base/baseHTMLView';
import { UserTab } from './tabs/userTab/userTab';
import { ColoniesTabView } from './tabs/coloniesTab';
import { TabSwitcher } from './base/tabSwitcher';
import { NuptialFlightTabView } from './tabs/nuptialFlightTab';
import { SpecieBuilderTabView } from './tabs/specieBuilderTab';
import { NotificationsTabView } from './tabs/notificationsTab';
import { RatingTabView } from './tabs/ratingTab';

class PanelView extends BaseHTMLView {

    constructor(el) {
        super(el);
        this._onMouseMoveBound = this._onMouseMove.bind(this);
        this._onMouseUpBound = this._onMouseUp.bind(this);

        this._render();

        this.$eventBus.on('nestManageRequest', this._onNestManageRequest.bind(this));
        this.$eventBus.on('bornNewAntaraBtnClick', this._onBornNewAntaraBtnClick.bind(this));
        this._handler.addEventListener('mousedown', this._onHandlerMousedown.bind(this));
    }

    get _height() {
        return parseInt(this._el.style.height);
    }

    set _height(val) {
        this._el.style.height = val + 'px';
    }

    _render() {
        this._el.classList.add('panel');
        this._height = 320;
        this._renderTabViews();
    }

    _renderTabViews() {
        this._el.innerHTML = panelTmpl;

        this._handler = this._el.querySelector('[data-handler]');
        this._handlerHeight = this._handler.getBoundingClientRect().height;

        this._userTab = new UserTab(this._el.querySelector('[data-user-tab]'));
        this._coloniesTab = new ColoniesTabView(this._el.querySelector('[data-colonies-tab]'));
        this._nuptialFlightTab = new NuptialFlightTabView(this._el.querySelector('[data-nuptial-flight-tab]'));
        this._specieBuildertTab = new SpecieBuilderTabView(this._el.querySelector('[data-specie-builder-tab]'));
        this._notificationsTab = new NotificationsTabView(this._el.querySelector('[data-notifications-tab]'));
        this._ratingTab = new RatingTabView(this._el.querySelector('[data-rating-tab]'));

        this._tabSwitcher = new TabSwitcher(this._el.querySelector('[data-tab-switcher]'), 'panel', [
            { name: 'user', label: 'Користувач', tab: this._userTab },
            { name: 'colonies', label: 'Колонії', tab: this._coloniesTab },
            { name: 'nuptial_flight', label: 'Шлюбний політ', tab: this._nuptialFlightTab },
            { name: 'specie_builder', label: 'Вид', tab: this._specieBuildertTab },
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

    _onHandlerMousedown() {
        document.addEventListener('mousemove', this._onMouseMoveBound);
        document.addEventListener('mouseup', this._onMouseUpBound);
    }

    _onMouseMove(e) {
        let minHeight = this._handlerHeight;
        let clientRect = this._el.getBoundingClientRect();
        let cursorY = e.clientY;
        let panelTop = clientRect.top;
        let diff = panelTop - cursorY;
        let newHeight = parseInt(this._el.style.height) + diff;
        window.getSelection().removeAllRanges();
        if (newHeight >= minHeight) {
            this._el.style.height = newHeight + 'px';
            this.$pixiApp.resize();
        }
    }

    _onMouseUp(e) {
        document.removeEventListener('mousemove', this._onMouseMoveBound);
        document.removeEventListener('mouseup', this._onMouseUpBound);
    }

}

export {
    PanelView
}