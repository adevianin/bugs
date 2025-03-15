import passwordFieldEditorTmpl from './passwordFieldEditorTmpl.html';
import { BaseFieldEditor } from '../baseFieldEditor';
import { DotsLoaderView } from '@common/view/dotsLoader/dotsLoaderView';
import { AccountPasswordErrorView } from '@common/view/errors/accountPasswordErrorView';
import { MESSAGE_IDS } from '@messages/messageIds';

class PasswordFieldEditorView extends BaseFieldEditor {

    constructor(onDone) {
        super(onDone);

        this._render();

        this._cancelBtn.addEventListener('click', this._onCancelBtnClick.bind(this));
        this._okBtn.addEventListener('click', this._onOkBtnClick.bind(this));

        this._newPasswordEl.addEventListener('change', this._onNewPasswordChange.bind(this));
        this._newPasswordConfirmEl.addEventListener('change', this._onNewPasswordConfirmChange.bind(this));
        this._oldPasswordEl.addEventListener('change', this._onOldPasswordChange.bind(this));
    }

    remove() {
        super.remove();
        this._loader.remove();
        this._newPasswordErr.remove();
    }

    _render() {
        this._el.innerHTML = passwordFieldEditorTmpl;

        this._errContainer = this._el.querySelector('[data-err-container]');
        this._loader = new DotsLoaderView(this._el.querySelector('[data-loader]'));

        this._okBtn = this._el.querySelector('[data-ok]');
        this._cancelBtn = this._el.querySelector('[data-cancel]');
        
        this._newPasswordEl = this._el.querySelector('[data-new-password]');
        this._newPasswordConfirmEl = this._el.querySelector('[data-new-password-confirmation]');
        this._oldPasswordEl = this._el.querySelector('[data-old-password]');
        
        this._newPasswordErr = new AccountPasswordErrorView(this._el.querySelector('[data-new-password-err-container]'));
        this._newPasswordConfirmErrContainer = this._el.querySelector('[data-new-password-confirm-err-container]');
        this._oldPasswordErrContainer = this._el.querySelector('[data-old-password-err-container]');
        this._requestErrContainer = this._el.querySelector('[data-request-err-container]');
    }

    _renderErr(errId) {
        this._errContainer.innerHTML = errId ? this.$mm.get(errId) : '';
    }

    _onCancelBtnClick() {
        this._onDone(null);
    }

    _validate() {
        let isError = false;

        let newPasswordErr = this._validateNewPassword();
        this._renderNewPasswordErr(newPasswordErr);
        if (newPasswordErr) {
            isError = true;
        }

        let newPasswordConfirmErr = this._validateNewPasswordConfirm();
        this._renderNewPasswordConfirmErr(newPasswordConfirmErr);
        if (newPasswordConfirmErr) {
            isError = true;
        }

        let oldPasswordErr = this._validateOldPassword();
        this._renderOldPasswordErr(oldPasswordErr);
        if (oldPasswordErr) {
            isError = true;
        }

        return !isError;
    }

    _validateNewPassword() {
        let newPassword = this._newPasswordEl.value;
        return this.$domainFacade.validatePassword(newPassword);
    }

    _renderNewPasswordErr(err) {
        this._newPasswordErr.setErr(err);
    }

    _validateNewPasswordConfirm() {
        let newPassword = this._newPasswordEl.value;
        let newPasswordConfirm = this._newPasswordConfirmEl.value;

        if (newPassword != newPasswordConfirm) {
            return MESSAGE_IDS.PASSWORD_CONFIRMATION_IS_NOT_VALID
        }
    }

    _renderNewPasswordConfirmErr(errId) {
        this._newPasswordConfirmErrContainer.innerHTML = errId ? this.$mm.get(errId) : '';
    }

    _validateOldPassword() {
        if (!this._oldPasswordEl.value.length) {
            return MESSAGE_IDS.OLD_PASSWORD_NEEDED;
        }
    }

    _renderOldPasswordErr(errId) {
        this._oldPasswordErrContainer.innerHTML = errId ? this.$mm.get(errId) : '';
    }

    _renderRequestErr(errId) {
        this._requestErrContainer.innerHTML = errId ? this.$mm.get(errId) : '';
    }

     _onNewPasswordChange() {
        let newPasswordErr = this._validateNewPassword();
        this._renderNewPasswordErr(newPasswordErr);
    }

    _onNewPasswordConfirmChange() {
        let newPasswordConfirmErr = this._validateNewPasswordConfirm();
        this._renderNewPasswordConfirmErr(newPasswordConfirmErr);
    }

    _onOldPasswordChange() {
        let oldPasswordErr = this._validateOldPassword();
        this._renderOldPasswordErr(oldPasswordErr);
    }

    async _onOkBtnClick() {
        if (!this._validate()) {
            return;
        }

        this._loader.toggle(true);
        let newPassword = this._newPasswordEl.value;
        let oldPassword = this._oldPasswordEl.value;
        let err = await this.$domainFacade.changePassword(newPassword, oldPassword);
        this._renderRequestErr(err);
        this._loader.toggle(false);
        if (!err) {
            this._onDone();
        }
    }

}

export {
    PasswordFieldEditorView
}