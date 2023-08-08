import './worldStyles.css';

import * as PIXI from 'pixi.js';
import { AntView } from './antView';
import { NestView } from './nestView';
import { FoodView } from './foodView';
import { Camera } from './camera';
import { FoodAreaView } from './foodArea';
import { BaseGraphicView } from '../base/baseGraphicView';
import { EntityTypes } from '../../domain/enum/entityTypes';
import { MarkerManagerView } from './markerManager/markerManagerView';
import { FoodSourceView } from './foodSourceView';

class WorldView extends BaseGraphicView {

    constructor(el) {
        super();
        this._el = el;
        this._entityViews = [];
        this._textures = {};

        this.$domainFacade.events.on('worldCleared', this._onWorldCleared.bind(this));

        this._init();
    }

    async _init() {
        await this.$textureManager.prepareTextures();

        this._app = new PIXI.Application({ resizeTo: this._el });
        this._el.appendChild(this._app.view);

        this._bg = new PIXI.TilingSprite(this.$textureManager.getTexture('grass.png'));
        this._entityContainer = new PIXI.Container();
        this._antContainer = new PIXI.Container();
        this._foodContainer = new PIXI.Container();
        this._nestContainer = new PIXI.Container();
        this._foodAreaContainer = new PIXI.Container();
        this._foodSourceContainer = new PIXI.Container();
        this._markersContainer = new PIXI.Container();

        this._app.stage.addChild(this._entityContainer);

        this._entityContainer.addChild(this._bg);
        this._entityContainer.addChild(this._nestContainer);
        this._entityContainer.addChild(this._foodAreaContainer);
        this._entityContainer.addChild(this._foodContainer);
        this._entityContainer.addChild(this._antContainer);
        this._entityContainer.addChild(this._foodSourceContainer);
        this._entityContainer.addChild(this._markersContainer);

        this._camera = new Camera(this._entityContainer, this._bg, this._app.view);

        this.$domainFacade.events.on('wholeWorldInited', this._onWholeWorldInit.bind(this));
        if (this.$domainFacade.isWholeWorldInited()) {
            this._onWholeWorldInit();
        }

        this.$domainFacade.events.on('entityBorn', this._onEntityBorn.bind(this));
    }

    _onWholeWorldInit() {
        this._setUpCamera();
        this._buildEntityViews();
        this._markerManager = new MarkerManagerView(this._markersContainer);
    }

    _onEntityBorn(entity) {
        this._buildEntityView(entity);
    }

    _buildEntityViews() {
        let entities = this.$domainFacade.getEntities();
        entities.forEach(entity => {
            this._buildEntityView(entity);
        });
    }

    _buildEntityView(entity) {
        let view = null;
        switch (entity.type) {
            case EntityTypes.ANT:
                view = new AntView(entity, this._antContainer);
                break;
            case EntityTypes.NEST:
                view = new NestView(entity, this._nestContainer);
                break;
            case EntityTypes.FOOD:
                view = new FoodView(entity, this._foodContainer);
                break;
            case EntityTypes.FOOD_AREA:
                view = new FoodAreaView(entity, this._foodAreaContainer);
                break;
            case EntityTypes.FOOD_SOURCE:
                view = new FoodSourceView(entity, this._foodSourceContainer);
                break;
            default:
                throw 'unknown type of entity';
        }

        this._entityViews.push(view);
    }

    _setUpCamera() {
        let worldSize = this.$domainFacade.getWorldSize();

        this._bg.width = worldSize[0];
        this._bg.height = worldSize[1];

        this._camera.setMapSize(worldSize[0], worldSize[1]);
    }

    _onWorldCleared() {
        this._entityViews.forEach(view => {
            view.remove();
        });
        this._entityViews = [];
        this._markerManager.remove();
    }

}

export { WorldView }