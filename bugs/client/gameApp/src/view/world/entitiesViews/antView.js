import * as PIXI from 'pixi.js';
import { LiveEntityView } from './liveEntityView';
import { VIEW_SETTINGS } from '@view/viewSettings';
import { ACTION_TYPES } from '@domain/entity/action/actionTypes';
import { calculateRotationAngle } from '@utils/calculateRotationAngle';
import { EntityHightlighterView } from './entityHighlighterView';
import { UI_CONSTS } from '@common/view/ui_consts';

class AntView extends LiveEntityView {

    static ANIMATION_TYPES = class extends LiveEntityView.ANIMATION_TYPES {
        static FLEW_NUPTIAL = 'flew_nuptial';
        static FLEW_NUPTIAL_BACK = 'flew_nuptial_back';
        static GOT_IN_NEST = 'got_in_nest';
        static GOT_OUT_OF_NEST = 'got_out_of_nest';
        static PICKED_UP_ITEM = 'picked_up_item';
        static DROPPED_ITEM = 'dropped_item';
    }

    constructor(entity, entityContainer, antHudLayer) {
        super(entity, entityContainer);
        this._antHudLayer = antHudLayer;

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
        this._entityHighlighter.remove();
        this._stopListenFlewNuptialAnimationRequest();
        this._stopListenFlewNuptialBackAnimationRequest();
        this._stopListenAntGotInNestAnimationRequest();
        this._stopListenAntGotOutOfNestAnimationRequest();
        this._stopListenAntPickedUpItemAnimationRequest();
        this._stopListenAntDroppedItemAnimationRequest();
        clearTimeout(this._hideStatsTimer);
        this._antHudLayer.detach(this._hudContainer);
    }

    _render() {
        super._render();

        this._bodyContainer.eventMode = 'dynamic';
        this._bodyContainer.cursor = 'pointer';
        this._bodyContainer.on('pointerdown', this._onBodyClick.bind(this));

        this._highlighterY = this._hpTopY - 2;
        this._highlighterContainer = new PIXI.Container();
        this._highlighterContainer.position.set(0, this._highlighterY);
        this._hudContainer.addChild(this._highlighterContainer);
        this._entityHighlighter = new EntityHightlighterView(this._highlighterContainer, this._entity);

        this._antHudLayer.attach(this._hudContainer);
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
        let sprite = new PIXI.Sprite(this.$textureManager.getTexture(`ant_${this.entity.antType}_4.png`));
        return sprite;
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
            this._pickedItemSprite.destroy();
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

    _renderStats() {
        if (this._statsContainer) {
            return;
        }
        this._statsContainer = new PIXI.Container();
        this._statsContainer.position.set(0, this._entityHeight / 2);
        this._hudContainer.addChild(this._statsContainer);

        let maxHpIcon = new PIXI.Sprite(this.$textureManager.getTexture('stats_max_hp_icon.png'));
        maxHpIcon.anchor.set(0.5, 0);
        let strengthIcon = new PIXI.Sprite(this.$textureManager.getTexture('stats_strength_icon.png'));
        strengthIcon.anchor.set(0.5, 0);
        let defenseIcon = new PIXI.Sprite(this.$textureManager.getTexture('stats_defense_icon.png'));
        defenseIcon.anchor.set(0.5, 0);
        let maxHpText = new PIXI.Text({
            text: this._entity.stats.maxHp,
            style: {
                fontFamily: UI_CONSTS.WORLD_VIEW_FONT_NAME,
                fontSize: UI_CONSTS.WORLD_VIEW_FONT_SIZE,
                fill: UI_CONSTS.WORLD_VIEW_FONT_COLOR,
            },
        });
        maxHpText.anchor.set(0.5, 0);
        let strengthText = new PIXI.Text({
            text: this._entity.stats.strength,
            style: {
                fontFamily: UI_CONSTS.WORLD_VIEW_FONT_NAME,
                fontSize: UI_CONSTS.WORLD_VIEW_FONT_SIZE,
                fill: UI_CONSTS.WORLD_VIEW_FONT_COLOR,
            },
        });
        strengthText.anchor.set(0.5, 0);
        let defenseText = new PIXI.Text({
            text: this._entity.stats.defence,
            style: {
                fontFamily: UI_CONSTS.WORLD_VIEW_FONT_NAME,
                fontSize: UI_CONSTS.WORLD_VIEW_FONT_SIZE,
                fill: UI_CONSTS.WORLD_VIEW_FONT_COLOR,
            },
        });
        defenseText.anchor.set(0.5, 0);
        let colPadding = 1;
        this._statsContainer.addChild(maxHpIcon, strengthIcon, defenseIcon, maxHpText, strengthText, defenseText);
        let maxHpColWidth = colPadding + Math.max(maxHpText.width, maxHpIcon.width) + colPadding;
        let strengthColWidth = colPadding + Math.max(maxHpText.width, strengthIcon.width) + colPadding;
        let defenseColWidth = colPadding + Math.max(defenseText.width, defenseIcon.width) + colPadding;
        let wholeStatsWidth = maxHpColWidth + strengthColWidth + defenseColWidth;
        let maxHpColLeftX = -wholeStatsWidth / 2;
        let maxHpColCenterX = maxHpColLeftX + maxHpColWidth / 2;
        let strengthColLeftX = maxHpColLeftX + maxHpColWidth;
        let strengthColCenterX = strengthColLeftX + strengthColWidth / 2;
        let defenseColLeftX = strengthColLeftX + strengthColWidth;
        let defenseColCenterX = defenseColLeftX + defenseColWidth / 2;

        maxHpIcon.position.set(maxHpColCenterX, 0);
        maxHpText.position.set(maxHpColCenterX, maxHpIcon.height);
        strengthIcon.position.set(strengthColCenterX, 0);
        strengthText.position.set(strengthColCenterX, maxHpIcon.height);
        defenseIcon.position.set(defenseColCenterX, 0);
        defenseText.position.set(defenseColCenterX, maxHpIcon.height);

        this._hideStatsTimer = setTimeout(() => {
            this._removeStats();
        }, UI_CONSTS.WORLD_VIEW_ANT_STATS_SHOW_TIEM);
    }

    _removeStats() {
        if (this._statsContainer) {
            this._hideStatsTimer = null;
            this._hudContainer.removeChild(this._statsContainer);
            this._statsContainer.destroy();
            this._statsContainer = null;
        }
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

    async _playFlewNuptialAnimation({startPosition, isBornInNuptialFlight}) {
        if (this._isFastAnimationMode || isBornInNuptialFlight) {
            this._toggleEntityVisibility(false);
            return;
        }

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

        let prevPosition = null;
        return this._runAnimation(AntView.ANIMATION_TYPES.FLEW_NUPTIAL, (currentTime) => {
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

                return false;
            } else {
                this._toggleEntityVisibility(false);
                return true;
            }
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

    _playDroppedItemAnimation({ droppingItemId }) {
        let item = this.$domain.findEntityById(droppingItemId);
        if (item) {
            item.playItemDrop({
                x: this._entityContainer.x,
                y: this._entityContainer.y,
            });
        }
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
        this._addAnimation(AntView.ANIMATION_TYPES.DROPPED_ITEM, params);
    }

    _onBodyClick() {
        this._renderStats();
    }

}

export {
    AntView
}