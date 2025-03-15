import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';
import userTabTmpl from './userTabTmpl.html';
// import { UsernameEditorView } from './usernameEditor/usernameEditorView';
import { EmailFieldEditorView } from './fieldEditors/emailFieldEditor/emailFieldEditorView';
import { UsernameFieldEditorView } from './fieldEditors/usernameFieldEditor/usernameFieldEditorView';

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
    }

    _render() {
        this._el.innerHTML = userTabTmpl;

        this._mainContainerEl = this._el.querySelector('[data-main-contentainer]');
        this._fieldEditorContainerEl = this._el.querySelector('[data-field-editor-container]');

        this._emailEl = this._el.querySelector('[data-email]');
        this._emailEditBtnEl = this._el.querySelector('[data-edit-email-btn]');

        this._usernameEl = this._el.querySelector('[data-username]');
        this._usernameEditBtnEl = this._el.querySelector('[data-edit-username-btn]');
        // this._usernameEditorView = new UsernameEditorView(this._el.querySelector('[data-username-editor]'));

        this._userLogoutBtnEl = this._el.querySelector('[data-logout-btn]');

        this._renderEmail();
        this._renderUsername();
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
        let user = this.$domainFacade.getUserData();
        this._emailEl.innerHTML = user.email;
    }

    _renderUsername() {
        let user = this.$domainFacade.getUserData();
        this._usernameEl.innerHTML = user.username;
    }

    _onUserLogoutBtnClick() {
        this.$domainFacade.logout().then(redirectUrl => {
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

}

export {
    UserTab
}