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

    turnOn() {
        this.toggle(true);
        this._setUpCamera();
        this._panelView.turnOn();
        this._worldView.turnOn();
        this._pixiApp.resize();
    }

    turnOff() {
        this.toggle(false);
        this._worldView.turnOff();
        this._panelView.turnOff();
    }

    _render() {
        this._el.innerHTML = gameTmpl;

        this._panelView = new Panel(this._el.querySelector('[data-panel]'));
        
        let canvasContainerEl = this._el.querySelector('[data-canvas-container]');
        this._pixiApp.resizeTo = canvasContainerEl;
        canvasContainerEl.appendChild(this._pixiApp.canvas);
        this._entityContainer = new PIXI.Container();
        this._mapHandler = new PIXI.Container();
        this._pixiApp.stage.addChild(this._entityContainer);
        this._entityContainer.addChild(this._mapHandler);
        this._worldView = new WorldView(this._entityContainer);

        this._camera = new Camera(this._entityContainer, this._mapHandler, this._pixiApp.canvas);
    }

    _setUpCamera() {
        let worldSize = this.$domainFacade.getWorldSize();
        let width = worldSize[0];
        let height = worldSize[1];

        this._mapHandler.hitArea = new PIXI.Rectangle(0, 0, width, height);
        this._camera.setMapSize(width, height);
    }

}

export { GameView }