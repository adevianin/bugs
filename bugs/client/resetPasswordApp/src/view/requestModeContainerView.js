import { BaseHTMLView } from "@common/view/base/baseHTMLView";
import { MESSAGE_IDS } from "../messages/messageIds";
import { DotsLoaderView } from "@common/view/dotsLoader/dotsLoaderView";

class RequestModeContainerView extends BaseHTMLView {
    constructor(el, accountService) {
        super(el);
        this._accountService = accountService;

        this._render();

        this._requestCreatingSendBtn.addEventListener('click', this._onRequestCreatingSendBtnClick.bind(this));
    }

    _render() {
        this._requestCreatingTabEl = this._el.querySelector('[data-request-creating-tab]');
        this._requestCreatingSendBtn = this._requestCreatingTabEl.querySelector('[data-send]');
        this._emailEl = this._requestCreatingTabEl.querySelector('[data-email]');
        this._emailErrContainer = this._requestCreatingTabEl.querySelector('[data-email-err]');
        this._requestErrContainer = this._requestCreatingTabEl.querySelector('[data-request-err]');
        this._requestCreatingLoader = new DotsLoaderView(this._requestCreatingTabEl.querySelector('[data-loader]'));
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
            return MESSAGE_IDS.EMAIL_INVALID;
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
        try {
            this._requestCreatingLoader.toggle(true);
            await this._accountService.resetPasswordRequest(email);
            this._switchRequestDoneTab();
        } catch (e) {
            this._renderRequestErr(MESSAGE_IDS.SOMETHING_WENT_WRONG);
        }
        this._requestCreatingLoader.toggle(false);
    }

    _renderRequestErr(errId) {
        this._requestErrContainer.innerHTML = errId ? this.$mm.get(errId) : '';
    }

    _switchRequestDoneTab() {
        this._requestCreatingTabEl.classList.add('g-hidden');
        this._requestDoneTabEl.classList.remove('g-hidden');
    }
}

export {
    RequestModeContainerView
}