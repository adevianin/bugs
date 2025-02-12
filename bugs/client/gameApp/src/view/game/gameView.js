import './gameStyles.css';
import * as PIXI from 'pixi.js';
import { BaseHTMLView } from '@view/base/baseHTMLView';
import { Camera } from './camera';
import { WorldView } from './world';
import { Panel } from './panel';
import gameTmpl from './gameTmpl.html';
import { MapPickerMasterView } from './mapPickers/mapPickerMasterView';

class GameView extends BaseHTMLView {

    constructor(el) {
        super(el);

        this._render();
    }

    _render() {
        this._el.innerHTML = gameTmpl;

        new Panel(this._el.querySelector('[data-panel]'));
        
        let canvasContainerEl = this._el.querySelector('[data-canvas-container]');
        this.$pixiApp.resizeTo = canvasContainerEl;
        canvasContainerEl.appendChild(this.$pixiApp.canvas);

        let worldContainer = new PIXI.Container();
        this.$pixiApp.stage.addChild(worldContainer);
        let worldSize = this.$domainFacade.getWorldSize();
        new Camera(worldContainer, this.$pixiApp.canvas, worldSize[0], worldSize[1]);
        new WorldView(worldContainer);

        let mapPickerBorderContainer = new PIXI.Container();
        this.$pixiApp.stage.addChild(mapPickerBorderContainer);
        let mapPickerContainer = new PIXI.Container();
        worldContainer.addChild(mapPickerContainer);
        new MapPickerMasterView(mapPickerContainer, mapPickerBorderContainer);
        
        this.$pixiApp.resize();
    }

}

export { GameView }