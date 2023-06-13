import './worldStyles.css';

import * as PIXI from 'pixi.js';
import { AntView } from './antView';
import { NestView } from './nestView';
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
        this._canvasWidth = el.offsetWidth;
        this._canvasHeight = el.offsetHeight;

        this._domainFacade.events.on('worldCleared', this._onWorldCleared.bind(this));

        this._init();
    }

    async _init() {
        await WorldView.textureManager.prepareTextures();

        this._app = new PIXI.Application();
        this._app.resizeTo = this._el;
        this._el.appendChild(this._app.view);

        this._bg = new PIXI.TilingSprite(WorldView.textureManager.getTexture('grass.png'));
        this._entityContainer = new PIXI.Container();
        this._antContainer = new PIXI.Container();
        this._foodContainer = new PIXI.Container();
        this._nestContainer = new PIXI.Container();
        this._foodAreaContainer = new PIXI.Container();

        this._app.stage.addChild(this._entityContainer);

        this._entityContainer.addChild(this._bg);
        this._entityContainer.addChild(this._nestContainer);
        this._entityContainer.addChild(this._foodAreaContainer);
        this._entityContainer.addChild(this._foodContainer);
        this._entityContainer.addChild(this._antContainer);

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
            let view = this._buildEntityView(entity);
            this._entityViews.push(view);
        });
    }

    _buildEntityView(entity) {
        switch (entity.type) {
            case EntityTypes.ANT:
                return new AntView(entity, this._antContainer);
            case EntityTypes.NEST:
                return new NestView(entity, this._nestContainer);
            case EntityTypes.FOOD:
                return new FoodView(entity, this._foodContainer);
            case EntityTypes.FOOD_AREA:
                return new FoodAreaView(entity, this._foodAreaContainer);
            default:
                throw 'unknown type of entity';
        }
    }

    _onWorldCleared() {
        this._entityViews.forEach(view => {
            view.remove();
        });
        this._entityViews = [];
    }

}

export { WorldView }