import * as PIXI from 'pixi.js';
import { LiveEntityView } from './liveEntityView';
import { VIEW_SETTINGS } from '@view/viewSettings';
import { ACTION_TYPES } from '@domain/entity/action/actionTypes';
import { calculateRotationAngle } from '@utils/calculateRotationAngle';

class AntView extends LiveEntityView {

    static ANIMATION_TYPES = class extends LiveEntityView.ANIMATION_TYPES {
        static FLEW_NUPTIAL = 'flew_nuptial';
        static FLEW_NUPTIAL_BACK = 'flew_nuptial_back';
        static GOT_IN_NEST = 'got_in_nest';
        static GOT_OUT_OF_NEST = 'got_out_of_nest';
        static PICKED_UP_ITEM = 'picked_up_item';
        static DROPPED_ITEM = 'dropped_item';
    }

    constructor(entity, entityContainer) {
        super(entity, entityContainer);

        this._render();

        if (VIEW_SETTINGS.showAntSightDistanceView) {
            this._renderDebugSightDistance();
        }

        this._stopListenFlewNuptialAnimationRequest = this._entity.on(`actionAnimationReqest:${ACTION_TYPES.ANT_FLEW_NUPTIAL_FLIGHT}`, this._onFlewNuptialAnimationRequest.bind(this));
        this._stopListenFlewNuptialBackAnimationRequest = this._entity.on(`actionAnimationReqest:${ACTION_TYPES.ANT_FLEW_NUPTIAL_FLIGHT_BACK}`, this._onFlewNuptialBackAnimationRequest.bind(this));
        this._stopListenAntGotInNestAnimationRequest = this._entity.on(`actionAnimationReqest:${ACTION_TYPES.ENTITY_GOT_IN_NEST}`, this._onAntGotInNestAnimationRequest.bind(this));
        this._stopListenAntGotOutOfNestAnimationRequest = this._entity.on(`actionAnimationReqest:${ACTION_TYPES.ENTITY_GOT_OUT_OF_NEST}`, this._onAntGotOutOfNestAnimationRequest.bind(this));
        this._stopListenAntPickedUpItemAnimationRequest = this._entity.on(`actionAnimationReqest:${ACTION_TYPES.ANT_PICKED_UP_ITEM}`, this._onAntPickedUpItemAnimationRequest.bind(this));
        this._stopListenAntDroppedItemAnimationRequest = this._entity.on(`actionAnimationReqest:${ACTION_TYPES.ANT_DROPPED_PICKED_ITEM}`, this._onAntDroppedItemAnimationRequest.bind(this));
    }

    remove() {
        super.remove();
        this._stopListenFlewNuptialAnimationRequest();
        this._stopListenFlewNuptialBackAnimationRequest();
        this._stopListenAntGotInNestAnimationRequest();
        this._stopListenAntGotOutOfNestAnimationRequest();
        this._stopListenAntPickedUpItemAnimationRequest();
        this._stopListenAntDroppedItemAnimationRequest();
    }

    _renderEntityState() {
        super._renderEntityState();

        if (this._entity.hasPickedItem()) { 
            let item = this.$domain.findEntityById(this._entity.pickedItemId);
            this._renderPickedItemView(item);
        } else {
            this._removePickedItemView();
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

    _renderPickedItemView(item) {
        this._removePickedItemView();
        let textureName = `item_${ item.itemType }_${ item.itemVariety }v.png`;
        this._pickedItemSprite = new PIXI.Sprite(this.$textureManager.getTexture(textureName));
        this._pickedItemContainer.addChild(this._pickedItemSprite);
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

    async _playAnimation(animation) {
        let isPlayed = await super._playAnimation(animation);
        if (isPlayed) {
            return true;
        }

        switch (animation.type) {
            case AntView.ANIMATION_TYPES.FLEW_NUPTIAL: 
                await this._playFlewNuptialAnimation(animation.params);
                return true;
            case AntView.ANIMATION_TYPES.FLEW_NUPTIAL_BACK: 
                this._playFlewNuptialBackAnimation(animation.params);
                return true;
            case AntView.ANIMATION_TYPES.GOT_IN_NEST: 
                this._playGotInNestAnimation(animation.params);
                return true;
            case AntView.ANIMATION_TYPES.GOT_OUT_OF_NEST: 
                this._playGotOutOfNestAnimation(animation.params);
                return true;
            case AntView.ANIMATION_TYPES.PICKED_UP_ITEM: 
                this._playPickedUpItemAnimation(animation.params);
                return true;
            case AntView.ANIMATION_TYPES.DROPPED_ITEM: 
                this._playDroppedItemAnimation(animation.params);
                return true;
            default:
                throw 'unknown type of animation';
        }
    }

    async _playFlewNuptialAnimation({startPosition}) {
        let wholeAnimationTime = 5000;
        let flyStartTime = performance.now();
        let startX = startPosition.x;
        let startY = startPosition.y;

        let randomAngle = Math.random() * Math.PI * 2;
        let directionX = Math.cos(randomAngle);
        let directionY = Math.sin(randomAngle);
        
        const flightSpeed = 100 / 1000;
        const amplitude = 100;
        const frequency = 0.00025;

        return new Promise((res, rej) => {
            let prevPosition = null;

            let animate = (currentTime) => {
                let animTime = currentTime - flyStartTime;
                let progress = animTime / wholeAnimationTime;

                if (progress < 1) {
                    let displacementX = directionX * flightSpeed * animTime;
                    let displacementY = directionY * flightSpeed * animTime;
    
                    let oscillation = Math.sin(animTime * frequency * Math.PI * 2) * amplitude;
                    let oscillationX = -directionY * oscillation;
                    let oscillationY = directionX * oscillation;
    
                    let newPositionX = startX + displacementX + oscillationX;
                    let newPositionY = startY + displacementY + oscillationY;
                    let position = { x: newPositionX, y: newPositionY };

                    if (prevPosition) {
                        this._renderEntityAngle(calculateRotationAngle(prevPosition, position));
                    }
                    this._renderEntityPosition(position);

                    prevPosition = position;
    
                    requestAnimationFrame(animate);
                } else {
                    res();
                    this._toggleEntityVisibility(false);
                }
            };
    
            requestAnimationFrame(animate);
        });
    }

    _playFlewNuptialBackAnimation({ landingPosition }) {
        this._renderEntityPosition(landingPosition);
        this._toggleEntityVisibility(true);
    }

    _playGotInNestAnimation({ isAntVisibleAfter }) {
        this._toggleEntityVisibility(isAntVisibleAfter);
    }

    _playGotOutOfNestAnimation({ isAntVisibleAfter }) {
        this._toggleEntityVisibility(isAntVisibleAfter);
    }

    _playPickedUpItemAnimation({ item }) {
        this._renderPickedItemView(item);
    }

    _playDroppedItemAnimation() {
        this._removePickedItemView();
    }

    _onFlewNuptialAnimationRequest(params) {
        this._addAnimation(AntView.ANIMATION_TYPES.FLEW_NUPTIAL, params);
    }

    _onFlewNuptialBackAnimationRequest(params) {
        this._addAnimation(AntView.ANIMATION_TYPES.FLEW_NUPTIAL_BACK, params);
    }

    _onAntGotInNestAnimationRequest(params) {
        this._addAnimation(AntView.ANIMATION_TYPES.GOT_IN_NEST, params);
    }

    _onAntGotOutOfNestAnimationRequest(params) {
        this._addAnimation(AntView.ANIMATION_TYPES.GOT_OUT_OF_NEST, params);
    }

    _onAntPickedUpItemAnimationRequest(params) {
        this._addAnimation(AntView.ANIMATION_TYPES.PICKED_UP_ITEM, {
            item: this.$domain.findEntityById(params.itemId)
        });
    }

    _onAntDroppedItemAnimationRequest(params) {
        this._addAnimation(AntView.ANIMATION_TYPES.DROPPED_ITEM);
    }

}

export {
    AntView
}