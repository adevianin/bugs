import * as PIXI from 'pixi.js';
import { BaseGraphicView } from '@view/base/baseGraphicView';
import { distance } from '@utils/distance';

class MapController extends BaseGraphicView {

    static MAP_MARGIN = 5;
    static SHOW_POSITION_DURATION = 500;

    constructor(container, pixiApp) {
        super();
        this._container = container;
        this._isDragingMode = false;
        this._anchorPoint = {x: null, y: null};
        this._startPoint = {x: null, y: null};
        let worldSize = this.$domain.getWorldSize();
        this._mapSize = {
            width: worldSize[0],
            height: worldSize[1]
        };
        this._pixiApp = pixiApp;

        this._renderHandler();

        this._handler.on('pointerdown', this._onPointerDown.bind(this));
        this._handler.on('pointerup', this._onPointerUp.bind(this));
        this._handler.on('pointerupoutside', this._onPointerUp.bind(this));
        this._handler.on('pointermove', this._onPointerMove.bind(this));
        this.$eventBus.on('showPointRequest', this._onShowPointRequest.bind(this));
    }

    _renderHandler() {
        this._handler = new PIXI.Container();
        this._container.addChildAt(this._handler, 0);
        this._handler.eventMode = 'static';
        this._handler.hitArea = new PIXI.Rectangle(0, 0, this._mapSize.width, this._mapSize.height);
    }

    _onPointerDown(e) {
        this._isDragingMode = true;
        this._anchorPoint.x = e.client.x;
        this._anchorPoint.y = e.client.y;
        this._startPoint.x = e.client.x;
        this._startPoint.y = e.client.y;
        window.getSelection().removeAllRanges();
    }

    _onPointerUp(e) {
        this._isDragingMode = false;
        let distToStartPoint = distance(e.client.x, e.client.y, this._startPoint.x, this._startPoint.y);
        if (distToStartPoint < 5) {
            this.$eventBus.emit('bgclick', this._handler.toLocal(e.client));
        }
    }

    _onPointerMove(e) {
        if (this._isDragingMode) {
            
            let dx = this._anchorPoint.x - e.client.x;
            let dy = this._anchorPoint.y - e.client.y;

            this._anchorPoint.x = e.client.x;
            this._anchorPoint.y = e.client.y;

            this._moveCamera(dx, dy);
        }
    }

    _showPosition(x, y) {
        let viewPointLocal = this._container.toLocal(new PIXI.Point(this._pixiApp.canvas.offsetWidth / 2, this._pixiApp.canvas.offsetHeight / 2));
        let dx = x - viewPointLocal.x;
        let dy = y - viewPointLocal.y;
        let startTime = performance.now();
        let startCameraPosition = this._getCameraPosition();
        let destCameraX = startCameraPosition.x + dx;
        let destCameraY = startCameraPosition.y + dy;

        if (this._moveFn) {
            this._pixiApp.ticker.remove(this._moveFn);
        }
        
        this._moveFn = () => {
            let currentTime = performance.now();
            let elapsed = currentTime - startTime;
            let progress = elapsed / MapController.SHOW_POSITION_DURATION;

            if (progress <= 1) {
                let currentDx = progress * dx;
                let currentDy = progress * dy;
                this._setCameraPosition(startCameraPosition.x + currentDx, startCameraPosition.y + currentDy);
            } else {
                this._setCameraPosition(destCameraX, destCameraY);
                this._pixiApp.ticker.remove(this._moveFn);
                this._moveFn = null;
            }
        };

        this._pixiApp.ticker.add(this._moveFn);
    }

    _moveCamera(dx, dy) {
        let cameraPosition = this._getCameraPosition();
        this._setCameraPosition(cameraPosition.x + dx, cameraPosition.y + dy);
    }

    _setCameraPosition(x, y) {
        let containerPosX = -x;
        let containerPosY = -y;
        if (containerPosX > MapController.MAP_MARGIN) {
            containerPosX = MapController.MAP_MARGIN;
        }

        if (containerPosY > MapController.MAP_MARGIN) {
            containerPosY = MapController.MAP_MARGIN;
        }

        let minXPos = this._pixiApp.canvas.offsetWidth - this._mapSize.width - MapController.MAP_MARGIN
        if (containerPosX < minXPos) {
            containerPosX = minXPos;
        }

        let minPosY = this._pixiApp.canvas.offsetHeight - this._mapSize.height  - MapController.MAP_MARGIN;
        if (containerPosY < minPosY) {
            containerPosY = minPosY;
        }

        this._container.x = containerPosX;
        this._container.y = containerPosY;
    }

    _getCameraPosition() {
        return {
            x: -this._container.x,
            y: -this._container.y,
        }
    }

    _onShowPointRequest(position) {
        this._showPosition(position.x, position.y);
    }

}

export {
    MapController
}