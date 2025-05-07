import usernameFieldEditorTmpl from './usernameFieldEditorTmpl.html';
import { BaseFieldEditor } from '../baseFieldEditor';
import { DotsLoaderView } from '@common/view/dotsLoader/dotsLoaderView';
import { AccountUsernameErrorView } from '@common/view/errors/accountUsernameErrorView';
import { GAME_MESSAGE_IDS } from '@messages/messageIds';

class UsernameFieldEditorView extends BaseFieldEditor {

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
        this._el.innerHTML = usernameFieldEditorTmpl;

        this._errView = new AccountUsernameErrorView(this._el.querySelector('[data-err-container]'));
        this._loader = new DotsLoaderView(this._el.querySelector('[data-loader]'));

        this._okBtn = this._el.querySelector('[data-ok]');
        this._okBtn.innerHTML = this.$mm.get(GAME_MESSAGE_IDS.USERNAME_EDITOR_OK_BTN_LABEL);
        this._cancelBtn = this._el.querySelector('[data-cancel]');
        this._cancelBtn.innerHTML = this.$mm.get(GAME_MESSAGE_IDS.USERNAME_EDITOR_CANCEL_BTN_LABEL);
        
        this._usernameEl = this._el.querySelector('[data-username]');
        let user = this.$domain.getUserData();
        this._usernameEl.value = user.username;

        this._el.querySelector('[data-username-label]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.USERNAME_EDITOR_USERNAME_LABEL);
    }

    _onCancelBtnClick() {
        this._onDone(null);
    }

    async _onOkBtnClick() {
        this._loader.toggle(true);
        let newUsername = this._usernameEl.value;
        let err = await this.$domain.changeUsername(newUsername);
        this._errView.setErr(err);
        this._loader.toggle(false);
        if (!err) {
            this._onDone(newUsername);
        }
    }

}

export {
    UsernameFieldEditorView
}