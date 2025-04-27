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
import { VIEW_SETTINGS } from '@view/viewSettings';

class AppView extends BaseGameHTMLView {
    constructor(el) {
        super(el);

        this.$domain.events.on('worldInited', this._onWorldInited.bind(this));
        this.$domain.events.on('stepPack', this._onStepPack.bind(this));
        this.$eventBus.on('viewPointChanged', this._onViewPointChanged.bind(this));
    }

    _render() {
        this._el.innerHTML = appTmpl;
        this._el.classList.add('app');

        // new ClimateView(this._el.querySelector('[data-climate]'));
        new PanelView(this._el.querySelector('[data-panel]'));
        
        let canvasContainerEl = this._el.querySelector('[data-canvas-container]');
        this.$pixiApp.resizeTo = canvasContainerEl;
        canvasContainerEl.appendChild(this.$pixiApp.canvas);

        let globalContainer = new PIXI.Container();
        this.$pixiApp.stage.addChild(globalContainer);
        new MapController(globalContainer, this.$pixiApp);

        let worldContainer = new PIXI.Container();
        globalContainer.addChild(worldContainer);
        this._worldView = new WorldView(worldContainer);

        let mapPickerContainer = new PIXI.Container();
        worldContainer.addChild(mapPickerContainer);
        new MapPickerMasterView(mapPickerContainer, this._el.querySelector('[data-map-picker-border]'));

        new HelpView(this._el.querySelector('[data-help]'));

        this._viewRectContainer = new PIXI.Container();
        globalContainer.addChild(this._viewRectContainer);
        
        this.$pixiApp.resize();
    }

    _onWorldInited() {
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

    async _onStepPack(stepPack) {
        if (this._worldView.checkIsRefreshAnimationsNeeded()) {
            await this._worldView.refresh();
            return;
        }

        for (let viewRectMigration of stepPack.viewRectMigrations) {
            if (viewRectMigration.isMigrationIntoViewRect) {
                this._worldView.entityGotIntoView(viewRectMigration.entity);
            } else {
                this._worldView.entityGotOutOfView(viewRectMigration.entityId);
            }
        }

        for (let entityAnim of stepPack.entityAnimations) {
            this.$eventBus.emit(`entityActionAnimationRequest:${entityAnim.entityId}:${entityAnim.actionType}`, entityAnim.animationParams)
        }
    }

    async _onViewPointChanged(viewPoint, viewRect) {
        if (VIEW_SETTINGS.showPlayerViewRect) {
            this._renderViewRect(viewRect);
        }
        let result = await this.$domain.changePlayerViewPoint(viewPoint, viewRect);
        if (result.isSomeChunkVisibilityChanged) {
            this._worldView.updateCurrentEntities(result.entities);
            this.$eventBus.emit('chunkVisibilityChanged');
        }
    }

    _renderViewRect(viewRect) {
        if (this._viewRectGraphics) {
            this._viewRectContainer.removeChild(this._viewRectGraphics);
        }
        this._viewRectGraphics = new PIXI.Graphics();
        this._viewRectGraphics
            .rect(viewRect.x, viewRect.y, viewRect.width, viewRect.height)
            .stroke({width: 1, color: 0x0000FF});
        this._viewRectContainer.addChild(this._viewRectGraphics);
    }
}

export { AppView }