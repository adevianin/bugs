import './styles.css';

import template from './template.html';
import { BaseHTMLView } from '../base/baseHTMLView';

class AccountView extends BaseHTMLView {

    constructor(el) {
        super(el);

        this.$domainFacade.events.on('loginStatusChanged', this._renderState.bind(this));

        this._render();
        this._renderState();

        this._loginBtn.addEventListener('click', this._onLoginBtnClick.bind(this));
        this._registrationBtn.addEventListener('click', this._onRegistrationBtnClick.bind(this));
        this._switchModeToRegisterBtn.addEventListener('click', this._onSwitchModeToRegisterClick.bind(this));
        this._switchModeToLoginBtn.addEventListener('click', this._onSwitchModeToLoginClick.bind(this));
    }

    _render() {
        this._el.innerHTML = template;

        this._loginTabEl = this._el.querySelector('[data-login-tab]');
        this._registrationTabEl = this._el.querySelector('[data-registration-tab]');

        this._loginBtn = this._el.querySelector('[data-login-btn]');
        this._registrationBtn = this._el.querySelector('[data-registration-btn]');
        this._switchModeToRegisterBtn = this._el.querySelector('[data-switch-to-register-btn]');
        this._switchModeToLoginBtn = this._el.querySelector('[data-switch-to-login-btn]');

        this._notCorrectCredsErrorEl = this._el.querySelector('[data-not-correct-creds-error]');
        this._passwordDifferentErrorEl = this._el.querySelector('[data-passwords-different-error]');
        this._usernameIsntUniqueErrorEl = this._el.querySelector('[data-username-isnt-unique]');

        this._toggleNotCorrectLoginPassError(false);
        this._toggleDifferentPasswordsError(false);
        this._toggleUsernameIsntUniqueError(false);
    }

    _renderState() {
        let isLoggedIn = this.$domainFacade.isLoggedIn();

        if (isLoggedIn) {
            this._toggle(false);
        } else {
            this._toggle(true);
            this._switchMode('login');
        }
    }

    _onLoginBtnClick() {
        let username = this._loginTabEl.querySelector('[data-user-name]').value;
        let password =  this._loginTabEl.querySelector('[data-password]').value;
        this.$domainFacade.login(username, password)
            .catch(() => {
                this._toggleNotCorrectLoginPassError(true);
            });
    }

    _onRegistrationBtnClick() {
        let username = this._registrationTabEl.querySelector('[data-user-name]').value;
        let password =  this._registrationTabEl.querySelector('[data-password]').value;
        let passwordConfirm =  this._registrationTabEl.querySelector('[data-password-confirm]').value;

        if (!username || !password) {
            return;
        }
        
        let isPasswordSame = password == passwordConfirm;
        this._toggleDifferentPasswordsError(!isPasswordSame);

        this.$domainFacade.checkUsernameUnique(username)
            .then((isUnique) => {
                this._toggleUsernameIsntUniqueError(!isUnique);

                if (isUnique && isPasswordSame) {
                    this.$domainFacade.register(username, password);
                }
            });
    }

    _onSwitchModeToLoginClick() {
        this._switchMode('login');
    }

    _onSwitchModeToRegisterClick() {
        this._switchMode('register');
    }

    _switchMode(modeName) {
        this._clearFields();
        this._loginTabEl.classList.toggle('hidden', modeName != 'login');
        this._registrationTabEl.classList.toggle('hidden', modeName != 'register');
    }

    _toggleNotCorrectLoginPassError(isShowed) {
        this._notCorrectCredsErrorEl.classList.toggle('hidden', !isShowed);
    }

    _toggleDifferentPasswordsError(isShowed) {
        this._passwordDifferentErrorEl.classList.toggle('hidden', !isShowed);
    }

    _toggleUsernameIsntUniqueError(isShowed) {
        this._usernameIsntUniqueErrorEl.classList.toggle('hidden', !isShowed);
    }

    _clearFields() {
        let inputs = this._el.querySelectorAll('input');
        inputs.forEach((input) => {
            input.value = '';
        });
    }

    _toggle(isEnabled) {
        this._el.classList.toggle('hidden', !isEnabled);
    }
    
}

export {
    AccountView
}