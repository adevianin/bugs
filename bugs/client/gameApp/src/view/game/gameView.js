import './gameStyles.css';
import * as PIXI from 'pixi.js';
import { BaseHTMLView } from '@view/base/baseHTMLView';
import { Camera } from './camera';
import { WorldView } from './world';
import { Panel } from './panel';
import gameTmpl from './gameTmpl.html';

class GameView extends BaseHTMLView {

    constructor(el, pixiApp) {
        super(el);
        this._pixiApp = pixiApp;

        this._render();
    }

    _render() {
        this._el.innerHTML = gameTmpl;

        this._panelView = new Panel(this._el.querySelector('[data-panel]'));
        
        let canvasContainerEl = this._el.querySelector('[data-canvas-container]');
        this._pixiApp.resizeTo = canvasContainerEl;
        canvasContainerEl.appendChild(this._pixiApp.canvas);

        this._worldContainer = new PIXI.Container();
        this._pixiApp.stage.addChild(this._worldContainer);

        let worldSize = this.$domainFacade.getWorldSize();
        this._camera = new Camera(this._worldContainer, this._pixiApp.canvas, worldSize[0], worldSize[1]);

        this._worldView = new WorldView(this._worldContainer);

        this._pixiApp.resize();
    }

}

export { GameView }