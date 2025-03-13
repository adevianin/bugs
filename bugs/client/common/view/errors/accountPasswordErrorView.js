import { BaseErrorView } from "./base/baseErrorView";
import { BASE_MESSAGE_IDS } from "@common/messages/messageIds";

class AccountPasswordErrorView extends BaseErrorView {

    setErr(err) {
        if (err) {
            switch (err.msgId) {
                case (BASE_MESSAGE_IDS.PASSWORD_MIN_LENGTH_ERR):
                    this._el.innerHTML = this.$mm.format(err.msgId, err.minLength);
                    break;
                case (BASE_MESSAGE_IDS.PASSWORD_MAX_LENGTH_ERR):
                    this._el.innerHTML = this.$mm.format(err.msgId, err.maxLength);
                    break;
            }
        } else {
            this._el.innerHTML = '';
        }
    }
}

export {
    AccountPasswordErrorView
}