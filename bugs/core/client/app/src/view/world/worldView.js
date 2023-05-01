import './worldStyles.css';

import { EntityTypes } from '../../domain/entity/entityTypes';
import * as PIXI from 'pixi.js';
import { BugView } from './bugView';
import { TownView } from './townView';
import { FoodView } from './foodView';
import { Camera } from './camera';
import { BaseView } from './baseView';

class WorldView {

    constructor(el, domainFacade) {
        this._domainFacade = domainFacade;
        this._el = el;
        this._entityViews = [];
        this._textures = {};
        this._canvasWidth = window.innerWidth;
        this._canvasHeight = window.innerHeight;

        this._init();
    }

    async _init() {
        await BaseView.textureManager.prepareTextures();

        this._app = new PIXI.Application({ width: this._canvasWidth, height: this._canvasHeight, background: 0xffffff, });
        this._el.appendChild(this._app.view);

        this._entityContainer = new PIXI.Container();
        this._app.stage.addChild(this._entityContainer);

        this._bg = new PIXI.TilingSprite(BaseView.textureManager.getTexture('grass.png'));
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
            this._buildEntityView(entity);
        });
    }

    _buildEntityView(entity) {
        switch (entity.type) {
            case EntityTypes.BUG:
                new BugView(entity, this._entityContainer);
                break;
            case EntityTypes.TOWN:
                new TownView(entity, this._entityContainer);
                break;
            case EntityTypes.FOOD:
                new FoodView(entity, this._entityContainer);
                break;
        }
    }

}

export { WorldView }