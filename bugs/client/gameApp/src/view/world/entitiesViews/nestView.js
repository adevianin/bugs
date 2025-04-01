import { EntityView } from './entityView';
import * as PIXI from 'pixi.js';
import { HpLineView } from './hpLine';
import { ACTION_TYPES } from '@domain/entity/action/actionTypes';
import { EntityHightlighterView } from './entityHighlighterView';
import { UI_CONSTS } from '@common/view/ui_consts';

class NestView extends EntityView { 

    static VISUAL_STATES = class {
        static DEAD = 'dead';
        static BUILT = 'built';
        static BUILDING = 'building';
    };

    static ANIMATION_TYPES = class extends EntityView.ANIMATION_TYPES {
        static BUILD_STATUS_CHANGE = 'build_status_change';
        static FORTIFICATION_CHANGE = 'fortification_change';
        static HP_CHANGE = 'hp_change';
    };

    constructor(entity, entityContainer, nestHudLayer) {
        super(entity, entityContainer);
        this._nestHudLayer = nestHudLayer;

        this._render();
        this._stopListenBuildStatusChange = this._entity.on(`actionAnimationReqest:${ACTION_TYPES.NEST_BUILD_STATUS_CHANGED}`, this._onBuildStatusChangeAnimationRequest.bind(this));
        this._stopListenFortificationChange = this._entity.on(`actionAnimationReqest:${ACTION_TYPES.NEST_FORTIFICATION_CHANGED}`, this._onFortificationChangeAnimationRequest.bind(this));
        this._stopListenHpChange = this._entity.on(`actionAnimationReqest:${ACTION_TYPES.ENTITY_HP_CHANGE}`, this._onHpChangeAnimationRequest.bind(this));
        this._stopListenNameChange = this._entity.on('nameChanged', this._onNameChanged.bind(this));
    }

    get _nestWidth() {
        return this._builtNestSprite.width;
    }

    get _nestHeight() {
        return this._builtNestSprite.height;
    }

    _render() {
        this._bodyContainer = new PIXI.Container();
        this._hudContainer = new PIXI.Container();
        this._nameContainer = new PIXI.Container();
        this._highlighterContainer = new PIXI.Container();
        this._hudContainer.addChild(this._highlighterContainer);
        this._hudContainer.addChild(this._nameContainer);
        this._entityContainer.addChild(this._bodyContainer);
        this._entityContainer.addChild(this._hudContainer);

        this._nestHudLayer.attach(this._hudContainer);

        this._builtNestSprite = new PIXI.Sprite(this.$textureManager.getTexture('nest.png'));
        this._builtNestSprite.eventMode = 'static';
        this._builtNestSprite.cursor = 'pointer';
        this._bodyContainer.addChild(this._builtNestSprite);

        this._buildingNestSprite = new PIXI.Sprite(this.$textureManager.getTexture('nest_building.png'));
        this._bodyContainer.addChild(this._buildingNestSprite);

        this._destroyedNestSprite = new PIXI.Sprite(this.$textureManager.getTexture('nest_destroyed.png'));
        this._bodyContainer.addChild(this._destroyedNestSprite);

        let nestHalfWidth = this._nestWidth / 2;
        let nestHalfHeight = this._nestHeight / 2;

        this._bodyContainer.pivot.set(nestHalfWidth, nestHalfHeight);

        if (this.$domain.isEntityMy(this._entity)) {
            this._builtNestSprite.on('pointerdown', this._onClick.bind(this));
        }

        this._fortificationTopY = -nestHalfHeight-8;
        this._fortificationLine = new PIXI.Graphics();
        this._fortificationLine.position.set(-nestHalfWidth, this._fortificationTopY);
        this._hudContainer.addChild(this._fortificationLine);

        this._hpTopY = this._fortificationTopY - 5;
        this._hpLineView = new HpLineView({ x: -nestHalfWidth, y: this._hpTopY }, this._nestWidth, this._entity.maxHp, this._hudContainer);

        this._nameText = new PIXI.Text({
            text: this._entity.name,
            style: {
                fontFamily: UI_CONSTS.WORLD_VIEW_FONT_NAME,
                fontSize: UI_CONSTS.WORLD_VIEW_FONT_SIZE,
                fill: UI_CONSTS.WORLD_VIEW_FONT_COLOR,
            },
        });
        this._nameText.anchor.set(0.5, 0);
        this._nameTopY = this._hpTopY - 2 - this._nameText.height;
        this._nameContainer.addChild(this._nameText);
        this._nameContainer.position.set(0, this._nameTopY);

        this._highlighterBottomY = this._nameTopY - 2;
        this._highlighterContainer.position.set(0, this._highlighterBottomY);
        this._entityHighlighter = new EntityHightlighterView(this._highlighterContainer, this._entity);

        this._renderEntityState();
    }

    remove() {
        super.remove();
        this._hpLineView.remove();
        this._entityHighlighter.remove();
        this._stopListenBuildStatusChange();
        this._stopListenFortificationChange();
        this._stopListenHpChange();
        this._stopListenNameChange();
        this._nestHudLayer.detach(this._hudContainer);
    }

    _renderEntityState() {
        super._renderEntityState();
        let visualState = this._determineNestVisualState();
        this._renderVisualState(visualState);
        this._renderFortificationValue(this._entity.fortification);
        this._hpLineView.showValue(this._entity.hp);
        this._renderName(this._entity.name);
    }

    _renderVisualState(state) {
        this._builtNestSprite.renderable = state == NestView.VISUAL_STATES.BUILT;
        this._buildingNestSprite.renderable = state == NestView.VISUAL_STATES.BUILDING;
        this._destroyedNestSprite.renderable = state == NestView.VISUAL_STATES.DEAD;
    }

    _renderFortificationValue(fortificationValue) {
        let fortLineMaxWidth = this._nestWidth;
        let fortInPercent = (fortificationValue * 100) / this._entity.maxFortification;
        let lineWidth = (fortLineMaxWidth / 100) * fortInPercent;

        let color = 0x800080;
        this._fortificationLine.clear();
        this._fortificationLine.rect(0, 0, lineWidth, 5);
        this._fortificationLine.fill({
            color
        });
    }

    _renderName(name) {
        this._nameContainer.addChild
    }

    _determineNestVisualState() {
        if (this._entity.isDied) {
            return NestView.VISUAL_STATES.DEAD;
        } else if (this._entity.isBuilt) {
            return NestView.VISUAL_STATES.BUILT;
        } else {
            return NestView.VISUAL_STATES.BUILDING;
        }
    }

    async _playAnimation(animation) {
        let isPlayed = await super._playAnimation(animation);
        if (isPlayed) {
            return true;
        }

        switch (animation.type) {
            case NestView.ANIMATION_TYPES.BUILD_STATUS_CHANGE: 
                this._playBuildStatusChange(animation.params);
                return true;
            case NestView.ANIMATION_TYPES.FORTIFICATION_CHANGE: 
                this._playFortificationChange(animation.params);
                return true;
            case NestView.ANIMATION_TYPES.HP_CHANGE: 
                this._playHpChange(animation.params);
                return true;
            default:
                return false;
        }
    }

    _playDiedAnimation() {
        this._renderVisualState(NestView.VISUAL_STATES.DEAD);
        setTimeout(() => {
            this.remove();
        }, 5000);
    }

    _playBuildStatusChange({ isBuilt }) {
        let state = isBuilt ? NestView.VISUAL_STATES.BUILT : NestView.VISUAL_STATES.BUILDING;
        this._renderVisualState(state);
    }

    _playFortificationChange({ fortification }) {
        this._renderFortificationValue(fortification);
    }

    _playHpChange({ hp }) {
        this._hpLineView.showValue(hp);
    }

    _onClick() {
        this.$eventBus.emit('nestManageRequest', this._entity);
    }

    _onBuildStatusChangeAnimationRequest(params) {
        this._addAnimation(NestView.ANIMATION_TYPES.BUILD_STATUS_CHANGE, params);
    }

    _onFortificationChangeAnimationRequest(params) {
        this._addAnimation(NestView.ANIMATION_TYPES.FORTIFICATION_CHANGE, params);
    }

    _onHpChangeAnimationRequest(params) {
        this._addAnimation(NestView.ANIMATION_TYPES.HP_CHANGE, params);
    }

    _onNameChanged() {
        this._nameText.text = this._entity.name;
    }

}

export {
    NestView
}