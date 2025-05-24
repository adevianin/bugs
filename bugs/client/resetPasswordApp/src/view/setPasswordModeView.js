import { BaseHTMLView } from "@common/view/base/baseHTMLView";
import { DotsLoaderView } from "@common/view/dotsLoader/dotsLoaderView";
import { AccountPasswordErrorView } from "@common/view/errors/accountPasswordErrorView";
import { RESET_PASSWORD_MESSAGE_IDS } from "../messages/messageIds";
import { getQueryParams } from "@common/utils/getQueryParams";

class SetPasswordModeView extends BaseHTMLView {

    constructor(el) {
        super(el);

        this._render();

        this._setPasswordBtn.addEventListener('click', this._onSetPasswordBtnClick.bind(this));
        this._passwordEl.addEventListener('change', this._onPasswordChange.bind(this));
        this._passwordConfirmEl.addEventListener('change', this._onPasswordConfirmChange.bind(this));
    }

    _render() {
        this._setPasswordTabEl = this._el.querySelector('[data-set-password-tab]');
        this._passwordEl = this._setPasswordTabEl.querySelector('[data-password]');
        this._passwordErrView = new AccountPasswordErrorView(this._setPasswordTabEl.querySelector('[data-password-err]'));
        this._passwordConfirmEl = this._setPasswordTabEl.querySelector('[data-password-confirmation]');
        this._passwordConfirmErrContainerEl = this._setPasswordTabEl.querySelector('[data-password-confirmation-err]');
        this._requestErrContainerEl = this._setPasswordTabEl.querySelector('[data-request-err]');
        this._loader = new DotsLoaderView(this._setPasswordTabEl.querySelector('[data-loader]'));
        this._setPasswordBtn = this._setPasswordTabEl.querySelector('[data-set-password-btn]');

        this._settedPasswordTabEl = this._el.querySelector('[data-setted-password-tab]');
    }

    _validateSetPassword() {
        let isError = false;

        let passwordErr = this._validatePassword();
        this._renderPasswordErr(passwordErr);
        if (passwordErr) {
            isError = true;
        }

        let passwordConfirmErr = this._validatePasswordConfirm();
        this._renderPasswordConfirmErr(passwordConfirmErr);
        if (passwordConfirmErr) {
            isError = true;
        }

        return !isError;
    }

    _validatePassword() {
        let password = this._passwordEl.value;
        return this.$domain.validatePassword(password);
    }

    _renderPasswordErr(err) {
        this._passwordErrView.setErr(err);
    }

    _onPasswordChange() {
        let passwordErr = this._validatePassword();
        this._renderPasswordErr(passwordErr);
    }

    _validatePasswordConfirm() {
        let confirmPassword = this._passwordConfirmEl.value;
        let password = this._passwordEl.value;
        if (confirmPassword != password) {
            return RESET_PASSWORD_MESSAGE_IDS.PASSWORD_CONFIRMATION_IS_NOT_VALID;
        }

        return null;
    }

    _renderPasswordConfirmErr(errId) {
        this._passwordConfirmErrContainerEl.innerHTML = errId ? this.$mm.get(errId) : '';
    }

    _onPasswordConfirmChange() {
        let passwordConfirmErr = this._validatePasswordConfirm();
        this._renderPasswordConfirmErr(passwordConfirmErr);
    }

    async _onSetPasswordBtnClick() {
        if (!this._validateSetPassword()) {
            return;
        }

        let queryParams = getQueryParams();
        let token = queryParams['t'];
        let id = queryParams['i'];
        let password = this._passwordEl.value;
        this._loader.toggleVisibility(true);
        let err = await this.$domain.setNewPassword(password, token, id);
        this._renderRequestErr(err);
        if (!err) {
            this._switchSettedPasswordTab();
        }
        this._loader.toggleVisibility(false);
    }

    _renderRequestErr(errId) {
        this._requestErrContainerEl.innerHTML = errId ? this.$mm.get(errId) : '';
    }

    _switchSettedPasswordTab() {
        this._setPasswordTabEl.classList.add('g-hidden');
        this._settedPasswordTabEl.classList.remove('g-hidden');
    }

}

export {
    SetPasswordModeView
}