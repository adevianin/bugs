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

        this._entityContainer = new PIXI.Container();
        this._pixiApp.stage.addChild(this._entityContainer);

        let worldSize = this.$domainFacade.getWorldSize();
        let mapWidth = worldSize[0];
        let mapHeight = worldSize[1];
        this._mapHandler = new PIXI.Container();
        this._entityContainer.addChild(this._mapHandler);
        this._mapHandler.eventMode = 'static';
        this._mapHandler.hitArea = new PIXI.Rectangle(0, 0, mapWidth, mapHeight);
        this._camera = new Camera(this._entityContainer, this._mapHandler, this._pixiApp.canvas, mapWidth, mapHeight);

        this._worldView = new WorldView(this._entityContainer);

        this._pixiApp.resize();
    }

}

export { GameView }