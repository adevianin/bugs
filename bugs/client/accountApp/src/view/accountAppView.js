import './styles.css';
import { BaseHTMLView } from "@common/view/base/baseHTMLView";
import { MESSAGE_IDS } from '../messages/messageIds';
import { DotsLoaderView } from '@common/view/dotsLoader/dotsLoaderView';
import { StateSyncRequestError } from '@common/domain/errors/stateSyncRequestError';
import { throttle } from '@common/utils/throttle';

class AccountAppView extends BaseHTMLView {

    constructor(el, accountService) {
        super(el);
        this._accountService = accountService;
        this._registrationApprovedFields = {
            username: false,
            email: false,
        }

        this._render();

        this._loginBtn.addEventListener('click', this._onLoginBtnClick.bind(this));
        this._registrationBtn.addEventListener('click', throttle(this._onRegistrationBtnClick.bind(this), 2000));

        this._switchModeToRegisterBtn.addEventListener('click', this._onSwitchModeToRegisterClick.bind(this));
        this._switchModeToLoginBtn.addEventListener('click', this._onSwitchModeToLoginClick.bind(this));

        this._registrationUsernameEl.addEventListener('change', this._onRegistrationUsernameChanged.bind(this));
        this._registrationUsernameEl.addEventListener('input', this._onRegistrationUsernameInput.bind(this));
        this._registrationEmailEl.addEventListener('change', this._onRegistrationEmailChanged.bind(this));
        this._registrationEmailEl.addEventListener('input', this._onRegistrationEmailInput.bind(this));
        this._registrationPasswordEl.addEventListener('change', this._onRegistrationPasswordChanged.bind(this));
        this._registrationPasswordConfirmEl.addEventListener('change', this._onRegistrationPasswordConfirmChanged.bind(this));

        this._switchMode('login');
    }

    _render() {
        this._loginTabEl = this._el.querySelector('[data-login-tab]');

        this._loginBtn = this._el.querySelector('[data-login-btn]');
        
        this._switchModeToRegisterBtn = this._el.querySelector('[data-switch-to-register-btn]');
        this._switchModeToLoginBtn = this._el.querySelector('[data-switch-to-login-btn]');

        this._notCorrectCredsErrorEl = this._el.querySelector('[data-not-correct-creds-error]');
        this._passwordDifferentErrorEl = this._el.querySelector('[data-passwords-different-error]');
        this._usernameIsntUniqueErrorEl = this._el.querySelector('[data-username-isnt-unique]');
        this._registrationSomethingWrongErrorEl = this._el.querySelector('[data-reg-something-went-wrong]');

        this._registrationTabEl = this._el.querySelector('[data-registration-tab]');
        this._registrationBtn = this._el.querySelector('[data-registration-btn]');
        this._registrationFormLoader = new DotsLoaderView(this._registrationTabEl.querySelector('[data-registration-form-loader]'));
        this._registrationUsernameEl = this._registrationTabEl.querySelector('[data-username]');
        this._registrationUsernameErrContainer = this._registrationTabEl.querySelector('[data-username-err]');
        this._registrationUsernameLoader = new DotsLoaderView(this._registrationTabEl.querySelector('[data-username-loader]'));
        this._registrationEmailEl = this._registrationTabEl.querySelector('[data-email]');
        this._registrationEmailLoader = new DotsLoaderView(this._registrationTabEl.querySelector('[data-email-loader]'));
        this._registrationEmailErrContainer = this._registrationTabEl.querySelector('[data-email-err]');
        this._registrationPasswordEl = this._registrationTabEl.querySelector('[data-password]');
        this._registrationPasswordErrContainer = this._registrationTabEl.querySelector('[data-password-err]');
        this._registrationPasswordConfirmEl = this._registrationTabEl.querySelector('[data-password-confirm]');
        this._registrationPasswordConfirmErrContainer = this._registrationTabEl.querySelector('[data-password-confirm-err]');
    }

    async _validateRegistration() {
        let isError = false;

        if (!this._registrationApprovedFields.username) {
            let usernameErr = await this._validateRegistrationUsername();
            this._renderRegistrationUsernameError(usernameErr);
            if (usernameErr) {
                isError = true;
            }
        }

        if (!this._registrationApprovedFields.email) {
            let emailErr = await this._validateRegistrationEmail();
            this._renderRegistrationEmailError(emailErr);
            if (emailErr) {
                isError = true;
            }
        }

        let passwordErr = this._validateRegistrationPassword();
        this._renderRegistrationPasswordError(passwordErr);
        if (passwordErr) {
            isError = true;
        }

        let passConfirmErr = this._validateRegistrationPasswordConfirm();
        this._renderRegistrationPasswordConfirmError(passConfirmErr);
        if (passConfirmErr) {
            isError = true;
        }

        return !isError;
    }

    async _validateRegistrationUsername() {
        let username = this._registrationUsernameEl.value;
        let res = await this._accountService.validateUsername(username);
        return res;
    }

    _renderRegistrationUsernameError(err) {
        if (err) {
            switch (err.msgId) {
                case (MESSAGE_IDS.USERNAME_MIN_LENGTH_ERR):
                    this._registrationUsernameErrContainer.innerHTML = this.$mm.format(err.msgId, err.minLength);
                    break;
                case (MESSAGE_IDS.USERNAME_MAX_LENGTH_ERR):
                    this._registrationUsernameErrContainer.innerHTML = this.$mm.format(err.msgId, err.maxLength);
                    break;
                case (MESSAGE_IDS.USERNAME_INVALID_CHARS):
                case (MESSAGE_IDS.USERNAME_TAKEN):
                    this._registrationUsernameErrContainer.innerHTML = this.$mm.format(err.msgId);
                    break;
            }
        } else {
            this._registrationUsernameErrContainer.innerHTML = '';
        }
    }

    _onRegistrationUsernameInput() {
        this._registrationApprovedFields.username = false;
    }

    async _onRegistrationUsernameChanged() {
        this._registrationUsernameLoader.toggle(true);
        let usernameErr = await this._validateRegistrationUsername();
        this._registrationUsernameLoader.toggle(false);
        this._renderRegistrationUsernameError(usernameErr);
        this._registrationApprovedFields.username = !usernameErr;
    }

    async _validateRegistrationEmail() {
        let email = this._registrationEmailEl.value;

        if (!email || !this._registrationEmailEl.checkValidity()) {
            return MESSAGE_IDS.EMAIL_INVALID_FORMAT;
        }

        let isUniq = await this._accountService.checkEmailUniqueness(email);
        if (!isUniq) {
            return MESSAGE_IDS.EMAIL_TAKEN;
        }

        return null;
    }

    _renderRegistrationEmailError(errId) {
        this._registrationEmailErrContainer.innerHTML = errId ? this.$mm.get(errId) : '';
    }

    _onRegistrationEmailInput() {
        this._registrationApprovedFields.email = false;
    }

    async _onRegistrationEmailChanged() {
        this._registrationEmailLoader.toggle(true);
        let emailErr = await this._validateRegistrationEmail();
        this._registrationEmailLoader.toggle(false);
        this._renderRegistrationEmailError(emailErr);
        this._registrationApprovedFields.email = !emailErr;
    }

    _validateRegistrationPassword() {
        let password = this._registrationPasswordEl.value;
        return this._accountService.validatePassword(password);
    }

    _renderRegistrationPasswordError(err) {
        if (err) {
            switch (err.msgId) {
                case (MESSAGE_IDS.PASSWORD_MIN_LENGTH_ERR):
                    this._registrationPasswordErrContainer.innerHTML = this.$mm.format(err.msgId, err.minLength);
                    break;
                case (MESSAGE_IDS.PASSWORD_MAX_LENGTH_ERR):
                    this._registrationPasswordErrContainer.innerHTML = this.$mm.format(err.msgId, err.maxLength);
                    break;
            }
        } else {
            this._registrationPasswordErrContainer.innerHTML = '';
        }
    }

    _onRegistrationPasswordChanged() {
        let passwordErr = this._validateRegistrationPassword();
        this._renderRegistrationPasswordError(passwordErr);
    }

    _validateRegistrationPasswordConfirm() {
        let confirmPassword = this._registrationPasswordConfirmEl.value;
        let password = this._registrationPasswordEl.value;
        if (confirmPassword != password) {
            return MESSAGE_IDS.PASSWORD_CONFIRMATION_IS_NOT_VALID;
        }

        return null;
    }

    _renderRegistrationPasswordConfirmError(errId) {
        this._registrationPasswordConfirmErrContainer.innerHTML = errId ? this.$mm.get(errId) : '';
    }

    _onRegistrationPasswordConfirmChanged() {
        let passConfirmErr = this._validateRegistrationPasswordConfirm();
        this._renderRegistrationPasswordConfirmError(passConfirmErr);
    }

    _resetRegistrationApprovedFields() {
        this._registrationApprovedFields.username = false;
        this._registrationApprovedFields.email = false;
    }

    async _onRegistrationBtnClick() {
        this._registrationFormLoader.toggle(true);
        let isValid = await this._validateRegistration();
        if (!isValid) {
            this._registrationFormLoader.toggle(false);
            return;
        }

        let username = this._registrationUsernameEl.value;
        let email = this._registrationEmailEl.value;
        let password = this._registrationPasswordEl.value;
        try {
            await this._accountService.register(username, email, password);
            this._redirectToNext();
        } catch(e) {
            if (e instanceof StateSyncRequestError) {
                this._resetRegistrationApprovedFields();
                this._validateRegistration();
            }
        }
        this._registrationFormLoader.toggle(false);
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
        this._loginTabEl.classList.toggle('g-hidden', modeName != 'login');
        this._registrationTabEl.classList.toggle('g-hidden', modeName != 'register');
    }

    _clearForms() {
        let inputs = this._el.querySelectorAll('input');
        for (let input of inputs) {
            input.value = '';
        }
        let errContainers = this._el.querySelectorAll('[data-err-container]');
        for (let errContainer of errContainers) {
            errContainer.innerHTML = '';
        }
    }

    _redirectToNext() {
        let nextUrl = new URLSearchParams(window.location.search).get('next') || '/';
        window.location.href = nextUrl;
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
}

export {
    AccountAppView
}