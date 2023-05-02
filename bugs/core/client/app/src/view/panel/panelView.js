import './styles.css'

import panelTmpl from './template.html';

class PanelView {

    constructor(el, domainFacade) {
        this._el = el;
        this._domainFacade = domainFacade;

        this._render();
        this._renderState();

        this._domainFacade.events.on('loginStatusChanged', this._renderState.bind(this));
        this._userLogoutBtnEl.addEventListener('click', this._onUserLogoutBtnClick.bind(this));
    }

    _render() {
        this._el.innerHTML = panelTmpl;

        this._userNameEl = this._el.querySelector('[data-username]');
        this._userLogoutBtnEl = this._el.querySelector('[data-logout-btn]');
    }

    _renderState() {
        let isLoggedIn = this._domainFacade.isLoggedIn();

        this._toggle(isLoggedIn);

        if (isLoggedIn) {
            let user = this._domainFacade.getUserData();
            this._userNameEl.innerHTML = user.username;
        }
    }

    _toggle(isEnabled) {
        this._el.classList.toggle('hidden', !isEnabled);
    }

    _onUserLogoutBtnClick() {
        this._domainFacade.logout();
    }
}

export {
    PanelView
}