class WorldView {
    constructor(canvas, domainFacade) {
        this._domainFacade = domainFacade;
        this._canvas = canvas;
        this._ctx = this._canvas.getContext('2d');

        setInterval(this._renderWorld.bind(this), 100);
    }

    _renderWorld() {
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

        this._renderBugs();
        this._renderBlocks();
    }

    _renderBugs() {
        let bugs = this._domainFacade.world.bugs;
        this._ctx.fillStyle = 'black';
        bugs.forEach(bug => {
            let posX = bug.position.x - bug.size.width / 2;
            let posY = bug.position.y - bug.size.height / 2;
            this._ctx.fillRect(posX, posY, bug.size.width, bug.size.height)
        })
    }

    _renderBlocks() {
        let blocks = this._domainFacade.world.blocks;
        this._ctx.fillStyle = 'gray';
        blocks.forEach(block => {
            this._ctx.fillRect(block.position.x, block.position.y, block.size.width, block.size.height)
        }) 
    }
}

export { WorldView }