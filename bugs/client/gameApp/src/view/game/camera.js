import * as PIXI from 'pixi.js';
import { BaseGraphicView } from '@view/base/baseGraphicView';

class Camera extends BaseGraphicView {

    static MAP_MARGIN = 20;

    constructor(container) {
        super();
        this._container = container;
        this._isDraging = false;
        this._anchorPoint = {x: null, y: null};
        let worldSize = this.$domainFacade.getWorldSize();
        this._mapSize = {
            width: worldSize[0],
            height: worldSize[1]
        };

        this._renderHandler();

        this._handler.on('pointerdown', this._onPointerDown.bind(this));
        this._handler.on('pointerup', this._onPointerUp.bind(this));
        this._handler.on('pointermove', this._onPointerMove.bind(this));

        window.a = this;
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
        window.getSelection().removeAllRanges();
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

            this._moveContainer(dx, dy);
        }
    }

    showPos(x, y) {
        let viewPointLocal = this._container.toLocal(new PIXI.Point(this.$pixiApp.canvas.offsetWidth / 2, this.$pixiApp.canvas.offsetHeight / 2));
        let dx = viewPointLocal.x - x;
        let dy = viewPointLocal.y - y;
        
        let duration = 500;
        let interval = 50;
        let steps = duration / interval;
        let stepX = dx / steps;
        let stepY = dy / steps;
        
        let currentStep = 0;
        
        let animationInterval = setInterval(() => {
            if (currentStep < steps) {
                this._moveContainer(stepX, stepY);
                currentStep++;
            } else {
                clearInterval(animationInterval);
            }
        }, interval);
    }

    _moveContainer(dx, dy) {
        let containerPosX = this._container.x + dx;
        let containerPosY = this._container.y + dy;

        if (containerPosX > Camera.MAP_MARGIN) {
            containerPosX = Camera.MAP_MARGIN;
        }

        if (containerPosY > Camera.MAP_MARGIN) {
            containerPosY = Camera.MAP_MARGIN;
        }

        let minXPos = this.$pixiApp.canvas.offsetWidth - this._mapSize.width - Camera.MAP_MARGIN
        if (containerPosX < minXPos) {
            containerPosX = minXPos;
        }

        let minPosY = this.$pixiApp.canvas.offsetHeight - this._mapSize.height  - Camera.MAP_MARGIN;
        if (containerPosY < minPosY) {
            containerPosY = minPosY;
        }

        this._container.x = containerPosX;
        this._container.y = containerPosY;
    }

}

export {
    Camera
}