import './styles.css';
import { BaseHTMLView } from "@common/view/base/baseHTMLView";
import { LoginTabView } from './loginTabView';
import { RegistrationTabView } from './registrationTabView';

class AccountAppView extends BaseHTMLView {

    constructor(el) {
        super(el);

        this._render();
        
        this._switchModeToRegisterBtn.addEventListener('click', this._onSwitchModeToRegisterClick.bind(this));
        this._switchModeToLoginBtn.addEventListener('click', this._onSwitchModeToLoginClick.bind(this));
    }

    _render() {
        this._switchModeToRegisterBtn = this._el.querySelector('[data-switch-to-register-btn]');
        this._switchModeToLoginBtn = this._el.querySelector('[data-switch-to-login-btn]');

        this._registrationTabView = new RegistrationTabView(this._el.querySelector('[data-registration-tab]'));
        this._loginTabView = new LoginTabView(this._el.querySelector('[data-login-tab]'));
    }

    _onSwitchModeToLoginClick(e) {
        e.preventDefault();
        this._switchMode('login');
    }

    _onSwitchModeToRegisterClick(e) {
        e.preventDefault();
        this._switchMode('register');
    }

    _switchMode(modeName) {
        this._clearForms();
        this._registrationTabView.toggle(modeName == 'register');
        this._loginTabView.toggle(modeName == 'login');
    }

    _clearForms() {
        this._registrationTabView.clear();
        this._loginTabView.clear();
    }

}

export {
    AccountAppView
}