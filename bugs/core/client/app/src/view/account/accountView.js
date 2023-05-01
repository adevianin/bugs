import template from './template.html';

class AccountView {

    constructor(el, domainFacade) {
        this._el = el
        this._domainFacade = domainFacade;

        this._render();

        this._loginBtn.addEventListener('click', this._onLoginBtnClick.bind(this));
        this._logoutBtn.addEventListener('click', this._onLogoutBtnClick.bind(this));
        this._registrationBtn.addEventListener('click', this._onRegistrationBtnClick.bind(this));
        this._switchModeToRegisterBtn.addEventListener('click', this._onSwitchModeToRegisterClick.bind(this));
        this._switchModeToLoginBtn.addEventListener('click', this._onSwitchModeToLoginClick.bind(this));

        this._renderState();
    }

    _render() {
        this._el.innerHTML = template;

        this._loginTabEl = this._el.querySelector('[data-login-tab]');
        this._userTabEl = this._el.querySelector('[data-user-tab]');
        this._registrationTabEl = this._el.querySelector('[data-registration-tab]');

        this._userNameEl = this._el.querySelector('[data-username]');

        this._loginBtn = this._el.querySelector('[data-login-btn]');
        this._logoutBtn = this._el.querySelector('[data-logout-btn]');
        this._registrationBtn = this._el.querySelector('[data-registration-btn]');
        this._switchModeToRegisterBtn = this._el.querySelector('[data-switch-to-register-btn]');
        this._switchModeToLoginBtn = this._el.querySelector('[data-switch-to-login-btn]');

        this._notCorrectCredsErrorEl = this._el.querySelector('[data-not-correct-creds-error]');
        this._passwordDifferentErrorEl = this._el.querySelector('[data-passwords-different-error]');
        this._usernameIsntUniqueErrorEl = this._el.querySelector('[data-username-isnt-unique]');
    }

    _renderState() {
        let isLoggedIn = this._domainFacade.isLoggedIn();
        this._loginTabEl.classList.toggle('hidden', isLoggedIn);
        this._registrationTabEl.classList.toggle('hidden', isLoggedIn);
        this._userTabEl.classList.toggle('hidden', !isLoggedIn);

        this._toggleNotCorrectLoginPassError(false);
        this._toggleDifferentPasswordsError(false);
        this._toggleUsernameIsntUniqueError(false);

        if (isLoggedIn) {
            let user = this._domainFacade.getUserData();
            this._userNameEl.innerText = user.username;
        }

        this._switchMode(isLoggedIn ? 'user':'login');
    }

    _onLoginBtnClick() {
        let username = this._loginTabEl.querySelector('[data-user-name]').value;
        let password =  this._loginTabEl.querySelector('[data-password]').value;
        this._domainFacade.login(username, password)
            .then(() => {
                this._renderState();
            }).catch(() => {
                this._toggleNotCorrectLoginPassError(true);
            });
    }

    _onLogoutBtnClick() {
        this._domainFacade.logout().then(() => {
            this._renderState();
        });
    }

    _onRegistrationBtnClick() {
        let username = this._registrationTabEl.querySelector('[data-user-name]').value;
        let password =  this._registrationTabEl.querySelector('[data-password]').value;
        let passwordConfirm =  this._registrationTabEl.querySelector('[data-password-confirm]').value;
        
        let isPasswordSame = password == passwordConfirm;
        this._toggleDifferentPasswordsError(!isPasswordSame);

        this._domainFacade.checkUsernameUnique(username)
            .then((isUnique) => {
                this._toggleUsernameIsntUniqueError(!isUnique);

                if (isUnique) {
                    this._domainFacade.register(username, password).then(() => {
                        this._renderState();
                    });
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
        this._userTabEl.classList.toggle('hidden', modeName != 'user');
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
    
}

export {
    AccountView
}