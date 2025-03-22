import * as PIXI from 'pixi.js';
import { LiveEntityView } from './liveEntityView';
import { VIEW_SETTINGS } from '@view/viewSettings';
import { ACTION_TYPES } from '@domain/entity/action/actionTypes';

class AntView extends LiveEntityView {

    constructor(entity, entityContainer) {
        super(entity, entityContainer);

        this._render();

        this._unbindItemPickedUpListener = this._entity.on('itemPickedUp', this._renderPickedItemView.bind(this));
        this._unbindItemDropListener = this._entity.on('itemDroped', this._removePickedItemView.bind(this));
        this._unbindLocatedInNestChangedListener = this._entity.on('locatedInNestChanged', this._renderVisibility.bind(this));
        this._unbindIsInNuptialFlightChangedListener = this._entity.on('isInNuptialFlightChanged', this._renderVisibility.bind(this));
        this._stopListenFlewNuptialAnimationRequest = this._entity.on(`actionAnimationReqest:${ACTION_TYPES.ANT_FLEW_NUPTIAL_FLIGHT}`, this._onFlewNuptialAnimationRequest.bind(this));
    }

    remove() {
        super.remove();
        this._unbindItemPickedUpListener();
        this._unbindItemDropListener();
        this._unbindLocatedInNestChangedListener();
        this._unbindIsInNuptialFlightChangedListener();
        this._removePickedItemView();
        this._stopListenFlewNuptialAnimationRequest();
    }

    _render() {
        super._render();

        if (this._entity.hasPickedItem()) { 
            this._renderPickedItemView();
        }

        if (VIEW_SETTINGS.showAntSightDistanceView) {
            this._renderDebugSightDistance();
        }
    }

    _buildStandSprite() {
        return new PIXI.Sprite(this.$textureManager.getTexture(`ant_${this.entity.antType}_4.png`));
    }

    _buildWalkSprite() {
        let sprite = new PIXI.AnimatedSprite(this.$textureManager.getAnimatedTextures(`ant_${this.entity.antType}`));
        sprite.animationSpeed = 0.2;
        return sprite;
    }

    _buildDeadSprite() {
        return new PIXI.Sprite(this.$textureManager.getTexture(`ant_${this.entity.antType}_dead.png`));
    }

    _removePickedItemView() {
        if (this._pickedItemSprite) {
            this._pickedItemContainer.removeChild(this._pickedItemSprite);
            this._pickedItemSprite = null;
        }
    }

    _renderPickedItemView() {
        if (!this._pickedItemSprite) {
            let item = this.$domain.findEntityById(this._entity.pickedItemId);
            let textureName = `item_${ item.itemType }_${ item.itemVariety }v.png`;
            this._pickedItemSprite = new PIXI.Sprite(this.$textureManager.getTexture(textureName));
            this._pickedItemContainer.addChild(this._pickedItemSprite);
        }
    }

    _renderDebugSightDistance() {
        let sightDistance = this._entity.stats.sightDistance;
        let graphics = new PIXI.Graphics();
        graphics.circle(0, 0, sightDistance).stroke({width: 1, color: 0xFF0000});
        if (VIEW_SETTINGS.showAntEntitySearchingRect) {
            graphics.rect(-sightDistance, -sightDistance, 2*sightDistance, 2*sightDistance).stroke({width: 1, color: 0x00FF00});
        }
        this._entityContainer.addChild(graphics);
    }

    _onFlewNuptialAnimationRequest(animationParams, timeMultiplier, onDone) {
        if (this._entityContainer.renderable) {
            let wholeAnimationTime = 5000 * timeMultiplier;
            let flyStartTime = performance.now();
            let startX = this._entity.position.x;
            let startY = this._entity.position.y;
    
            let randomAngle = Math.random() * Math.PI * 2;
            let directionX = Math.cos(randomAngle);
            let directionY = Math.sin(randomAngle);
            
            const flightSpeed = 100;
            const amplitude = 100;
            const frequency = 0.00025;
    
            let updateFly = (currentTime) => {
                let elapsedTime = currentTime - flyStartTime;
                let deltaTime = elapsedTime / 1000;
                let progress = elapsedTime / wholeAnimationTime;

                if (progress < 1) {
                    let displacementX = directionX * flightSpeed * deltaTime;
                    let displacementY = directionY * flightSpeed * deltaTime;
    
                    let oscillation = Math.sin(elapsedTime * frequency * Math.PI * 2) * amplitude;
                    let oscillationX = -directionY * oscillation;
                    let oscillationY = directionX * oscillation;
    
                    let newPositionX = startX + displacementX + oscillationX;
                    let newPositionY = startY + displacementY + oscillationY;

                    this._entity.lookAt(newPositionX, newPositionY);
                    this._entity.setPosition(newPositionX, newPositionY, true);

                    requestAnimationFrame(updateFly);
                } else {
                    onDone();
                }
            };
    
            requestAnimationFrame(updateFly);
        } else {
            onDone();
        }
    }
    

}

export {
    AntView
}