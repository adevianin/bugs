import * as PIXI from 'pixi.js';
import { BaseGraphicView } from "@view/base/baseGraphicView";
import { AntView } from './entitiesViews/antView';
import { NestView } from './entitiesViews/nestView';
import { EntityTypes } from "@domain/enum/entityTypes";
import { ItemView } from './entitiesViews/itemView';
import { LeafItemView } from './entitiesViews/leafItemView';
import { ItemSourceView } from './entitiesViews/itemSourceView';
import { ItemAreaView } from './entitiesViews/itemAreaView';
import { TreeView } from './entitiesViews/treeView';
import { LadybugView } from './entitiesViews/ladybugView';
import { MarkersDemonstratorView } from './markersDemonstratorView';
import { CONSTS } from '@domain/consts';
import { VIEW_SETTINGS } from '@view/viewSettings';
import { ItemTypes } from '@domain/enum/itemTypes';
import { EntityHightlighterView } from './entitiesViews/entityHighlighterView';

class WorldView extends BaseGraphicView {

    constructor(container) {
        super();
        this._container = container;
        this._currentEntities = [];
        this._currentEntityViews = {};
        
        this._render();

        this.$eventBus.on('highlightEntity', this._onHighlightEntity.bind(this));
    }

    entityGotIntoView(entity) {
        this._currentEntities.push(entity);
        this._addEntityView(entity);
    }

    entityGotOutOfView(entityId) {
        this._removeEntityView(entityId);
        this._removeEntityFromArray(entityId);
    }

    checkIsRefreshAnimationsNeeded() {
        for (let entityId in this._currentEntityViews) {
            let entityView = this._currentEntityViews[entityId];
            if (entityView.checkIsRefreshAnimationsNeeded()) {
                console.warn(`refresh animations in world view is needed. entity id=${entityId}`);
                return true;
            }
        }

        return false;
    }

    async refresh() {
        for (let entityId in this._currentEntityViews) {
            let entityView = this._currentEntityViews[entityId];
            entityView.remove();
        }

        this._currentEntityViews = {};
        this._currentEntities = [];
        
        let entities = await this.$domain.getEntitiesInCurrentViewRect();
        this._currentEntities = entities;
        for (let entity of entities) {
            this._addEntityView(entity);
        }
        console.warn('world view animations refreshed');
    }

    updateCurrentEntities(entities) {
        this._currentEntities = entities;

        let currentEntitiesIds = this._currentEntities.map(e => e.id);
        for (let entityId in this._currentEntityViews) {
            entityId = parseInt(entityId);
            if (!currentEntitiesIds.includes(entityId)) {
                this._removeEntityView(entityId);
            }
        }

        for (let entity of this._currentEntities) {
            if (!this._currentEntityViews[entity.id]) {
                this._addEntityView(entity);
            }
        }
    }

    _render() {
        this._antContainer = new PIXI.Container();
        this._ladybugContainer = new PIXI.Container();
        this._itemContainer = new PIXI.Container();
        this._nestContainer = new PIXI.Container();
        this._itemAreaContainer = new PIXI.Container();
        this._itemSourceContainer = new PIXI.Container();
        this._treesContainer = new PIXI.Container();
        this._markerDemonstratorContainer = new PIXI.Container();
        this._chunksGridContainer = new PIXI.Container();

        this._liveEntityHudLayer = new PIXI.RenderLayer();
        this._nestHudLayer = new PIXI.RenderLayer();

        this._container.addChild(this._nestContainer);
        this._container.addChild(this._ladybugContainer);
        this._container.addChild(this._antContainer);
        this._container.addChild(this._itemContainer);
        this._container.addChild(this._itemSourceContainer);
        this._container.addChild(this._treesContainer);
        this._container.addChild(this._itemAreaContainer);
        this._container.addChild(this._markerDemonstratorContainer);
        this._container.addChild(this._chunksGridContainer);

        this._container.addChild(this._nestHudLayer);
        this._container.addChild(this._liveEntityHudLayer);

        this._markerDemonstrator = new MarkersDemonstratorView(this._markerDemonstratorContainer);

        if (VIEW_SETTINGS.showMapChunkGrid) {
            this._renderMapChunksGrid();
        }
        if (VIEW_SETTINGS.showViewChunkGrid) {
            this._renderViewChunksGrid();
        }
    }

    _buildEntityView(entity) {
        let view = null;
        switch (entity.type) {
            case EntityTypes.ANT:
                view = new AntView(entity, this._antContainer, this._liveEntityHudLayer);
                break;
            case EntityTypes.LADYBUG:
                view = new LadybugView(entity, this._ladybugContainer, this._liveEntityHudLayer);
                break;
            case EntityTypes.NEST:
                view = new NestView(entity, this._nestContainer, this._nestHudLayer);
                break;
            case EntityTypes.ITEM:
                if (entity.itemType == ItemTypes.LEAF) {
                    view = new LeafItemView(entity, this._itemContainer);
                } else {
                    view = new ItemView(entity, this._itemContainer);
                }
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
        return view;
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

    async _renderViewChunksGrid() {
        let chunkShapes = await this.$domain.getChunkShapesDebug();
        for (let shape of chunkShapes) {
            let graphics = new PIXI.Graphics();
            graphics
                .rect(shape.x, shape.y, shape.width - 1, shape.height - 1)
                .stroke({width: 1, color: 0xFFFF00});
            this._chunksGridContainer.addChild(graphics);
        }
    }

    _removeEntityView(entityId, removeDelay) {
        let view = this._currentEntityViews[entityId];
        delete this._currentEntityViews[entityId];
        if (removeDelay) {
            setTimeout(() => {
                view.remove();
            }, removeDelay);
        } else {
            view.remove();
        }
    }

    _addEntityView(entity) {
        let view = this._buildEntityView(entity);
        view.events.on('playedDiedAnimation', removeDelay => {
            this._removeEntityView(entity.id, removeDelay);
            this._removeEntityFromArray(entity.id);
        });
        this._currentEntityViews[entity.id] = view;
    }

    _removeEntityFromArray(entityId) {
        let index = this._currentEntities.findIndex(e => e.id == entityId);
        if (index != -1) {
            this._currentEntities.splice(index, 1);
        }
    }

    _onHighlightEntity(params) {
        EntityHightlighterView.registerHighlightEntityRequest(params);
    }

}

export {
    WorldView
}