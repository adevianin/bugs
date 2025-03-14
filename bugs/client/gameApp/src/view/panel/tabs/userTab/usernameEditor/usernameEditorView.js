import { BaseGameHTMLView } from "@view/base/baseGameHTMLView";
import usernameEditorTmpl from './usernameEditorTmpl.html';
import { AccountUsernameErrorView } from "@common/view/errors/accountUsernameErrorView";
import { ValueEditorView } from "@common/view/valueEditor/valueEditorView";

class UsernameEditorView extends BaseGameHTMLView {

    constructor(el) {
        super(el);

        this._render();
    }

    _render() {
        let user = this.$domainFacade.getUserData();
        this._el.innerHTML = usernameEditorTmpl;

        this._valueEditor = new ValueEditorView(this._el.querySelector('[data-username-value-editor]'), user.username, async (newUsername) => {
            let err = await this.$domainFacade.changeUsername(newUsername);
            this._renderUsernameErr(err);
            return !err;
        });
        this._valueEditor.events.addListener('editCanceled', () => this._renderUsernameErr(null));
        this._usernameErrView = new AccountUsernameErrorView(this._el.querySelector('[data-username-err-container]'));
    }

    _renderUsernameErr(err) {
        this._usernameErrView.setErr(err);
    }

}

export {
    UsernameEditorView
}