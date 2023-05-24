import './worldStyles.css';

import * as PIXI from 'pixi.js';
import { AntView } from './antView';
import { TownView } from './townView';
import { FoodView } from './foodView';
import { Camera } from './camera';
import { FoodAreaView } from './foodArea';
import { BaseGraphicView } from '../base/baseGraphicView';
import { EntityTypes } from '../../domain/enum/entityTypes';

class WorldView extends BaseGraphicView {

    constructor(el, domainFacade) {
        super();
        this._domainFacade = domainFacade;
        this._el = el;
        this._entityViews = [];
        this._textures = {};
        this._canvasWidth = window.innerWidth;
        this._canvasHeight = window.innerHeight;

        this._domainFacade.events.on('loginStatusChanged', this._renderLoginStatus.bind(this));
        this._domainFacade.events.on('worldCleared', this._onWorldCleared.bind(this));

        this._init();

        this._renderLoginStatus();
    }

    async _init() {
        await WorldView.textureManager.prepareTextures();

        this._app = new PIXI.Application({ width: this._canvasWidth, height: this._canvasHeight, background: 0xffffff, });
        this._el.appendChild(this._app.view);

        this._entityContainer = new PIXI.Container();
        this._app.stage.addChild(this._entityContainer);

        this._bg = new PIXI.TilingSprite(WorldView.textureManager.getTexture('grass.png'));
        this._entityContainer.addChild(this._bg);

        this._camera = new Camera(this._entityContainer, this._bg, { 
            width: this._canvasWidth, 
            height: this._canvasHeight
        });

        this._domainFacade.events.on('wholeWorldInited', this._onWholeWorldInit.bind(this));
        if (this._domainFacade.isWholeWorldInited()) {
            this._onWholeWorldInit();
        }

        this._domainFacade.events.on('entityBorn', this._onEntityBorn.bind(this));
    }

    _toggle(isEnabled) {
        this._el.classList.toggle('hidden', !isEnabled);
    }

    _onWholeWorldInit() {
        let worldSize = this._domainFacade.getWorldSize();

        this._bg.width = worldSize[0];
        this._bg.height = worldSize[1];

        this._camera.setMapSize(worldSize[0], worldSize[1]);

        this._buildEntityViews();
    }

    _onEntityBorn(entity) {
        this._buildEntityView(entity);
    }

    _buildEntityViews() {
        let entities = this._domainFacade.getEntities();
        entities.forEach(entity => {
            let view = this._buildEntityView(entity);
            this._entityViews.push(view);
        });
    }

    _buildEntityView(entity) {
        switch (entity.type) {
            case EntityTypes.ANT:
                return new AntView(entity, this._entityContainer);
            case EntityTypes.TOWN:
                return new TownView(entity, this._entityContainer);
            case EntityTypes.FOOD:
                return new FoodView(entity, this._entityContainer);
            case EntityTypes.FOOD_AREA:
                return new FoodAreaView(entity, this._entityContainer);
            default:
                throw 'unknown type of entity';
        }
    }

    _renderLoginStatus() {
        let isLoggedIn = this._domainFacade.isLoggedIn();
        this._toggle(isLoggedIn);
    }

    _onWorldCleared() {
        this._entityViews.forEach(view => {
            view.remove();
        });
        this._entityViews = [];
    }

}

export { WorldView }