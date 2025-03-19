import * as PIXI from 'pixi.js';
import { BaseGraphicView } from "@view/base/baseGraphicView";
import { AntView } from './entitiesViews/antView';
import { NestView } from './entitiesViews/nestView';
import { EntityTypes } from "@domain/enum/entityTypes";
import { ItemView } from './entitiesViews/itemView';
import { ItemSourceView } from './entitiesViews/itemSourceView';
import { ItemAreaView } from './entitiesViews/itemAreaView';
import { TreeView } from './entitiesViews/treeView';
import { LadybugView } from './entitiesViews/ladybugView';
import { MarkersDemonstratorView } from './markersDemonstratorView';
import { CONSTS } from '@domain/consts';
import { VIEW_SETTINGS } from '@view/viewSettings';

class WorldView extends BaseGraphicView {

    constructor(container) {
        super();
        this._container = container;
        
        this._entityViews = [];
        this._textures = {};

        this._render();

        this.$domain.events.on('entityBorn', this._onEntityBorn.bind(this));
    }

    _render() {
        let worldSize = this.$domain.getWorldSize();
        this._bg = new PIXI.TilingSprite({
            texture: this.$textureManager.getTexture('grass.png'),
            width: worldSize[0],
            height: worldSize[1],
        });
        this._antContainer = new PIXI.Container();
        this._ladybugContainer = new PIXI.Container();
        this._itemContainer = new PIXI.Container();
        this._bigContainer = new PIXI.Container();
        this._nestContainer = new PIXI.Container();
        this._itemAreaContainer = new PIXI.Container();
        this._itemSourceContainer = new PIXI.Container();
        this._treesContainer = new PIXI.Container();
        this._markerDemonstratorContainer = new PIXI.Container();
        this._chunksGridContainer = new PIXI.Container();

        this._container.addChild(this._bg);
        this._container.addChild(this._nestContainer);
        this._container.addChild(this._itemContainer);
        this._container.addChild(this._antContainer);
        this._container.addChild(this._ladybugContainer);
        this._container.addChild(this._bigContainer);
        this._container.addChild(this._itemSourceContainer);
        this._container.addChild(this._treesContainer);
        this._container.addChild(this._itemAreaContainer);
        this._container.addChild(this._markerDemonstratorContainer);
        this._container.addChild(this._chunksGridContainer);

        this._markerDemonstrator = new MarkersDemonstratorView(this._markerDemonstratorContainer);

        this._buildEntityViews();
        if (VIEW_SETTINGS.showMapChunkGrid) {
            this._renderMapChunksGrid();
        }
    }

    _onEntityBorn(entity) {
        this._buildEntityView(entity);
    }

    _buildEntityViews() {
        let entities = this.$domain.getEntities();
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
            case EntityTypes.LADYBUG:
                view = new LadybugView(entity, this._ladybugContainer);
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

    _renderMapChunksGrid() {
        let worldSize = this.$domain.getWorldSize();
        let mapWidth = worldSize[0];
        let mapHeight = worldSize[1];
        let chunkWidth = CONSTS.MAP_CHUNK_SIZE[0];
        let chunkHeight = CONSTS.MAP_CHUNK_SIZE[1];
        let colsCount = Math.ceil(mapWidth / chunkWidth);
        let rowsCount = Math.ceil(mapHeight / chunkHeight);
        for (let col = 0; col < colsCount; col++) {
            for (let row = 0; row < rowsCount; row++) {
                let x = col * chunkWidth;
                let y = row * chunkHeight;
                let graphics = new PIXI.Graphics();
                graphics.rect(x, y, chunkWidth - 1, chunkHeight - 1).stroke({width: 1, color: 0xFF0000});
                this._chunksGridContainer.addChild(graphics);
            }
        }
    }

}

export {
    WorldView
}