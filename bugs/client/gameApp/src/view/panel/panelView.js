import './styles.css'

import panelTmpl from './panelTmpl.html';
import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';
import { UserTab } from './tabs/userTab/userTab';
import { ColoniesTabView } from './tabs/coloniesTab';
import { TabSwitcher } from './base/tabSwitcher';
import { NuptialFlightTabView } from './tabs/nuptialFlightTab';
import { SpecieBuilderTabView } from './tabs/specieBuilderTab';
import { NotificationsTabView } from './tabs/notificationsTab';
import { RatingTabView } from './tabs/ratingTab';
import { GAME_MESSAGE_IDS } from '@messages/messageIds';
import { NotificationIndicatorView } from './tabs/notificationsTab/indicator/notificationIndicatorView';

class PanelView extends BaseGameHTMLView {

    constructor(el) {
        super(el);
        this._onMouseMoveBound = this._onMouseMove.bind(this);
        this._onMouseUpBound = this._onMouseUp.bind(this);

        this._render();

        this.$eventBus.on('nestManageRequest', this._onNestManageRequest.bind(this));
        this._handler.addEventListener('mousedown', this._onHandlerMousedown.bind(this));
        this._handler.addEventListener('touchstart', this._onHandlerMousedown.bind(this));
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

        let notificationTabActivatorEl = this._tabSwitcher.getActivatorForTab('notifications');
        this._notificationIndicatorView = new NotificationIndicatorView(notificationTabActivatorEl);
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
            { name: 'breeding', label: this.$mm.get(GAME_MESSAGE_IDS.TAB_BREEDING), tab: this._nuptialFlightTab },
            { name: 'colonies', label: this.$mm.get(GAME_MESSAGE_IDS.TAB_COLONIES), tab: this._coloniesTab },
            { name: 'specie_builder', label: this.$mm.get(GAME_MESSAGE_IDS.TAB_SPECIE), tab: this._specieBuildertTab },
            { name: 'notifications', label: this.$mm.get(GAME_MESSAGE_IDS.TAB_NOTIFICATIONS), tab: this._notificationsTab },
            { name: 'rating', label: this.$mm.get(GAME_MESSAGE_IDS.TAB_RATING), tab: this._ratingTab },
            { name: 'user', label: this.$mm.get(GAME_MESSAGE_IDS.TAB_ACCOUNT), tab: this._userTab }
        ]);
    }

    _onNestManageRequest(nest) {
        this._tabSwitcher.activateTab('colonies');
        this._coloniesTab.showNestManagerFor(nest);
    }

    _onHandlerMousedown() {
        document.addEventListener('mousemove', this._onMouseMoveBound);
        document.addEventListener('mouseup', this._onMouseUpBound);
        document.addEventListener('touchmove', this._onMouseMoveBound);
        document.addEventListener('touchend', this._onMouseUpBound);
    }

    _onMouseMove(e) {
        let minHeight = this._handlerHeight;
        let panelClientRect = this._el.getBoundingClientRect();
        let cursorY;
        if (e.touches) {
            cursorY = e.touches[0].clientY;
        } else {
            cursorY = e.clientY;
        }
        let panelTop = panelClientRect.top;
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
        document.removeEventListener('touchmove', this._onMouseMoveBound);
        document.removeEventListener('touchend', this._onMouseUpBound);
    }

}

export {
    PanelView
}