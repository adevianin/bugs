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
import { NotificationIndicatorView } from './tabs/notificationsTab/indicator/notificationIndicatorView';
import { HelpTabView } from './tabs/helpTab/helpTabView';
import { isMobileCheck } from '@utils/isMobileCheck';
import '@view/panel/icons/mainTabSwitcherIcons/breedingIcon.png';
import '@view/panel/icons/mainTabSwitcherIcons/coloniesIcon.png';
import '@view/panel/icons/mainTabSwitcherIcons/specieIcon.png';
import '@view/panel/icons/mainTabSwitcherIcons/notificationsIcon.png';
import '@view/panel/icons/mainTabSwitcherIcons/ratingIcon.png';
import '@view/panel/icons/mainTabSwitcherIcons/accountIcon.png';
import '@view/panel/icons/mainTabSwitcherIcons/helpIcon.png';

class PanelView extends BaseGameHTMLView {

    static PANEL_START_HEIGHT = 420;
    static PANEL_START_HEIGHT_SMALL = 220;

    constructor(el) {
        super(el);
        this._onMouseMoveBound = this._onMouseMove.bind(this);
        this._onMouseUpBound = this._onMouseUp.bind(this);

        this._render();

        this.$eventBus.on('nestManageRequest', this._onNestManageRequest.bind(this));
        this.$eventBus.on('help', this._onHelpRequest.bind(this));
        this._handler.addEventListener('mousedown', this._onHandlerMousedown.bind(this));
        this._handler.addEventListener('touchstart', this._onHandlerMousedown.bind(this));
    }

    get _height() {
        return parseInt(this._el.style.height);
    }

    set _height(val) {
        this._el.style.height = val + 'px';
    }

    _determinePanelStartHeight() {
        if (isMobileCheck()) {
            return PanelView.PANEL_START_HEIGHT_SMALL;
        } else {
            return PanelView.PANEL_START_HEIGHT;
        }
    }

    _render() {
        this._el.classList.add('panel');
        this._height = this._determinePanelStartHeight();
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
        this._helpTab = new HelpTabView(this._el.querySelector('[data-help-tab]'));

        this._tabSwitcher = new TabSwitcher(this._el.querySelector('[data-tab-switcher]'), 'panel', [
            { name: 'breeding', label: '', tab: this._nuptialFlightTab, activatorClass: 'panel__breeding-tab-activator' },
            { name: 'colonies', label: '', tab: this._coloniesTab, activatorClass: 'panel__colonies-tab-activator' },
            { name: 'specie_builder', label: '', tab: this._specieBuildertTab, activatorClass: 'panel__specie-tab-activator' },
            { name: 'notifications', label: '', tab: this._notificationsTab, activatorClass: 'panel__notifications-tab-activator' },
            { name: 'rating', label: '', tab: this._ratingTab, activatorClass: 'panel__rating-tab-activator' },
            { name: 'user', label: '', tab: this._userTab, activatorClass: 'panel__user-tab-activator' },
            { name: 'help', label: '', tab: this._helpTab, activatorClass: 'panel__help-tab-activator' }
        ]);
    }

    _onNestManageRequest(nestId) {
        let nest = this.$domain.myState.getNestById(nestId);
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
        let cursorY;
        if (e.touches) {
            cursorY = e.touches[0].clientY;
        } else {
            cursorY = e.clientY;
        }
        if (cursorY < 0) {
            cursorY = 0;
        }
        let minHeight = this._handlerHeight;
        let panelClientRect = this._el.getBoundingClientRect();
        let panelTop = panelClientRect.top;
        let diff = panelTop - cursorY;
        let newHeight = parseInt(this._height) + diff + parseInt(this._handlerHeight / 2);
        window.getSelection().removeAllRanges();
        if (newHeight < minHeight) {
            newHeight = minHeight;
        }
        this._height = newHeight;
    }

    _onMouseUp(e) {
        document.removeEventListener('mousemove', this._onMouseMoveBound);
        document.removeEventListener('mouseup', this._onMouseUpBound);
        document.removeEventListener('touchmove', this._onMouseMoveBound);
        document.removeEventListener('touchend', this._onMouseUpBound);
    }

    _onHelpRequest(sectionId) {
        this._tabSwitcher.activateTab('help');
        this._helpTab.showSection(sectionId);
    }

}

export {
    PanelView
}