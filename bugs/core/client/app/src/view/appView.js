import { WorldView } from './worldView';
import { AccountView } from './accountView';

class AppView {
    constructor(document, domainFacade, spritesheetManager) {
        this._document = document;
        this._domainFacade = domainFacade;
        this._spritesheetManager = spritesheetManager;

        this._render();
    }

    _render() {
        let worldEl = this._document.querySelector('[data-world]');
        this._worldView = new WorldView(worldEl, this._domainFacade, this._spritesheetManager);
        let accountViewEl = this._document.querySelector('[data-account-view]');
        this._accountView = new AccountView(accountViewEl, this._domainFacade);
    }

}

export { AppView }