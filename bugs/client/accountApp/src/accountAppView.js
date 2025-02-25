class AccountAppView {

    constructor(el, accountApi) {
        this._el = el;
        this._accountApi = accountApi;

        this._render();

        this._loginBtn.addEventListener('click', this._onLoginBtnClick.bind(this));
        this._registrationBtn.addEventListener('click', this._onRegistrationBtnClick.bind(this));
        this._switchModeToRegisterBtn.addEventListener('click', this._onSwitchModeToRegisterClick.bind(this));
        this._switchModeToLoginBtn.addEventListener('click', this._onSwitchModeToLoginClick.bind(this));

        this._switchMode('login');
    }

    _render() {
        this._loginTabEl = this._el.querySelector('[data-login-tab]');
        this._registrationTabEl = this._el.querySelector('[data-registration-tab]');

        this._loginBtn = this._el.querySelector('[data-login-btn]');
        this._registrationBtn = this._el.querySelector('[data-registration-btn]');
        this._switchModeToRegisterBtn = this._el.querySelector('[data-switch-to-register-btn]');
        this._switchModeToLoginBtn = this._el.querySelector('[data-switch-to-login-btn]');

        this._notCorrectCredsErrorEl = this._el.querySelector('[data-not-correct-creds-error]');
        this._passwordDifferentErrorEl = this._el.querySelector('[data-passwords-different-error]');
        this._usernameIsntUniqueErrorEl = this._el.querySelector('[data-username-isnt-unique]');
        this._registrationSomethingWrongErrorEl = this._el.querySelector('[data-reg-something-went-wrong]');

        this._toggleNotCorrectLoginPassError(false);
        this._toggleDifferentPasswordsError(false);
        this._toggleUsernameIsntUniqueError(false);
        this._toggleRegSomethingWentWrongError(false);
    }

    _onLoginBtnClick() {
        let username = this._loginTabEl.querySelector('[data-user-name]').value;
        let password =  this._loginTabEl.querySelector('[data-password]').value;
        this._accountApi.login(username, password)
            .then(() => {
                this._redirectToNext();
            })
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
        if (!isPasswordSame) {
            return;
        }

        this._accountApi.checkUsernameUnique(username)
            .then((isUnique) => {
                this._toggleUsernameIsntUniqueError(!isUnique);

                if (isUnique && isPasswordSame) {
                    this._accountApi.register(username, password)
                        .then(() => {
                            this._redirectToNext();
                        })
                        .catch(() => {
                            this._toggleRegSomethingWentWrongError(true);
                        })
                }
            });
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
        this._clearFields();
        this._loginTabEl.classList.toggle('g-hidden', modeName != 'login');
        this._registrationTabEl.classList.toggle('g-hidden', modeName != 'register');
    }

    _toggleNotCorrectLoginPassError(isShowed) {
        this._notCorrectCredsErrorEl.classList.toggle('g-hidden', !isShowed);
    }

    _toggleDifferentPasswordsError(isShowed) {
        this._passwordDifferentErrorEl.classList.toggle('g-hidden', !isShowed);
    }

    _toggleUsernameIsntUniqueError(isShowed) {
        this._usernameIsntUniqueErrorEl.classList.toggle('g-hidden', !isShowed);
    }

    _toggleRegSomethingWentWrongError(isShowed) {
        this._registrationSomethingWrongErrorEl.classList.toggle('g-hidden', !isShowed);
    }

    _clearFields() {
        let inputs = this._el.querySelectorAll('input');
        inputs.forEach((input) => {
            input.value = '';
        });
    }

    _toggle(isEnabled) {
        this._el.classList.toggle('g-hidden', !isEnabled);
    }
    
    _redirectToNext() {
        let nextUrl = new URLSearchParams(window.location.search).get('next') || '/';
        window.location.href = nextUrl;
    }
}

export {
    AccountAppView
}