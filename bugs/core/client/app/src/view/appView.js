import './appStyles.css';

import { BaseHTMLView } from './base/baseHTMLView';
import { GameView } from './game/gameView';
import { AccountView } from './account/accountView';
import appTmpl from './appTmpl.html';

class AppView extends BaseHTMLView {
    constructor(el) {
        super(el);

        this.$domainFacade.events.on('userLogin', this._onLogin.bind(this));
        this.$domainFacade.events.on('userLogout', this._onLogout.bind(this));
        this.$domainFacade.events.on('initStepDone', this._onInitStepDone.bind(this));

        this._render();
    }

    _render() {
        this._el.innerHTML = appTmpl;

        let accountViewEl = this._el.querySelector('[data-account]');
        this._accountView = new AccountView(accountViewEl);

        let gameEl = this._el.querySelector('[data-game]');
        this._gameView = new GameView(gameEl);

        this._loaderEl = this._el.querySelector('[data-loader]');

        let isLoggedin = this.$domainFacade.isLoggedIn();
        if (isLoggedin) {
            this._renderLoggedInState();
        } else {
            this._renderLoggedOutState();
        }
    }

    _renderLoggedInState() {
        console.log('loggedin');
        this._accountView.toggle(false);
        this._gameView.turnOff();
        this._toggleGameLoader(true);
    }

    _renderLoggedOutState() {
        console.log('loggedout');
        this._accountView.toggle(true);
        this._gameView.turnOff();
        this._toggleGameLoader(false);
    }

    _renderAppInitedState() {
        console.log('inited');
        this._accountView.toggle(false);
        this._gameView.turnOn();
        this._toggleGameLoader(false);
    }

    _toggleGameLoader(isEnabled) {
        this._loaderEl.classList.toggle('hidden', !isEnabled);
    }

    _onLogin() {
        this._renderLoggedInState();
    }

    _onLogout() {
        this._renderLoggedOutState();
    }

    _onInitStepDone() {
        this._renderAppInitedState();
    }
}

export { AppView }