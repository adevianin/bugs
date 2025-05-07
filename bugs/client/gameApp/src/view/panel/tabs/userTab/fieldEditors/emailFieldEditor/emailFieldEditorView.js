import emailFieldEditorTmpl from './emailFieldEditorTmpl.html';
import { BaseFieldEditor } from '../baseFieldEditor';
import { DotsLoaderView } from '@common/view/dotsLoader/dotsLoaderView';
import { GAME_MESSAGE_IDS } from '@messages/messageIds';

class EmailFieldEditorView extends BaseFieldEditor {

    constructor(onDone) {
        super(onDone);

        this._render();

        this._cancelBtn.addEventListener('click', this._onCancelBtnClick.bind(this));
        this._okBtn.addEventListener('click', this._onOkBtnClick.bind(this));
    }

    remove() {
        super.remove();
        this._loader.remove();
    }

    _render() {
        this._el.innerHTML = emailFieldEditorTmpl;

        this._errContainer = this._el.querySelector('[data-err-container]');
        this._loader = new DotsLoaderView(this._el.querySelector('[data-loader]'));

        this._okBtn = this._el.querySelector('[data-ok]');
        this._okBtn.innerHTML = this.$mm.get(GAME_MESSAGE_IDS.EMAIL_EDITOR_OK_BTN_LABEL);
        this._cancelBtn = this._el.querySelector('[data-cancel]');
        this._cancelBtn.innerHTML = this.$mm.get(GAME_MESSAGE_IDS.EMAIL_EDITOR_CANCEL_BTN_LABEL);
        
        this._passwordEl = this._el.querySelector('[data-password]');
        this._emailEl = this._el.querySelector('[data-email]');
        let user = this.$domain.getUserData();
        this._emailEl.value = user.email;

        this._el.querySelector('[data-password-label]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.EMAIL_EDITOR_PASSWORD_LABEL);
    }

    _renderErr(errId) {
        this._errContainer.innerHTML = errId ? this.$mm.get(errId) : '';
    }

    _onCancelBtnClick() {
        this._onDone(null);
    }

    async _onOkBtnClick() {
        this._loader.toggle(true);
        let newEmail = this._emailEl.value;
        let password = this._passwordEl.value;
        let err = await this.$domain.changeEmail(newEmail, password);
        this._renderErr(err);
        this._loader.toggle(false);
        if (!err) {
            this._onDone(newEmail);
        }
    }

}

export {
    EmailFieldEditorView
}