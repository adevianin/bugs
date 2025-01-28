import './appStyles.css';

import { BaseHTMLView } from './base/baseHTMLView';
import { GameView } from './game/gameView';
import appTmpl from './appTmpl.html';

class AppView extends BaseHTMLView {
    constructor(el, pixiApp) {
        super(el);
        this._pixiApp = pixiApp;

        this.$domainFacade.events.on('initStepDone', this._onInitStepDone.bind(this));
    }

    _render() {
        this._el.innerHTML = appTmpl;

        let gameEl = this._el.querySelector('[data-game]');
        this._gameView = new GameView(gameEl, this._pixiApp);
    }

    _onInitStepDone() {
        this._render();
        this.events.emit('ready');
    }
}

export { AppView }