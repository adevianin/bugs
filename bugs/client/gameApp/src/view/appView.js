import './appStyles.css';
import appTmpl from './appTmpl.html';
import { BaseGameHTMLView } from './base/baseGameHTMLView';
import * as PIXI from 'pixi.js';
import { ClimateView } from './climate/climateView';
import { PanelView } from './panel';
import { MapController } from './mapController';
import { WorldView } from './world';
import { MapPickerMasterView } from './mapPickers/mapPickerMasterView';
import { randomInt } from '@utils/randomInt';
import { HelpView } from './help/helpView'; 

class AppView extends BaseGameHTMLView {
    constructor(el) {
        super(el);

        this.$domain.events.on('initStepDone', this._onInitStepDone.bind(this));
    }

    _render() {
        this._el.innerHTML = appTmpl;
        this._el.classList.add('app');

        new ClimateView(this._el.querySelector('[data-climate]'));
        new PanelView(this._el.querySelector('[data-panel]'));
        
        let canvasContainerEl = this._el.querySelector('[data-canvas-container]');
        this.$pixiApp.resizeTo = canvasContainerEl;
        canvasContainerEl.appendChild(this.$pixiApp.canvas);

        let globalContainer = new PIXI.Container();
        this.$pixiApp.stage.addChild(globalContainer);
        new MapController(globalContainer, this.$pixiApp);

        let worldContainer = new PIXI.Container();
        globalContainer.addChild(worldContainer);
        new WorldView(worldContainer);

        let mapPickerContainer = new PIXI.Container();
        worldContainer.addChild(mapPickerContainer);
        new MapPickerMasterView(mapPickerContainer, this._el.querySelector('[data-map-picker-border]'));

        new HelpView(this._el.querySelector('[data-help]'));
        
        this.$pixiApp.resize();
    }

    _onInitStepDone() {
        this._render();
        this._showStartPosition();
        this.events.emit('ready');
    }

    _showStartPosition() {
        let nest = this.$domain.findMyFirstNest();
        if (nest) {
            this.$eventBus.emit('nestManageRequest', nest);
            this.$eventBus.emit('showPointRequest', nest.position);
        } else {
            let worldSize = this.$domain.getWorldSize();
            this.$eventBus.emit('showPointRequest', {
                x: randomInt(0, worldSize[0]),
                y: randomInt(0, worldSize[1])
            });
        }
    }
}

export { AppView }