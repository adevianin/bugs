class WorldView {
    constructor(canvas, domainFacade) {
        this._domainFacade = domainFacade;
        this._canvas = canvas;
        this._ctx = this._canvas.getContext('2d');

        setInterval(this._renderWorld.bind(this), 100);
    }

    _renderWorld() {
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

        this._renderTowns();
        this._renderFoods();
        this._renderBugs();
    }

    _renderBugs() {
        let bugs = this._domainFacade.world.bugs;
        bugs.forEach(bug => {
            let posX = bug.position.x - bug.size.width / 2;
            let posY = bug.position.y - bug.size.height / 2;
            this._ctx.fillStyle = bug.getColor()
            this._ctx.fillRect(posX, posY, bug.size.width, bug.size.height)
            this._ctx.beginPath();
            this._ctx.arc(posX, posY, 150, 0, 2 * Math.PI);
            this._ctx.stroke();
        })
    }

    _renderFoods() {
        let foods = this._domainFacade.world.foods
        this._ctx.fillStyle = 'green';
        foods.forEach(food => {
            let posX = food.position.x - food.size.width / 2;
            let posY = food.position.y - food.size.height / 2;
            this._ctx.fillRect(posX, posY, food.size.width, food.size.height)
        })
    }

    _renderTowns() {
        let towns = this._domainFacade.world.towns;
        towns.forEach(town => {
            this._ctx.fillStyle = 'yellow';
            let posX = town.position.x - town.size.width / 2;
            let posY = town.position.y - town.size.height / 2;
            this._ctx.fillRect(posX, posY, town.size.width, town.size.height)
            this._ctx.beginPath();
            this._ctx.arc(town.position.x, town.position.y, 300, 0, 2 * Math.PI);
            this._ctx.stroke();
        })
    }

}

export { WorldView }