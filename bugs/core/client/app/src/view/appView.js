import './appStyles.css';

import { WorldView } from './world/worldView';
import { AccountView } from './account/accountView';
import { PanelView } from './panel/panelView';

class AppView {
    constructor(document, domainFacade) {
        this._document = document;
        this._domainFacade = domainFacade;

        this._render();
    }

    _render() {
        let worldEl = this._document.querySelector('[data-world]');
        this._worldView = new WorldView(worldEl, this._domainFacade);

        let accountViewEl = this._document.querySelector('[data-account-view]');
        this._accountView = new AccountView(accountViewEl, this._domainFacade);

        let panelViewEl = this._document.querySelector('[data-panel]');
        this._panelView = new PanelView(panelViewEl);
    }
}

export { AppView }