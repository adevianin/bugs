import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';
import userTabTmpl from './userTabTmpl.html';
import { EmailFieldEditorView } from './fieldEditors/emailFieldEditor/emailFieldEditorView';
import { UsernameFieldEditorView } from './fieldEditors/usernameFieldEditor/usernameFieldEditorView';
import { PasswordFieldEditorView } from './fieldEditors/passwordFieldEditor/passwordFieldEditorView';
import { DoneButtonView } from '@common/view/doneButton/doneButtonView';

class UserTab extends BaseGameHTMLView {

    static MODES = {
        PREVIEW: 'preview',
        EDITOR: 'editor'
    }

    constructor(el) {
        super(el);
        this._fieldEditor = null;

        this._render();

        this._userLogoutBtnEl.addEventListener('click', this._onUserLogoutBtnClick.bind(this));
        this._emailEditBtnEl.addEventListener('click', this._onEmailEditBtnClick.bind(this));
        this._usernameEditBtnEl.addEventListener('click', this._onUsernameEditBtnClick.bind(this));
        this._passwordEditBtnEl.addEventListener('click', this._onPasswordEditBtnClick.bind(this));
        this._verifyEmailRequestBtnView.addEventListener('click', this._onVerifyEmailRequestBtnClick.bind(this));
    }

    _render() {
        this._el.innerHTML = userTabTmpl;

        this._mainContainerEl = this._el.querySelector('[data-main-contentainer]');
        this._fieldEditorContainerEl = this._el.querySelector('[data-field-editor-container]');

        this._emailEl = this._el.querySelector('[data-email]');
        this._emailNotVerifiedMarkerEl = this._el.querySelector('[data-not-verified-label]');
        this._emailEditBtnEl = this._el.querySelector('[data-edit-email-btn]');
        this._notVerifiedEmailStateEl = this._el.querySelector('[data-not-verified-email-state]');
        this._verifiedEmailStateEl = this._el.querySelector('[data-verified-email-state]');
        this._verifyEmailRequestBtnView = new DoneButtonView(this._el.querySelector('[data-verify-email-request-btn]'), 'send again');

        this._usernameEl = this._el.querySelector('[data-username]');
        this._usernameEditBtnEl = this._el.querySelector('[data-edit-username-btn]');

        this._passwordFieldEl = this._el.querySelector('[data-password-field]');
        this._passwordEditBtnEl = this._el.querySelector('[data-edit-password-btn]');

        this._userLogoutBtnEl = this._el.querySelector('[data-logout-btn]');

        this._renderEmail();
        this._renderUsername();
        this._renderPasswordField();
    }

    _changeMode(modeName) {
        this._mainContainerEl.classList.toggle('g-hidden', modeName != UserTab.MODES.PREVIEW);
        this._fieldEditorContainerEl.classList.toggle('g-hidden', modeName != UserTab.MODES.EDITOR);
    }

    _removeFieldEditor() {
        if (this._fieldEditor) {
            this._fieldEditor.remove();
            this._fieldEditor = null;
        }
    }

    _showFieldEditor(fieldEditorView) {
        this._removeFieldEditor();
        this._fieldEditorContainerEl.appendChild(fieldEditorView.el);
        this._fieldEditor = fieldEditorView;
        this._changeMode(UserTab.MODES.EDITOR);
    }

    _showMainContant() {
        this._removeFieldEditor();
        this._changeMode(UserTab.MODES.PREVIEW);
    }

    _renderEmail() {
        let user = this.$domain.getUserData();
        this._emailEl.innerHTML = user.email;
        this._emailEditBtnEl.disabled = user.isSocialAccount;
        this._notVerifiedEmailStateEl.classList.toggle('g-hidden', user.isSocialAccount || user.isEmailVerified);
        this._verifiedEmailStateEl.classList.toggle('g-hidden', user.isSocialAccount || !user.isEmailVerified);
    }

    _renderUsername() {
        let user = this.$domain.getUserData();
        this._usernameEl.innerHTML = user.username;
    }

    _renderPasswordField() {
        let user = this.$domain.getUserData();
        this._passwordFieldEl.classList.toggle('g-hidden', user.isSocialAccount);
    }

    _onUserLogoutBtnClick() {
        this.$domain.logout().then(redirectUrl => {
            location.href = redirectUrl;
        });
    }

    _onEmailEditBtnClick() {
        let emailFieldEditor = new EmailFieldEditorView((newEmail) => {
            this._showMainContant();
            if (newEmail) {
                this._renderEmail();
            }
        });
        this._showFieldEditor(emailFieldEditor);
    }

    _onUsernameEditBtnClick() {
        let usernameFieldEditor = new UsernameFieldEditorView((newUsername) => {
            this._showMainContant();
            if (newUsername) {
                this._renderUsername();
            }
        });
        this._showFieldEditor(usernameFieldEditor);
    }

    _onPasswordEditBtnClick() {
        let passwordFieldEditor = new PasswordFieldEditorView(() => {
            this._showMainContant();
        });
        this._showFieldEditor(passwordFieldEditor);
    }

    _onVerifyEmailRequestBtnClick() {
        this.$domain.verifyEmailRequest();
    }

}

export {
    UserTab
}