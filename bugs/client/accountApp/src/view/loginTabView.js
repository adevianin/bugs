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
        this._renderMainErr(null);
    }

    _render() {
        this._loginBtn = this._el.querySelector('[data-login-btn]');
        this._mainErrContainer = this._el.querySelector('[data-main-err-container]');
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
        this._renderMainErr(passwordErr);
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

    async _onLoginBtnClick() {
        if (!this._validateLogin()) {
            return;
        }

        let email = this._loginEmail;
        let password = this._passwordEl.value;

        try {
            this._loginRequestLoader.toggleVisibility(true);
            await this.$domain.login(email, password);
            this._renderMainErr();
            this._redirectToNext();
            this._loginRequestLoader.toggleVisibility(false);
        } catch (e) {
            if (e instanceof UnauthorizedRequestError) {
                this._renderMainErr(ACCOUNT_MESSAGE_IDS.NOT_VALID_PASSWORD_OR_EMAIL);
            } else {
                this._renderMainErr(ACCOUNT_MESSAGE_IDS.SOMETHING_WENT_WRONG);
            }
            this._loginRequestLoader.toggleVisibility(false);
        }
    }

    _renderMainErr(errId) {
        this._mainErrContainer.innerHTML = errId ? this.$mm.get(errId) : '';
    }

    _redirectToNext() {
        let nextUrl = new URLSearchParams(window.location.search).get('next') || '/';
        window.location.href = nextUrl;
    }

}

export {
    LoginTabView
}