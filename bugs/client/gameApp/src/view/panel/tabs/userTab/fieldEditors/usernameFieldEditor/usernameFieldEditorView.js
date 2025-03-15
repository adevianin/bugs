import usernameFieldEditorTmpl from './usernameFieldEditorTmpl.html';
import { BaseFieldEditor } from '../baseFieldEditor';
import { DotsLoaderView } from '@common/view/dotsLoader/dotsLoaderView';
import { AccountUsernameErrorView } from '@common/view/errors/accountUsernameErrorView';

class UsernameFieldEditorView extends BaseFieldEditor {

    constructor(onDone) {
        super(onDone);

        this._render();

        this._cancelBtn.addEventListener('click', this._onCancelBtnClick.bind(this));
        this._okBtn.addEventListener('click', this._onOkBtnClick.bind(this));
    }

    _render() {
        this._el.innerHTML = usernameFieldEditorTmpl;

        this._errView = new AccountUsernameErrorView(this._el.querySelector('[data-err-container]'));
        this._loader = new DotsLoaderView(this._el.querySelector('[data-loader]'));

        this._okBtn = this._el.querySelector('[data-ok]');
        this._cancelBtn = this._el.querySelector('[data-cancel]');
        
        this._usernameEl = this._el.querySelector('[data-username]');
        let user = this.$domainFacade.getUserData();
        this._usernameEl.value = user.username;
    }

    _onCancelBtnClick() {
        this._onDone(null);
    }

    async _onOkBtnClick() {
        this._loader.toggle(true);
        let newUsername = this._usernameEl.value;
        let err = await this.$domainFacade.changeUsername(newUsername);
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