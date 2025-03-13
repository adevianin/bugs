import { BaseHTMLView } from "@common/view/base/baseHTMLView";
import { RequestModeContainerView } from "./requestModeContainerView";
import { SetPasswordModeView } from "./setPasswordModeView";

class ResetPasswordAppView extends BaseHTMLView {

    constructor(el, accountService) {
        super(el);
        this._accountService = accountService;

        this._render();
    }

    _render() {
        let requestModeEl = this._el.querySelector('[data-request-mode]');
        let setPasswordModeEl = this._el.querySelector('[data-set-password-mode]');

        if (requestModeEl) {
            this._modeView = new RequestModeContainerView(requestModeEl, this._accountService);
        } else if (setPasswordModeEl) {
            this._modeView = new SetPasswordModeView(setPasswordModeEl, this._accountService);
        }
        
    }

}

export {
    ResetPasswordAppView
}