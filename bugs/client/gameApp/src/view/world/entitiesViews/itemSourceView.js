import { EntityView } from './entityView';
import * as PIXI from 'pixi.js';
import { HpLineView } from './hpLine';
import { ACTION_TYPES } from '@domain/entity/action/actionTypes';

class ItemSourceView extends EntityView { 
    
    static ACCUMULATED_LINE_HEIGHT = 5;
    static ACCUMULATED_LINE_COLOR = 0x0000ff;

    static VISUAL_STATES = class {
        static DAMAGED = 'damaged';
        static NOT_DAMAGED = 'not_damaged';
    };

    static ANIMATION_TYPES = class extends EntityView.ANIMATION_TYPES {
        static HP_CHANGE = 'hp_change';
        static IS_DAMAGED_CHANGE = 'is_damaged_change';
        static ACCUMULATED_CHANGE = 'accumulated_change';
    };

    constructor(entity, entitiesContainer) {
        super(entity, entitiesContainer);

        this._stopListenHpChange = this._entity.on(`actionAnimationReqest:${ACTION_TYPES.ENTITY_HP_CHANGE}`, this._onHpChangeAnimationRequest.bind(this));
        this._stopListenIsDamagedChange = this._entity.on(`actionAnimationReqest:${ACTION_TYPES.ITEM_SOURCE_IS_DAMAGED_CHANGED}`, this._onIsDamagedChangeAnimationRequest.bind(this));
        this._stopListenAccumulatedChange = this._entity.on(`actionAnimationReqest:${ACTION_TYPES.ITEM_SOURCE_ACCUMULATED_CHANGED}`, this._onAccumulatedChangeAnimationRequest.bind(this));

        this._render();
    }

    get _entityWidth() {
        return this._standSprite.width;
    }

    get _entityHeight() {
        return this._standSprite.height;
    }

    remove() {
        super.remove();
        this._hpLineView.remove();
        this._stopListenHpChange();
        this._stopListenIsDamagedChange();
        this._stopListenAccumulatedChange();
    }

    _render() {
        this._bodyContainer = new PIXI.Container();
        this._uiContainer = new PIXI.Container();
        this._entityContainer.addChild(this._bodyContainer);
        this._entityContainer.addChild(this._uiContainer);
        
        this._standSprite = new PIXI.Sprite(this.$textureManager.getTexture(`item_source_${this._entity.itemType}.png`));
        this._bodyContainer.addChild(this._standSprite);
        this._deadSprite = new PIXI.Sprite(this.$textureManager.getTexture(`item_source_${this._entity.itemType}_not_fertile.png`));
        this._bodyContainer.addChild(this._deadSprite);

        this._entityContainer.pivot.x = this._entityWidth / 2;
        this._entityContainer.pivot.y = this._entityHeight;

        this._hpLineView = new HpLineView({ x: 0, y: -10 }, this._entityWidth, this._entity.maxHp, this._uiContainer);

        this._accumulatedLine = new PIXI.Graphics({position: { x: 0, y: -5 }});
        this._uiContainer.addChild(this._accumulatedLine);

        this._renderFertility();
        this._renderEntityState();
    }

    _renderEntityState() {
        super._renderEntityState();
        this._hpLineView.showValue(this._entity.hp);
        let state = this._determineVisualState(this._entity.isDamaged);
        this._renderVisualState(state);
        this._renderAccumulatedValue(this._entity.accumulated);
    }

    _renderVisualState(state) {
        this._standSprite.renderable = state == ItemSourceView.VISUAL_STATES.NOT_DAMAGED;
        this._deadSprite.renderable = state == ItemSourceView.VISUAL_STATES.DAMAGED;
    }

    _determineVisualState(isDamaged) {
        return isDamaged ? ItemSourceView.VISUAL_STATES.DAMAGED : ItemSourceView.VISUAL_STATES.NOT_DAMAGED;
    }

    _renderAccumulatedValue(accumulated) {
        let maxLineWidth = this._entityWidth;
        let maxAccumulatedValue = this._entity.maxAccumulated;
        let lineWidth = (accumulated / maxAccumulatedValue) * maxLineWidth;
        this._accumulatedLine.clear();
        this._accumulatedLine.rect(0, 0, lineWidth, 5);
        this._accumulatedLine.fill({
            color: ItemSourceView.ACCUMULATED_LINE_COLOR
        });
    }

    _renderFertility() {
        const fertilityBgSize = 15;

        let fertilityBg = new PIXI.Graphics();
        fertilityBg.rect(0,0, fertilityBgSize, fertilityBgSize).fill({ color: 0xff0000 });

        let fertilityText = new PIXI.Text({
            text: this._entity.fertility,
            style: {
                fontFamily: 'Arial',
                fontSize: 14,
                fill: 0x000000,
            },
        });
        fertilityText.anchor.set(0.5);
        fertilityText.position.x = fertilityBgSize / 2;
        fertilityText.position.y = fertilityBgSize / 2;

        let fertilityContainer = new PIXI.Container();
        fertilityContainer.position.y = -fertilityBgSize;
        fertilityContainer.position.x = -fertilityBgSize - 1;

        fertilityContainer.addChild(fertilityBg, fertilityText);
        this._uiContainer.addChild(fertilityContainer);
    }

    async _playAnimation(animation) {
        let isPlayed = await super._playAnimation(animation);
        if (isPlayed) {
            return true;
        }

        switch (animation.type) {
            case ItemSourceView.ANIMATION_TYPES.HP_CHANGE: 
                this._playHpChange(animation.params);
                return true;
            case ItemSourceView.ANIMATION_TYPES.IS_DAMAGED_CHANGE: 
                this._playIsDamagedChange(animation.params);
                return true;
            case ItemSourceView.ANIMATION_TYPES.ACCUMULATED_CHANGE: 
                this._playAccumulatedChange(animation.params);
                return true;
            default:
                return false;
        }
    }

    _playHpChange({ hp }) {
        this._hpLineView.showValue(hp);
    }

    _playIsDamagedChange({ isDamaged }) {
        let state = this._determineVisualState(isDamaged);
        this._renderVisualState(state);
    }

    _playAccumulatedChange({ accumulated }) {
        this._renderAccumulatedValue(accumulated);
    }

    _onHpChangeAnimationRequest(params) {
        this._addAnimation(ItemSourceView.ANIMATION_TYPES.HP_CHANGE, params);
    }

    _onIsDamagedChangeAnimationRequest(params) {
        this._addAnimation(ItemSourceView.ANIMATION_TYPES.IS_DAMAGED_CHANGE, params);
    }

    _onAccumulatedChangeAnimationRequest(params) {
        this._addAnimation(ItemSourceView.ANIMATION_TYPES.ACCUMULATED_CHANGE, params);
    }

}

export {
    ItemSourceView
}