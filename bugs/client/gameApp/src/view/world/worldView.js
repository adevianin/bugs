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
import { SEASON_TYPES } from '@domain/enum/season_types';

class WorldView extends BaseGraphicView {

    constructor(container) {
        super();
        this._container = container;
        
        this._render();

        this.$domain.events.on('entityBorn', this._onEntityBorn.bind(this));
        this.$domain.events.on('currentSeasonChanged', this._onSeasonChanged.bind(this));
        if (VIEW_SETTINGS.showPlayerViewRect) {
            this.$eventBus.on('viewPointChanged', this._onViewPointChanged.bind(this));
        }
    }

    _render() {
        let worldSize = this.$domain.getWorldSize();
        this._bgSummer = new PIXI.TilingSprite({
            texture: this.$textureManager.getTexture('grass_summer.png'),
            width: worldSize[0],
            height: worldSize[1],
        });
        this._bgAutumn = new PIXI.TilingSprite({
            texture: this.$textureManager.getTexture('grass_autumn.png'),
            width: worldSize[0],
            height: worldSize[1],
        });
        this._bgWinter = new PIXI.TilingSprite({
            texture: this.$textureManager.getTexture('grass_winter.png'),
            width: worldSize[0],
            height: worldSize[1],
        });
        this._antContainer = new PIXI.Container();
        this._ladybugContainer = new PIXI.Container();
        this._itemContainer = new PIXI.Container();
        this._nestContainer = new PIXI.Container();
        this._itemAreaContainer = new PIXI.Container();
        this._itemSourceContainer = new PIXI.Container();
        this._treesContainer = new PIXI.Container();
        this._markerDemonstratorContainer = new PIXI.Container();
        this._chunksGridContainer = new PIXI.Container();
        this._viewRectContainer = new PIXI.Container();

        this._antHudLayer = new PIXI.RenderLayer();
        this._nestHudLayer = new PIXI.RenderLayer();

        this._container.addChild(this._bgSummer);
        this._container.addChild(this._bgAutumn);
        this._container.addChild(this._bgWinter);
        this._container.addChild(this._nestContainer);
        this._container.addChild(this._ladybugContainer);
        this._container.addChild(this._antContainer);
        this._container.addChild(this._itemContainer);
        this._container.addChild(this._itemSourceContainer);
        this._container.addChild(this._treesContainer);
        this._container.addChild(this._itemAreaContainer);
        this._container.addChild(this._markerDemonstratorContainer);
        this._container.addChild(this._chunksGridContainer);
        this._container.addChild(this._viewRectContainer);

        this._container.addChild(this._antHudLayer);
        this._container.addChild(this._nestHudLayer);

        this._markerDemonstrator = new MarkersDemonstratorView(this._markerDemonstratorContainer);

        this._renderCurrentSeason();

        this._buildEntityViews();
        if (VIEW_SETTINGS.showMapChunkGrid) {
            this._renderMapChunksGrid();
        }
        if (VIEW_SETTINGS.showViewChunkGrid) {
            this._renderViewChunksGrid();
        }
    }

    _renderCurrentSeason() {
        let currenSeason = this.$domain.currentSeason;
        this._bgSummer.renderable = currenSeason == SEASON_TYPES.SPRING || currenSeason == SEASON_TYPES.SUMMER;
        this._bgAutumn.renderable = currenSeason == SEASON_TYPES.AUTUMN;
        this._bgWinter.renderable = currenSeason == SEASON_TYPES.WINTER;
    }

    _onSeasonChanged() {
        this._renderCurrentSeason();
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
                view = new AntView(entity, this._antContainer, this._antHudLayer);
                break;
            case EntityTypes.LADYBUG:
                view = new LadybugView(entity, this._ladybugContainer);
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

    _renderViewChunksGrid() {
        for (let chunk of Object.values(this.$domain.world.chunks)) {
            let graphics = new PIXI.Graphics();
            graphics
                .rect(chunk.shape.x, chunk.shape.y, chunk.shape.width - 1, chunk.shape.height - 1)
                .stroke({width: 1, color: 0xFFFF00});
            this._chunksGridContainer.addChild(graphics);
        }
    }

    _onViewPointChanged(viewPoint, viewRect) {
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

export {
    WorldView
}