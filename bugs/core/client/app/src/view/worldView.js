import { EntityTypes } from '../domain/entity/entityTypes';
import * as PIXI from 'pixi.js';
import { BugView } from './world/bugView';
import { TownView } from './world/townView';
import { FoodView } from './world/foodView';

class WorldView {
    constructor(el, domainFacade, spritesheetManager) {
        this._domainFacade = domainFacade;
        this._spritesheetManager = spritesheetManager;
        this._el = el;
        this._entityViews = [];
        this._textures = {};

        this._init();
    }

    async _init() {
        this._initPixi();

        await this._spritesheetManager.prepareTextures();

        this._domainFacade.events.on('wholeWorldInited', this._onWholeWorldInit.bind(this));
        if (this._domainFacade.isWholeWorldInited()) {
            this._onWholeWorldInit();
        }

        this._domainFacade.events.on('entityBorn', this._onEntityBorn.bind(this));
    }

    _initPixi() {
        this._app = new PIXI.Application({ width: 1000, height: 500, background: 0xffffff, });
        this._el.appendChild(this._app.view);

        this._entityContainer = new PIXI.Container();
        this._app.stage.addChild(this._entityContainer);
    }

    _onWholeWorldInit() {
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
                new BugView(entity, this._spritesheetManager, this._entityContainer);
                break;
            case EntityTypes.TOWN:
                new TownView(entity, this._spritesheetManager, this._entityContainer);
                break;
            case EntityTypes.FOOD:
                new FoodView(entity, this._spritesheetManager, this._entityContainer);
                break;
        }
    }




    // async _loadTextures() {
    //     return {
    //         'bug': await PIXI.Assets.load(this._imagesData.bug)
    //     };
    // }

    // _renderWorld() {
    //     this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

    //     let entities = this._domainFacade.getEntities();
    //     entities.forEach(entity => {
    //         if (entity.isHidden()) {
    //             return;
    //         }
            
    //         switch (entity.type) {
    //             case EntityTypes.BUG:
    //                 this._renderBug(entity);
    //                 break;
    //             case EntityTypes.TOWN:
    //                 this._renderTown(entity);
    //                 break;
    //             case EntityTypes.FOOD:
    //                 this._renderFood(entity);
    //                 break;
    //         }
    //     });
    // }

    // _renderBug(bug) {
    //     let width = 10;
    //     let height = 10;
    //     let posX = bug.position.x - width / 2;
    //     let posY = bug.position.y - height / 2;
    //     this._ctx.fillStyle = 'red';
    //     this._ctx.strokeStyle = 'black';
    //     this._ctx.fillRect(posX, posY, width, height);
    //     this._ctx.beginPath();
    //     this._ctx.arc(posX, posY, 100, 0, 2 * Math.PI);
    //     this._ctx.stroke();

    //     if (bug.hasPickedFood()) {
    //         this._ctx.fillStyle = 'green';
    //         this._ctx.fillRect(posX, posY - 10, width, height);
    //     }
    // }

    // _renderTown(town) {
    //     let width = 40;
    //     let height = 40; 
    //     this._ctx.fillStyle = 'yellow';
    //     this._ctx.strokeStyle = 'black';
    //     let posX = town.position.x - width / 2;
    //     let posY = town.position.y - height / 2;
    //     this._ctx.fillRect(posX, posY, width, height)
    //     this._ctx.beginPath();
    //     this._ctx.arc(town.position.x, town.position.y, 300, 0, 2 * Math.PI);
    //     this._ctx.stroke();
    // }

    // _renderFood(food) {
    //     let width = 10;
    //     let height = 10; 
    //     this._ctx.fillStyle = 'green';
    //     let posX = food.position.x - width / 2;
    //     let posY = food.position.y - height / 2;
    //     this._ctx.fillRect(posX, posY, width, height)
    //     this._ctx.beginPath();
    // }

}

export { WorldView }