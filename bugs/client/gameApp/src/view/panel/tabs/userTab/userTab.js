import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';
import userTabTmpl from './userTabTmpl.html';
import { UsernameEditorView } from './usernameEditor/usernameEditorView';

class UserTab extends BaseGameHTMLView {

    constructor(el) {
        super(el);

        this._render();

        this._userLogoutBtnEl.addEventListener('click', this._onUserLogoutBtnClick.bind(this));
    }

    _render() {
        this._el.innerHTML = userTabTmpl;

        this._usernameEditorView = new UsernameEditorView(this._el.querySelector('[data-username-editor]'));
        this._userLogoutBtnEl = this._el.querySelector('[data-logout-btn]');
    }

    _onUserLogoutBtnClick() {
        this.$domainFacade.logout().then(redirectUrl => {
            location.href = redirectUrl;
        });
    }

}

export {
    UserTab
}