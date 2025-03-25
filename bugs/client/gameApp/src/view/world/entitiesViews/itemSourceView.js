import { EntityView } from './entityView';
import * as PIXI from 'pixi.js';
import { HpLineView } from './hpLine';
import { ACTION_TYPES } from '@domain/entity/action/actionTypes';

class ItemSourceView extends EntityView { 

    static ANIMATION_TYPES = class extends EntityView.ANIMATION_TYPES {
        static HP_CHANGE = 'hp_change';
    };

    constructor(entity, entitiesContainer) {
        super(entity, entitiesContainer);

        this._unbindFertileChangeListener = this._entity.on('fertileChanged', this._renderFertile.bind(this));
        this._stopListenHpChange = this._entity.on(`actionAnimationReqest:${ACTION_TYPES.ENTITY_HP_CHANGE}`, this._onHpChangeAnimationRequest.bind(this));

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
        this._unbindFertileChangeListener();
        this._stopListenHpChange();
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

        this._renderEntityState();
    }

    _renderEntityState() {
        super._renderEntityState();
        this._hpLineView.showValue(this._entity.hp);
        this._renderFertile();
    }

    _renderFertile() {
        this._standSprite.renderable = this._entity.isFertile;
        this._deadSprite.renderable = !this._entity.isFertile;
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
            default:
                return false;
        }
    }

    _playHpChange({ hp }) {
        this._hpLineView.showValue(hp);
    }

    _onHpChangeAnimationRequest(params) {
        this._addAnimation(ItemSourceView.ANIMATION_TYPES.HP_CHANGE, params);
    }

}

export {
    ItemSourceView
}