import * as PIXI from 'pixi.js';

class Camera {

    static MAP_MARGIN = 20;

    constructor(container, canvasEl, mapWidth, mapHeight) {
        this._container = container;
        this._isDraging = false;
        this._anchorPoint = {x: null, y: null};
        this._mapSize = {
            width: mapWidth,
            height: mapHeight
        };
        this._canvasEl = canvasEl;

        this._renderHandler();

        this._handler.on('pointerdown', this._onPointerDown.bind(this));
        this._handler.on('pointerup', this._onPointerUp.bind(this));
        this._handler.on('pointermove', this._onPointerMove.bind(this));
    }

    _renderHandler() {
        this._handler = new PIXI.Container();
        this._container.addChildAt(this._handler, 0);
        this._handler.eventMode = 'static';
        this._handler.hitArea = new PIXI.Rectangle(0, 0, this._mapSize.width, this._mapSize.height);
    }

    _onPointerDown(e) {
        this._isDraging = true;
        this._anchorPoint.x = e.client.x;
        this._anchorPoint.y = e.client.y;
    }

    _onPointerUp(e) {
        this._isDraging = false;
    }

    _onPointerMove(e) {
        if (this._isDraging) {
            let dx = e.client.x - this._anchorPoint.x;
            let dy = e.client.y - this._anchorPoint.y;

            this._anchorPoint.x = e.client.x;
            this._anchorPoint.y = e.client.y;

            let containerPosX = this._container.x + dx;
            let containerPosY = this._container.y + dy;

            if (containerPosX > Camera.MAP_MARGIN) {
                containerPosX = Camera.MAP_MARGIN;
            }

            if (containerPosY > Camera.MAP_MARGIN) {
                containerPosY = Camera.MAP_MARGIN;
            }

            let minXPos = this._canvasEl.offsetWidth - this._mapSize.width - Camera.MAP_MARGIN
            if (containerPosX < minXPos) {
                containerPosX = minXPos;
            }

            let minPosY = this._canvasEl.offsetHeight - this._mapSize.height  - Camera.MAP_MARGIN;
            if (containerPosY < minPosY) {
                containerPosY = minPosY;
            }

            this._container.x = containerPosX;
            this._container.y = containerPosY;
        }
    }
}

export {
    Camera
}