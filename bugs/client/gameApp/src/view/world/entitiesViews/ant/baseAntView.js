import * as PIXI from 'pixi.js';
import { LiveEntityView } from '../liveEntityView';
import { VIEW_SETTINGS } from '@view/viewSettings';
import { ACTION_TYPES } from '@domain/entity/action/actionTypes';
import { EntityHightlighterView } from '../entityHighlighterView';
import { UI_CONSTS } from '@common/view/ui_consts';
import { calculateRotationAngle } from '@utils/calculateRotationAngle';

class BaseAntView extends LiveEntityView {

    static ANIMATION_TYPES = class extends LiveEntityView.ANIMATION_TYPES {
        static GOT_IN_NEST = 'got_in_nest';
        static GOT_OUT_OF_NEST = 'got_out_of_nest';
        static FLEW_NUPTIAL = 'flew_nuptial';
    }

    constructor(entity, entityContainer, entitiesLayer, hudLayer) {
        super(entity, entityContainer, entitiesLayer, hudLayer);

        let antId = this._entity.id;
        this._stopListenAntGotInNestAR = this.$eventBus.on(`entityActionAnimationRequest:${antId}:${ACTION_TYPES.ENTITY_GOT_IN_NEST}`, this._onAntGotInNestAnimationRequest.bind(this));
        this._stopListenAntGotOutOfNestAR = this.$eventBus.on(`entityActionAnimationRequest:${antId}:${ACTION_TYPES.ENTITY_GOT_OUT_OF_NEST}`, this._onAntGotOutOfNestAnimationRequest.bind(this));
        this._stopListenFlewNuptialAR = this.$eventBus.on(`entityActionAnimationRequest:${antId}:${ACTION_TYPES.ANT_FLEW_NUPTIAL_FLIGHT}`, this._onFlewNuptialAnimationRequest.bind(this));
    }

    remove() {
        super.remove();
        this._entityHighlighter.remove();
        this._stopListenAntGotInNestAR();
        this._stopListenAntGotOutOfNestAR();
        this._stopListenFlewNuptialAR();
    }

    _render() {
        this._prepareTextures();

        super._render();

        this._bodyContainer.eventMode = 'dynamic';
        this._bodyContainer.cursor = 'pointer';
        this._bodyContainer.on('pointerdown', this._onBodyClick.bind(this));

        this._highlighterY = this._hpTopY - 2;
        this._highlighterContainer = new PIXI.Container();
        this._highlighterContainer.position.set(0, this._highlighterY);
        this._hudContainer.addChild(this._highlighterContainer);
        this._entityHighlighter = new EntityHightlighterView(this._highlighterContainer, this._entity);

        if (VIEW_SETTINGS.showAntSightDistanceView) {
            this._renderDebugSightDistance();
        }
    }

    _prepareTextures() {
        this._standTexture = this.$textureManager.getTexture(`ant_${this.entity.antType}_1.png`);
        let walkTextures = this.$textureManager.getAnimatedTextures(`ant_${this.entity.antType}`);
        this._walkTextures = [walkTextures[0], walkTextures[1], walkTextures[0], walkTextures[2]];
        this._deadTexture = this.$textureManager.getTexture(`ant_${this.entity.antType}_dead.png`);
    }

    _calcWalkAnimationSpeed() {
        return this._entity.stats.distancePerStep * 0.005;
    }

    _buildStandSprite() {
        return new PIXI.Sprite(this._standTexture);
    }

    _buildWalkSprite() {
        let sprite = new PIXI.AnimatedSprite(this._walkTextures);
        sprite.animationSpeed = this._calcWalkAnimationSpeed();
        return sprite;
    }

    _buildDeadSprite() {
        return new PIXI.Sprite(this._deadTexture);
    }

    _buildFlySprite() {
        let ts = this.$textureManager.getAnimatedTextures(`ant_${this.entity.antType}_fly`);
        if (!ts) {
            return null;
        }
        let sprite = new PIXI.AnimatedSprite(ts);
        sprite.animationSpeed = 0.5;
        return sprite;
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

        let nameBottomY;
        if (this._entity.isMine) {
            let nameText = new PIXI.Text({
                text: this._entity.name,
                style: {
                    fontFamily: UI_CONSTS.WORLD_VIEW_FONT_NAME,
                    fontSize: UI_CONSTS.WORLD_VIEW_FONT_SIZE,
                    fill: UI_CONSTS.WORLD_VIEW_FONT_COLOR,
                },
            });
            this._statsContainer.addChild(nameText);
            nameText.anchor.set(0.5, 0);
            nameBottomY = nameText.height + 2;
        } else {
            nameBottomY = 0;
        }
        
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
        
        let statsTopY = nameBottomY;
        let valuesTopY = statsTopY + maxHpIcon.height;
        maxHpIcon.position.set(maxHpColCenterX, statsTopY);
        maxHpText.position.set(maxHpColCenterX, valuesTopY);
        strengthIcon.position.set(strengthColCenterX, statsTopY);
        strengthText.position.set(strengthColCenterX, valuesTopY);
        defenseIcon.position.set(defenseColCenterX, statsTopY);
        defenseText.position.set(defenseColCenterX, valuesTopY);

        this._setTimeout(() => {
            this._removeStats();
        }, UI_CONSTS.WORLD_VIEW_ANT_STATS_SHOW_TIEM);
    }

    _removeStats() {
        if (this._statsContainer) {
            this._hudContainer.removeChild(this._statsContainer);
            this._statsContainer.destroy();
            this._statsContainer = null;
        }
    }

    _playAnimation(animation) {
        let resp = super._playAnimation(animation);
        if (resp.isPlayed) {
            return resp;
        }

        switch (animation.type) {
            case BaseAntView.ANIMATION_TYPES.GOT_IN_NEST: 
                this._playGotInNestAnimation(animation.params);
                return this._makePlayAnimationResponse(true);
            case BaseAntView.ANIMATION_TYPES.GOT_OUT_OF_NEST: 
                this._playGotOutOfNestAnimation(animation.params);
                return this._makePlayAnimationResponse(true);
            case BaseAntView.ANIMATION_TYPES.FLEW_NUPTIAL: 
                let flewAnimPromise = this._playFlewNuptialAnimation(animation.params);
                return this._makePlayAnimationResponse(true, flewAnimPromise);
            default:
                return this._makePlayAnimationResponse(false);
        }
    }

    _playGotInNestAnimation({ isAntVisibleAfter }) {
        this._toggleEntityVisibility(isAntVisibleAfter);
    }

    _playGotOutOfNestAnimation({ isAntVisibleAfter }) {
        this._toggleEntityVisibility(isAntVisibleAfter);
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
        this._renderVisualState(BaseAntView.VISUAL_STATES.FLYING);
        return this._runAnimation(BaseAntView.ANIMATION_TYPES.FLEW_NUPTIAL, (currentTime) => {
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
                this._renderVisualState(BaseAntView.VISUAL_STATES.STANDING);
                this._toggleEntityVisibility(false);
                return true;
            }
        });

    }

    _onAntGotInNestAnimationRequest(params) {
        this._addAnimation(BaseAntView.ANIMATION_TYPES.GOT_IN_NEST, params);
    }

    _onAntGotOutOfNestAnimationRequest(params) {
        this._addAnimation(BaseAntView.ANIMATION_TYPES.GOT_OUT_OF_NEST, params);
    }

    _onFlewNuptialAnimationRequest(params) {
        this._addAnimation(BaseAntView.ANIMATION_TYPES.FLEW_NUPTIAL, params, true);
    }

    _onBodyClick() {
        this._renderStats();
    }

}

export {
    BaseAntView
}