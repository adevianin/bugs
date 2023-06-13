import './styles.css'

import panelTmpl from './template.html';
import { BaseHTMLView } from '../base/baseHTMLView';
import { OperationsPanel } from './operations/operationsPanel';

class PanelView extends BaseHTMLView {

    constructor(el) {
        super();
        this._el = el;

        this._render();
        this._renderState();

        PanelView.domainFacade.events.on('loginStatusChanged', this._renderState.bind(this));
        this._userLogoutBtnEl.addEventListener('click', this._onUserLogoutBtnClick.bind(this));
    }

    _render() {
        this._el.innerHTML = panelTmpl;

        this._userNameEl = this._el.querySelector('[data-username]');
        this._userLogoutBtnEl = this._el.querySelector('[data-logout-btn]');

        new OperationsPanel(this._el.querySelector('[data-operations-panel]'));
    }

    _renderState() {
        let isLoggedIn = PanelView.domainFacade.isLoggedIn();

        if (isLoggedIn) {
            let user = PanelView.domainFacade.getUserData();
            this._userNameEl.innerHTML = user.username;
        }
    }

    _onUserLogoutBtnClick() {
        PanelView.domainFacade.logout();
    }
}

export {
    PanelView
}