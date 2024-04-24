import { BaseHTMLView } from '@view/base/baseHTMLView';
import userTabTmpl from './userTabTmpl.html';

class UserTab extends BaseHTMLView {

    constructor(el) {
        super(el);

        this._render();

        this._userLogoutBtnEl.addEventListener('click', this._onUserLogoutBtnClick.bind(this));
    }

    _render() {
        this._el.innerHTML = userTabTmpl;

        this._userNameEl = this._el.querySelector('[data-username]');
        this._userLogoutBtnEl = this._el.querySelector('[data-logout-btn]');

        this._renderUserData();
    }

    _renderUserData() {
        let user = this.$domainFacade.getUserData();
        this._userNameEl.innerHTML = user.username;
    }

    _onUserLogoutBtnClick() {
        this.$domainFacade.logout();
    }

}

export {
    UserTab
}