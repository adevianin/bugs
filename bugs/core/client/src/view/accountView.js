class AccountView {

    constructor(el, domainFacade) {
        this._el = el
        this._domainFacade = domainFacade;
        this._loginTabEl = this._el.querySelector('[data-login-tab]');
        this._registrationTabEl = this._el.querySelector('[data-registration-tab]');
        this._userTabEl = this._el.querySelector('[data-user-tab]');
        this._loginBtn = this._el.querySelector('[data-login-btn]');
        this._userNameEl = this._el.querySelector('[data-username]');

        this._render();
        
        this._loginBtn.addEventListener('click', this._onLoginBtnClick.bind(this));
    }

    _render() {
        let isLoggedIn = this._domainFacade.isLoggedIn();
        this._loginTabEl.classList.toggle('hidden', isLoggedIn);
        this._registrationTabEl.classList.toggle('hidden', isLoggedIn);
        this._userTabEl.classList.toggle('hidden', !isLoggedIn);

        if (isLoggedIn) {
            let user = this._domainFacade.getUserData();
            this._userNameEl.innerText = user.username;
        }
    }

    _onLoginBtnClick() {
        let username = this._loginTabEl.querySelector('[data-user-name]').value;
        let password =  this._loginTabEl.querySelector('[data-password]').value;
        this._domainFacade.login(username, password).then(() => {
            console.log('account view')
            this._render();
        });
    }
    
}

export {
    AccountView
}