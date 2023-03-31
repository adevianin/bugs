class AccountView {

    constructor(el, domainFacade) {
        this._el = el
        this._domainFacade = domainFacade;
        this._loginTabEl = this._el.querySelector('[data-login-tab]');
        this._registrationTabEl = this._el.querySelector('[data-registration-tab]');
        this._userTabEl = this._el.querySelector('[data-user-tab]');
        this._loginBtn = this._el.querySelector('[data-login-btn]');
        this._userNameEl = this._el.querySelector('[data-username]');
        this._logoutBtn = this._el.querySelector('[data-logout-btn]');
        this._notCorrectCredsErrorEl = this._el.querySelector('[data-not-correct-creds-error]');

        this._render();
        
        this._loginBtn.addEventListener('click', this._onLoginBtnClick.bind(this));
        this._logoutBtn.addEventListener('click', this._onLogoutBtnClick.bind(this));
    }

    _render() {
        let isLoggedIn = this._domainFacade.isLoggedIn();
        this._loginTabEl.classList.toggle('hidden', isLoggedIn);
        this._registrationTabEl.classList.toggle('hidden', isLoggedIn);
        this._userTabEl.classList.toggle('hidden', !isLoggedIn);

        this._toggleNotCorrectLoginPassError(false);

        if (isLoggedIn) {
            let user = this._domainFacade.getUserData();
            this._userNameEl.innerText = user.username;
        }
    }

    _onLoginBtnClick() {
        let username = this._loginTabEl.querySelector('[data-user-name]').value;
        let password =  this._loginTabEl.querySelector('[data-password]').value;
        this._domainFacade.login(username, password)
            .then(() => {
                if (username == 'admin') {
                    this._redirectToAdminPanel();
                } else {
                    this._render();
                }
            }).catch(() => {
                this._toggleNotCorrectLoginPassError(true);
            });
    }

    _onLogoutBtnClick() {
        this._domainFacade.logout().then(() => {
            this._render();
        });
    }

    _toggleNotCorrectLoginPassError(isShowed) {
        this._notCorrectCredsErrorEl.classList.toggle('hidden', !isShowed);
    }

    _redirectToAdminPanel() {
        window.location = '/admin';
    }
    
}

export {
    AccountView
}