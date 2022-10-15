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
    }

    _renderBugs() {
        let bugs = this._domainFacade.world.bugs;
        bugs.forEach(bug => {
            console.log(bug.position.x, bug.position.y, bug.size.width, bug.size.height);
            this._ctx.fillRect(bug.position.x, bug.position.y, bug.size.width, bug.size.height)
        })
    }
}

export { WorldView }