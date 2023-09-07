import './worldStyles.css';

import * as PIXI from 'pixi.js';
import { AntView } from './antView';
import { NestView } from './nestView';
import { Camera } from './camera';
import { BaseGraphicView } from '../base/baseGraphicView';
import { EntityTypes } from '../../domain/enum/entityTypes';
import { MarkerManagerView } from './markerManager/markerManagerView';
import { GroundBeetleView } from './groundBeetleView';
import { ItemView } from './itemView';
import { ItemSourceView } from './itemSourceView';
import { ItemAreaView } from './itemAreaView';

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
        this._groundBeetleContainer = new PIXI.Container();
        this._itemContainer = new PIXI.Container();
        this._bigContainer = new PIXI.Container();
        this._nestContainer = new PIXI.Container();
        this._itemAreaContainer = new PIXI.Container();
        this._itemSourceContainer = new PIXI.Container();
        this._markersContainer = new PIXI.Container();

        this._app.stage.addChild(this._entityContainer);

        this._entityContainer.addChild(this._bg);
        this._entityContainer.addChild(this._nestContainer);
        this._entityContainer.addChild(this._itemAreaContainer);
        this._entityContainer.addChild(this._itemContainer);
        this._entityContainer.addChild(this._antContainer);
        this._entityContainer.addChild(this._groundBeetleContainer);
        this._entityContainer.addChild(this._bigContainer);
        this._entityContainer.addChild(this._itemSourceContainer);
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
            case EntityTypes.GROUND_BEETLE:
                view = new GroundBeetleView(entity, this._groundBeetleContainer);
                break;
            case EntityTypes.NEST:
                view = new NestView(entity, this._nestContainer);
                break;
            case EntityTypes.ITEM:
                view = new ItemView(entity, this._bigContainer);
                break;
            case EntityTypes.ITEM_SOURCE:
                view = new ItemSourceView(entity, this._itemSourceContainer);
                break;
            case EntityTypes.ITEM_AREA:
                view = new ItemAreaView(entity, this._itemAreaContainer);
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