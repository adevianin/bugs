import * as PIXI from 'pixi.js';
import { BaseGraphicView } from "@view/base/baseGraphicView";
import { AntView } from './entitiesViews/antView';
import { NestView } from './entitiesViews/nestView';
import { EntityTypes } from "@domain/enum/entityTypes";
import { MarkerManagerView } from './markerManager/markerManagerView';
import { GroundBeetleView } from './entitiesViews/groundBeetleView';
import { ItemView } from './entitiesViews/itemView';
import { ItemSourceView } from './entitiesViews/itemSourceView';
import { ItemAreaView } from './entitiesViews/itemAreaView';
import { TreeView } from './entitiesViews/treeView';

class WorldView extends BaseGraphicView {

    constructor(container) {
        super();
        this._container = container;
        
        this._entityViews = [];
        this._textures = {};

        this._render();
    }

    turnOn() {
        this._resizeBg();
        this._buildEntityViews();
    }

    turnOff() {
        this._clearEntityViews();
        this._markerManager.clear();
    }

    _render() {
        this._bg = new PIXI.TilingSprite(this.$textureManager.getTexture('grass.png'));
        this._antContainer = new PIXI.Container();
        this._groundBeetleContainer = new PIXI.Container();
        this._itemContainer = new PIXI.Container();
        this._bigContainer = new PIXI.Container();
        this._nestContainer = new PIXI.Container();
        this._itemAreaContainer = new PIXI.Container();
        this._itemSourceContainer = new PIXI.Container();
        this._treesContainer = new PIXI.Container();
        this._markersContainer = new PIXI.Container();

        this._container.addChild(this._bg);
        this._container.addChild(this._nestContainer);
        this._container.addChild(this._itemAreaContainer);
        this._container.addChild(this._itemContainer);
        this._container.addChild(this._antContainer);
        this._container.addChild(this._groundBeetleContainer);
        this._container.addChild(this._bigContainer);
        this._container.addChild(this._itemSourceContainer);
        this._container.addChild(this._treesContainer);
        this._container.addChild(this._markersContainer);

        this._markerManager = new MarkerManagerView(this._markersContainer);

        this.$domainFacade.events.on('entityBorn', this._onEntityBorn.bind(this));
    }

    _onEntityBorn(entity) {
        this._buildEntityView(entity);
    }

    _clearEntityViews() {
        this._entityViews.forEach(view => {
            view.remove();
        });
        this._entityViews = [];
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
            case EntityTypes.TREE:
                view = new TreeView(entity, this._treesContainer);
                break;
            default:
                throw 'unknown type of entity';
        }

        this._entityViews.push(view);
    }

    _resizeBg() {
        let worldSize = this.$domainFacade.getWorldSize();
        this._bg.width = worldSize[0];
        this._bg.height = worldSize[1];
    }

}

export {
    WorldView
}