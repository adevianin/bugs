import { BaseErrorView } from "./base/baseErrorView";
import { BASE_MESSAGE_IDS } from "@common/messages/messageIds";

class AccountUsernameErrorView extends BaseErrorView {

    setErr(err) {
        if (err) {
            switch (err.msgId) {
                case (BASE_MESSAGE_IDS.USERNAME_MIN_LENGTH_ERR):
                    this._el.innerHTML = this.$mm.format(err.msgId, err.minLength);
                    break;
                case (BASE_MESSAGE_IDS.USERNAME_MAX_LENGTH_ERR):
                    this._el.innerHTML = this.$mm.format(err.msgId, err.maxLength);
                    break;
                case (BASE_MESSAGE_IDS.USERNAME_INVALID_CHARS):
                case (BASE_MESSAGE_IDS.USERNAME_TAKEN):
                    this._el.innerHTML = this.$mm.format(err.msgId);
                    break;
            }
        } else {
            this._el.innerHTML = '';
        }
    }
}

export {
    AccountUsernameErrorView
}