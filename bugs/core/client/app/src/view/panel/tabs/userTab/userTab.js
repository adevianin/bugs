import { BaseHTMLView } from '@view/panel/base/baseHTMLView';
import userTabTmpl from './userTabTmpl.html';

class UserTab extends BaseHTMLView {

    constructor(el) {
        super(el);

        this._render();

        this.$domainFacade.events.on('userLogin', this._renderState.bind(this));
        this.$domainFacade.events.on('userLogout', this._renderState.bind(this));
        this._userLogoutBtnEl.addEventListener('click', this._onUserLogoutBtnClick.bind(this));
    }

    _render() {
        this._el.innerHTML = userTabTmpl;

        this._userNameEl = this._el.querySelector('[data-username]');
        this._userLogoutBtnEl = this._el.querySelector('[data-logout-btn]');

        this._renderState();
    }

    _renderState() {
        let isLoggedIn = UserTab.domainFacade.isLoggedIn();

        if (isLoggedIn) {
            let user = UserTab.domainFacade.getUserData();
            this._userNameEl.innerHTML = user.username;
        }
    }

    _onUserLogoutBtnClick() {
        UserTab.domainFacade.logout();
    }

}

export {
    UserTab
}