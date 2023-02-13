import { EntityTypes } from '../domain/entity/entityTypes';

class WorldView {
    constructor(canvas, domainFacade) {
        this._domainFacade = domainFacade;
        this._canvas = canvas;
        this._ctx = this._canvas.getContext('2d');

        setInterval(this._renderWorld.bind(this), 100);
    }

    _renderWorld() {
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

        let entities = this._domainFacade.getEntities();
        entities.forEach(entity => {
            if (entity.isHidden()) {
                return;
            }
            
            switch (entity.type) {
                case EntityTypes.BUG:
                    this._renderBug(entity);
                    break;
                case EntityTypes.TOWN:
                    this._renderTown(entity);
                    break;
                case EntityTypes.FOOD:
                    this._renderFood(entity);
                    break;
            }
        });
    }

    _renderBug(bug) {
        let width = 10;
        let height = 10;
        let posX = bug.position.x - width / 2;
        let posY = bug.position.y - height / 2;
        this._ctx.fillStyle = 'red';
        this._ctx.strokeStyle = 'black';
        this._ctx.fillRect(posX, posY, width, height);
        this._ctx.beginPath();
        this._ctx.arc(posX, posY, 200, 0, 2 * Math.PI);
        this._ctx.stroke();

        if (bug.hasPickedFood()) {
            this._ctx.fillStyle = 'green';
            this._ctx.fillRect(posX, posY - 10, width, height);
        }
    }

    _renderTown(town) {
        let width = 40;
        let height = 40; 
        this._ctx.fillStyle = 'yellow';
        this._ctx.strokeStyle = 'black';
        let posX = town.position.x - width / 2;
        let posY = town.position.y - height / 2;
        this._ctx.fillRect(posX, posY, width, height)
        this._ctx.beginPath();
        this._ctx.arc(town.position.x, town.position.y, 300, 0, 2 * Math.PI);
        this._ctx.stroke();
    }

    _renderFood(food) {
        let width = 10;
        let height = 10; 
        this._ctx.fillStyle = 'green';
        let posX = food.position.x - width / 2;
        let posY = food.position.y - height / 2;
        this._ctx.fillRect(posX, posY, width, height)
        this._ctx.beginPath();
    }

}

export { WorldView }