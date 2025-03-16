import { BaseHTMLView } from "@common/view/base/baseHTMLView";
import { ACCOUNT_MESSAGE_IDS } from '../messages/messageIds';
import { DotsLoaderView } from '@common/view/dotsLoader/dotsLoaderView';
import { ConflictRequestError } from '@common/domain/errors/conflictRequestError';
import { throttle } from '@common/utils/throttle';
import { AccountPasswordErrorView } from '@common/view/errors/accountPasswordErrorView';
import { AccountUsernameErrorView } from "@common/view/errors/accountUsernameErrorView";
import { UI_CONSTS } from "@common/view/ui_consts";

class RegistrationTabView extends BaseHTMLView {

    constructor(el, accountService) {
        super(el);
        this._accountService = accountService;
        this._approvedFields = {
            username: false,
            email: false,
        }

        this._render();

        this._usernameEl.addEventListener('change', this._onUsernameChanged.bind(this));
        this._usernameEl.addEventListener('input', this._onUsernameInput.bind(this));
        this._emailEl.addEventListener('change', this._onEmailChanged.bind(this));
        this._emailEl.addEventListener('input', this._onEmailInput.bind(this));
        this._passwordEl.addEventListener('change', this._onPasswordChanged.bind(this));
        this._passwordConfirmEl.addEventListener('change', this._onPasswordConfirmChanged.bind(this));
        this._registrationBtn.addEventListener('click', throttle(this._onRegistrationBtnClick.bind(this), UI_CONSTS.DOUBLE_CLICK_THROTTLE_MS));
    }

    get _username() {
        return this._usernameEl.value.trim();
    }

    get _email() {
        return this._emailEl.value.trim();
    }

    clear() {
        this._usernameEl.value = '';
        this._emailEl.value = '';
        this._passwordEl.value = '';
        this._passwordConfirmEl.value = '';
        this._renderUsernameError(null);
        this._renderEmailError(null);
        this._renderPasswordError(null);
        this._renderPasswordConfirmError(null);
        this._resetApprovedFields();
    }

    _render() {
        this._registrationBtn = this._el.querySelector('[data-registration-btn]');
        this._usernameEl = this._el.querySelector('[data-username]');
        this._usernameErrView = new AccountUsernameErrorView(this._el.querySelector('[data-username-err]'));
        this._usernameLoader = new DotsLoaderView(this._el.querySelector('[data-username-loader]'));
        this._emailEl = this._el.querySelector('[data-email]');
        this._emailLoader = new DotsLoaderView(this._el.querySelector('[data-email-loader]'));
        this._emailErrContainer = this._el.querySelector('[data-email-err]');
        this._passwordEl = this._el.querySelector('[data-password]');
        this._passwordErrView = new AccountPasswordErrorView(this._el.querySelector('[data-password-err]'));
        this._passwordConfirmEl = this._el.querySelector('[data-password-confirm]');
        this._passwordConfirmErrContainer = this._el.querySelector('[data-password-confirm-err]');
        this._reuqestLoader = new DotsLoaderView(this._el.querySelector('[data-registration-request-loader]'));
        this._requestErrContainer = this._el.querySelector('[data-registration-request-err]');
    }

    async _validateRegistration() {
        let isError = false;

        if (!this._approvedFields.username) {
            let usernameErr = await this._validateUsername();
            this._renderUsernameError(usernameErr);
            if (usernameErr) {
                isError = true;
            }
        }

        if (!this._approvedFields.email) {
            let emailErr = await this._validateEmail();
            this._renderEmailError(emailErr);
            if (emailErr) {
                isError = true;
            }
        }

        let passwordErr = this._validatePassword();
        this._renderPasswordError(passwordErr);
        if (passwordErr) {
            isError = true;
        }

        let passConfirmErr = this._validatePasswordConfirm();
        this._renderPasswordConfirmError(passConfirmErr);
        if (passConfirmErr) {
            isError = true;
        }

        return !isError;
    }

    async _validateUsername() {
        let username = this._username;
        let res = await this._accountService.validateUsername(username);
        return res;
    }

    _renderUsernameError(err) {
        this._usernameErrView.setErr(err);
    }

    _onUsernameInput() {
        this._approvedFields.username = false;
    }

    async _onUsernameChanged() {
        this._usernameLoader.toggle(true);
        let usernameErr = await this._validateUsername();
        this._usernameLoader.toggle(false);
        this._renderUsernameError(usernameErr);
        this._approvedFields.username = !usernameErr;
    }

    async _validateEmail() {
        return await this._accountService.validateEmail(this._email);
    }

    _renderEmailError(errId) {
        this._emailErrContainer.innerHTML = errId ? this.$mm.get(errId) : '';
    }

    _onEmailInput() {
        this._approvedFields.email = false;
    }

    async _onEmailChanged() {
        this._emailLoader.toggle(true);
        let emailErr = await this._validateEmail();
        this._emailLoader.toggle(false);
        this._renderEmailError(emailErr);
        this._approvedFields.email = !emailErr;
    }

    _validatePassword() {
        let password = this._passwordEl.value;
        return this._accountService.validatePassword(password);
    }

    _renderPasswordError(err) {
        this._passwordErrView.setErr(err);
    }

    _onPasswordChanged() {
        let passwordErr = this._validatePassword();
        this._renderPasswordError(passwordErr);
    }

    _validatePasswordConfirm() {
        let confirmPassword = this._passwordConfirmEl.value;
        let password = this._passwordEl.value;
        if (confirmPassword != password) {
            return ACCOUNT_MESSAGE_IDS.PASSWORD_CONFIRMATION_IS_NOT_VALID;
        }

        return null;
    }

    _renderPasswordConfirmError(errId) {
        this._passwordConfirmErrContainer.innerHTML = errId ? this.$mm.get(errId) : '';
    }

    _onPasswordConfirmChanged() {
        let passConfirmErr = this._validatePasswordConfirm();
        this._renderPasswordConfirmError(passConfirmErr);
    }

    _resetApprovedFields() {
        this._approvedFields.username = false;
        this._approvedFields.email = false;
    }

    async _onRegistrationBtnClick() {
        let isValid = await this._validateRegistration();
        if (!isValid) {
            return;
        }

        let username = this._username;
        let email = this._email;
        let password = this._passwordEl.value;
        try {
            this._reuqestLoader.toggle(true);
            await this._accountService.register(username, email, password);
            window.location.href = '/';
            this._reuqestLoader.toggle(false);
        } catch(e) {
            if (e instanceof ConflictRequestError) {
                this._resetApprovedFields();
                this._validateRegistration();
            } else {
                this._renderRegistrationRequestErr(ACCOUNT_MESSAGE_IDS.SOMETHING_WENT_WRONG);
            }
            this._reuqestLoader.toggle(false);
        }
    }

    _renderRegistrationRequestErr(errId) {
        this._requestErrContainer.innerHTML = errId ? this.$mm.get(errId) : '';
    }
}

export {
    RegistrationTabView
}