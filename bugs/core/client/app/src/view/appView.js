import { WorldView } from './worldView';
import { AccountView } from './accountView';

class AppView {
    constructor(document, domainFacade) {
        this._document = document;
        this._domainFacade = domainFacade;
        this._initialData = this._parseInitialData();

        this._render();
    }

    _render() {
        let canvEl = this._document.getElementById('worldCanvas');
        this._worldView = new WorldView(canvEl, this._domainFacade);
        let accountViewEl = this._document.querySelector('[data-account-view]');
        this._accountView = new AccountView(accountViewEl, this._domainFacade);
    }

    _parseInitialData() {
        return JSON.parse(this._document.getElementById('initial-data').innerText);
    }
}

export { AppView }