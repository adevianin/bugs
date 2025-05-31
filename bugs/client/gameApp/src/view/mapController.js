import * as PIXI from 'pixi.js';
import { BaseGraphicView } from '@view/base/baseGraphicView';
import { distance } from '@utils/distance';
import { throttle } from '@common/utils/throttle';
import { debounce } from '@common/utils/debounce';

class MapController extends BaseGraphicView {

    static MAP_MARGIN = 5;
    static SHOW_POSITION_DURATION = 500;

    constructor(container, worldBackgroundView, zoomContainer, pixiApp) {
        super();
        this._container = container;
        this._worldBackgroundView = worldBackgroundView;
        this._zoomContainer = zoomContainer;
        this._isDragingMode = false;
        this._anchorPoint = {x: null, y: null};
        this._startPoint = {x: null, y: null};
        let worldSize = this.$domain.getWorldSize();
        this._mapSize = {
            width: worldSize[0],
            height: worldSize[1]
        };
        this._pixiApp = pixiApp;
        this._throttledOnViewPointChange = throttle(this._onViewPointChange.bind(this), 200);
        this._scale = 1;

        this._renderHandler();
        this._worldBackgroundView.updateScale(this._scale);

        this.$eventBus.on('zoomIn', this._onZoomIn.bind(this));
        this.$eventBus.on('zoomOut', this._onZoomOut.bind(this));

        this._handler.on('pointerdown', this._onPointerDown.bind(this));
        this._handler.on('pointerup', this._onPointerUp.bind(this));
        this._handler.on('pointerupoutside', this._onPointerUp.bind(this));
        this._handler.on('pointermove', this._onPointerMove.bind(this));
        this.$eventBus.on('showPointRequest', this._onShowPointRequest.bind(this));

        window.addEventListener('resize', debounce(this._onWindowResize.bind(this), 200));
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
            console.log(this._getLocalPointFromClickEvent(e));
            this.$eventBus.emit('bgclick', this._getLocalPointFromClickEvent(e));
        }
    }

    _onPointerMove(e) {
        if (this._isDragingMode) {
            
            let dx = this._anchorPoint.x - e.client.x;
            let dy = this._anchorPoint.y - e.client.y;

            dx = dx / this._scale;
            dy = dy / this._scale;

            this._anchorPoint.x = e.client.x;
            this._anchorPoint.y = e.client.y;

            this._moveCamera(dx, dy);
        }
    }

    _showPosition(x, y, isFast=false) {
        let viewPointLocal = this._getLocalViewPoint();
        let dx = x - viewPointLocal.x;
        let dy = y - viewPointLocal.y;
        if (dx == 0 && dy == 0) {
            return;
        }
        let startTime = performance.now();
        let startCameraPosition = this._getCameraPosition();
        let destCameraX = startCameraPosition.x + dx;
        let destCameraY = startCameraPosition.y + dy;

        if (this._moveFn) {
            this._pixiApp.ticker.remove(this._moveFn);
        }

        if (isFast) {
            this._setCameraPosition(destCameraX, destCameraY);
        } else {
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

        let minXPos = (this._pixiApp.canvas.offsetWidth / this._scale) - this._mapSize.width - MapController.MAP_MARGIN
        if (containerPosX < minXPos) {
            containerPosX = minXPos;
        }

        let minPosY = (this._pixiApp.canvas.offsetHeight / this._scale) - this._mapSize.height  - MapController.MAP_MARGIN;
        if (containerPosY < minPosY) {
            containerPosY = minPosY;
        }

        this._container.x = containerPosX;
        this._container.y = containerPosY;
        this._worldBackgroundView.updateTilePosition(containerPosX, containerPosY);

        this._throttledOnViewPointChange();
    }

    _onViewPointChange() {
        let viewPoint = this._getLocalViewPoint();
        let viewRect = this._buildViewRectForViewPoint(viewPoint);
        this.$eventBus.emit('viewPointChanged', viewPoint, viewRect);
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

    _getLocalViewPoint() {
        return this._container.toLocal(new PIXI.Point(this._pixiApp.canvas.offsetWidth / 2, this._pixiApp.canvas.offsetHeight / 2));
    }

    _buildViewRectForViewPoint(viewPoint) {
        let viewRectWidth = (window.screen.width / this._scale) * 1.5;
        let viewRectHeight = (window.screen.height / this._scale) * 1.5;
        // let viewRectWidth = 300 / this._scale;
        // let viewRectHeight = 300 / this._scale;
        return {
            x: viewPoint.x - viewRectWidth / 2,
            y: viewPoint.y - viewRectHeight / 2,
            width: viewRectWidth,
            height: viewRectHeight
        }
    }

    _getLocalPointFromClickEvent(e) {
        let localPoint = this._handler.toLocal({x: e.client.x, y: e.client.y});
        let x = Math.round(localPoint.x);
        let y = Math.round(localPoint.y);
        if (x < 0) {
            x = 0;
        }
        if (x >= this._mapSize.width) {
            x = this._mapSize.width - 1;
        }

        if (y < 0) {
            y = 0;
        }
        if (y >= this._mapSize.height) {
            y = this._mapSize.height - 1;
        }

        return {x, y};
    }

    _onZoomIn() {
        this._scale = 1;
        let viewPoint = this._getLocalViewPoint();
        this._updateScale();
        this._showPosition(viewPoint.x, viewPoint.y, true);
    }

    _onZoomOut() {
        this._scale = 0.5;
        let viewPoint = this._getLocalViewPoint();
        this._updateScale();
        this._showPosition(viewPoint.x, viewPoint.y, true);
    }

    _updateScale() {
        this._zoomContainer.scale.x = this._scale;
        this._zoomContainer.scale.y = this._scale;
        this._worldBackgroundView.updateScale(this._scale);
    }

    _onWindowResize() {
        let camPos = this._getCameraPosition();
        this._worldBackgroundView.resize();
        this._setCameraPosition(camPos.x, camPos.y);
    }
}

export {
    MapController
}