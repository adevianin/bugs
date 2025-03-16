import { BaseHTMLView } from "@common/view/base/baseHTMLView";
import { UnauthorizedRequestError } from '@common/domain/errors/unauthorizedRequestError';
import { ACCOUNT_MESSAGE_IDS } from "../messages/messageIds";
import { DotsLoaderView } from "@common/view/dotsLoader/dotsLoaderView";

class LoginTabView extends BaseHTMLView {

    constructor(el) {
        super(el);

        this._render();

        this._loginBtn.addEventListener('click', this._onLoginBtnClick.bind(this));
    }

    get _loginEmail() {
        return this._emailEl.value.trim();
    }

    clear() {
        this._emailEl.value = '';
        this._passwordEl.value = '';
        this._renderEmailErr(null);
        this._renderPasswordErr(null);
    }

    _render() {
        this._loginBtn = this._el.querySelector('[data-login-btn]');
        this._loginRequestErrContainer = this._el.querySelector('[data-login-request-err]');
        this._emailEl = this._el.querySelector('[data-email]');
        this._emailErrContainer = this._el.querySelector('[data-email-err]');
        this._passwordEl = this._el.querySelector('[data-password]');
        this._passwordErrContainer = this._el.querySelector('[data-password-err]');
        this._loginRequestLoader = new DotsLoaderView(this._el.querySelector('[data-login-request-loader]'));
    }

    _validateLogin() {
        let isError = false;

        let emailErr = this._validateEmail();
        this._renderEmailErr(emailErr);
        if (emailErr) {
            isError = true;
        }

        let passwordErr = this._validatePassword();
        this._renderPasswordErr(passwordErr);
        if (passwordErr) {
            isError = true;
        }

        return !isError;
    }

    _validateEmail() {
        let email = this._loginEmail;
        if (!email || !this._emailEl.checkValidity()) {
            return ACCOUNT_MESSAGE_IDS.EMAIL_INVALID;
        }

        return null;
    }

    _renderEmailErr(errId) {
        this._emailErrContainer.innerHTML = errId ? this.$mm.get(errId) : '';
    }

    _validatePassword() {
        let password = this._passwordEl.value;
        if (!password) {
            return ACCOUNT_MESSAGE_IDS.PASSWORD_NEEDED;
        }

        return null;
    }

    _renderPasswordErr(errId) {
        this._passwordErrContainer.innerHTML = errId ? this.$mm.get(errId) : '';
    }

    async _onLoginBtnClick() {
        if (!this._validateLogin()) {
            return;
        }

        let email = this._loginEmail;
        let password = this._passwordEl.value;

        try {
            this._loginRequestLoader.toggle(true);
            await this.$domain.login(email, password);
            this._renderLoginRequestErr();
            this._redirectToNext();
            this._loginRequestLoader.toggle(false);
        } catch (e) {
            if (e instanceof UnauthorizedRequestError) {
                this._renderLoginRequestErr(ACCOUNT_MESSAGE_IDS.NOT_VALID_PASSWORD_OR_EMAIL);
            } else {
                this._renderLoginRequestErr(ACCOUNT_MESSAGE_IDS.SOMETHING_WENT_WRONG);
            }
            this._loginRequestLoader.toggle(false);
        }
    }

    _renderLoginRequestErr(errId) {
        this._loginRequestErrContainer.innerHTML = errId ? this.$mm.get(errId) : '';
    }

    _redirectToNext() {
        let nextUrl = new URLSearchParams(window.location.search).get('next') || '/';
        window.location.href = nextUrl;
    }

}

export {
    LoginTabView
}