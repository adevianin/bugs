import { BaseHTMLView } from "@common/view/base/baseHTMLView";
import { RESET_PASSWORD_MESSAGE_IDS } from "../messages/messageIds";

class RequestModeContainerView extends BaseHTMLView {
    constructor(el) {
        super(el);

        this._render();

        this._requestCreatingSendBtn.addEventListener('click', this._onRequestCreatingSendBtnClick.bind(this));
    }

    _render() {
        this._requestCreatingTabEl = this._el.querySelector('[data-request-creating-tab]');
        this._requestCreatingSendBtn = this._requestCreatingTabEl.querySelector('[data-send]');
        this._emailEl = this._requestCreatingTabEl.querySelector('[data-email]');
        this._emailErrContainer = this._requestCreatingTabEl.querySelector('[data-email-err]');
        this._requestDoneTabEl = this._el.querySelector('[data-request-done-tab]');
    }

    _validateRequestCreating() {
        let isError = false;

        let emailErr = this._validateEmail();
        this._renderEmailErr(emailErr);
        if (emailErr) {
            isError = true;
        }

        return !isError;
    }

    _validateEmail() {
        let email = this._emailEl.value;

        if (!email || !this._emailEl.checkValidity()) {
            return RESET_PASSWORD_MESSAGE_IDS.EMAIL_INVALID;
        }

        return null;
    }

    _renderEmailErr(errId) {
        this._emailErrContainer.innerHTML = errId ? this.$mm.get(errId) : '';
    }

    async _onRequestCreatingSendBtnClick() {
        if (!this._validateRequestCreating()) {
            return;
        }

        let email = this._emailEl.value;
        this.$domain.resetPasswordRequest(email);
        this._switchRequestDoneTab();
    }

    _switchRequestDoneTab() {
        this._requestCreatingTabEl.classList.add('g-hidden');
        this._requestDoneTabEl.classList.remove('g-hidden');
    }
}

export {
    RequestModeContainerView
}