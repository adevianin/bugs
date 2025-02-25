import './global.css';
import './gameStyles.css';
import * as PIXI from 'pixi.js';
import { BaseHTMLView } from '@view/base/baseHTMLView';
import { Camera } from './camera';
import { WorldView } from './world';
import { Panel } from './panel';
import gameTmpl from './gameTmpl.html';
import { MapPickerMasterView } from './mapPickers/mapPickerMasterView';
import { ClimateView } from './climate/climateView';

class GameView extends BaseHTMLView {

    constructor(el) {
        super(el);

        this._render();
    }

    _render() {
        this._el.innerHTML = gameTmpl;

        this._climateView = new ClimateView(this._el.querySelector('[data-climate]'));

        new Panel(this._el.querySelector('[data-panel]'));
        
        let canvasContainerEl = this._el.querySelector('[data-canvas-container]');
        this.$pixiApp.resizeTo = canvasContainerEl;
        canvasContainerEl.appendChild(this.$pixiApp.canvas);

        let globalContainer = new PIXI.Container();
        this.$pixiApp.stage.addChild(globalContainer);
        new Camera(globalContainer);

        let worldContainer = new PIXI.Container();
        globalContainer.addChild(worldContainer);
        new WorldView(worldContainer);

        let mapPickerContainer = new PIXI.Container();
        worldContainer.addChild(mapPickerContainer);
        new MapPickerMasterView(mapPickerContainer, this._el.querySelector('[data-map-picker-border]'));
        
        this.$pixiApp.resize();
    }

}

export { GameView }