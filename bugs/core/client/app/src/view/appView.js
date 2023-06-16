import './appStyles.css';

import { WorldView } from './world/worldView';
import { AccountView } from './account/accountView';
import { Panel } from './panel/panel';

class AppView {
    constructor(document, domainFacade) {
        this._document = document;
        this._domainFacade = domainFacade;

        this._domainFacade.events.on('loginStatusChanged', this._renderLoginStatus.bind(this));

        this._render();
    }

    _render() {
        this._renderLoginStatus();

        let worldEl = this._document.querySelector('[data-world]');
        this._worldView = new WorldView(worldEl);

        let accountViewEl = this._document.querySelector('[data-account-view]');
        this._accountView = new AccountView(accountViewEl);

        let panelViewEl = this._document.querySelector('[data-panel]');
        this._panel = new Panel(panelViewEl);
    }

    _renderLoginStatus() {
        let isLoggedin = this._domainFacade.isLoggedIn();
        this._document.querySelector('[data-game-container]').classList.toggle('hidden', !isLoggedin);
    }
}

export { AppView }