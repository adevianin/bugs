import { EntityView } from './entityView';
import * as PIXI from 'pixi.js';
import { HpLineView } from './hpLine';
import { ACTION_TYPES } from '@domain/entity/action/actionTypes';
import { SEASON_TYPES } from '@domain/enum/season_types';
import { UI_CONSTS } from '@common/view/ui_consts';

class ItemSourceView extends EntityView { 
    
    static ACCUMULATED_LINE_HEIGHT = 6;
    static ACCUMULATED_LINE_COLOR = 0xdfbc06;
    static HP_BOTTOM_MARGIN = 2;

    static VISUAL_STATES = class {
        static DAMAGED = 'damaged';
        static NOT_DAMAGED = 'not_damaged';
    };

    static ANIMATION_TYPES = class extends EntityView.ANIMATION_TYPES {
        static HP_CHANGE = 'hp_change';
        static IS_DAMAGED_CHANGE = 'is_damaged_change';
        static ACCUMULATED_CHANGE = 'accumulated_change';
    };

    constructor(entity, entitiesContainer, entitiesLayer) {
        super(entity, entitiesContainer, entitiesLayer);

        let id = this._entity.id;
        this._stopListenHpChange = this.$eventBus.on(`entityActionAnimationRequest:${id}:${ACTION_TYPES.ENTITY_HP_CHANGE}`, this._onHpChangeAnimationRequest.bind(this));
        this._stopListenAccumulatedChange = this.$eventBus.on(`entityActionAnimationRequest:${id}:${ACTION_TYPES.ITEM_SOURCE_ACCUMULATED_CHANGED}`, this._onAccumulatedChangeAnimationRequest.bind(this));
        this._stopListenSeasonChange = this.$domain.events.on('currentSeasonChanged', this._onSeasonChanged.bind(this));

        this._render();
    }

    get _entityWidth() {
        return this._spriteSpring.width;
    }

    get _entityHeight() {
        return this._spriteSpring.height;
    }

    remove() {
        super.remove();
        this._hpLineView.remove();
        this._stopListenHpChange();
        this._stopListenAccumulatedChange();
        this._stopListenSeasonChange();
    }

    _render() {
        this._bodyContainer = new PIXI.Container();
        this._uiContainer = new PIXI.Container();
        this._entityContainer.addChild(this._bodyContainer);
        this._entityContainer.addChild(this._uiContainer);
        
        this._spriteSpring = new PIXI.Sprite(this.$textureManager.getTexture(`item_source_${this._entity.itemType}_${SEASON_TYPES.SPRING}.png`));
        this._bodyContainer.addChild(this._spriteSpring);
        this._spriteSummer = new PIXI.Sprite(this.$textureManager.getTexture(`item_source_${this._entity.itemType}_${SEASON_TYPES.SUMMER}.png`));
        this._bodyContainer.addChild(this._spriteSummer);
        this._spriteAutumn = new PIXI.Sprite(this.$textureManager.getTexture(`item_source_${this._entity.itemType}_${SEASON_TYPES.AUTUMN}.png`));
        this._bodyContainer.addChild(this._spriteAutumn);
        this._spriteWinter = new PIXI.Sprite(this.$textureManager.getTexture(`item_source_${this._entity.itemType}_${SEASON_TYPES.WINTER}.png`));
        this._bodyContainer.addChild(this._spriteWinter);

        this._entityContainer.pivot.x = this._entityWidth / 2;
        this._entityContainer.pivot.y = this._entityHeight;

        this._accumulatedLineTop = -ItemSourceView.ACCUMULATED_LINE_HEIGHT;
        this._accumulatedLine = new PIXI.Graphics({position: { x: 0, y: this._accumulatedLineTop }});
        this._uiContainer.addChild(this._accumulatedLine);
        
        this._hpLineTop = this._accumulatedLineTop - HpLineView.HP_LINE_HEIGHT - ItemSourceView.HP_BOTTOM_MARGIN;
        this._hpLineView = new HpLineView({ x: 0, y: this._hpLineTop }, this._entityWidth, this._entity.maxHp, this._uiContainer);

        this._renderFertility();
        this._renderEntityState();
    }

    _renderEntityState() {
        super._renderEntityState();
        this._hpLineView.showValue(this._entity.hp);
        this._renderAccumulatedValue(this._entity.accumulated);
        this._renderCurrentSeasonSprite();
    }

    _renderCurrentSeasonSprite() {
        let currenSeason = this.$domain.currentSeason;
        this._spriteSpring.renderable = currenSeason == SEASON_TYPES.SPRING;
        this._spriteSummer.renderable = currenSeason == SEASON_TYPES.SUMMER;
        this._spriteAutumn.renderable = currenSeason == SEASON_TYPES.AUTUMN;
        this._spriteWinter.renderable = currenSeason == SEASON_TYPES.WINTER;
    }

    _renderAccumulatedValue(accumulated) {
        let maxLineWidth = this._entityWidth;
        let maxAccumulatedValue = this._entity.maxAccumulated;
        let lineWidth = (accumulated / maxAccumulatedValue) * maxLineWidth;
        let lineHeight = ItemSourceView.ACCUMULATED_LINE_HEIGHT;
        let color = ItemSourceView.ACCUMULATED_LINE_COLOR;
        this._accumulatedLine
            .clear()
            .rect(0, 0, lineWidth, lineHeight)
            .fill({ color, alpha: 0.5 })
            .rect(0, 0, maxLineWidth, lineHeight)
            .stroke({
                color,
                alignment: 1,
                width: 2,
                alpha: 0.5
            })
    }

    _renderFertility() {
        let fertilityText = new PIXI.Text({
            text: this._entity.fertility,
            style: {
                fontFamily: UI_CONSTS.WORLD_VIEW_FONT_NAME,
                fontSize: UI_CONSTS.WORLD_VIEW_FONT_SIZE,
                fill: UI_CONSTS.WORLD_VIEW_FONT_COLOR,
            },
        });

        let fertilityBgWidth = fertilityText.width + 2;
        let fertilityBgHeight = fertilityText.height;
        let fertilityBg = new PIXI.Graphics();
        fertilityBg
            .rect(0,0, fertilityBgWidth, fertilityBgHeight)
            .fill({ color: ItemSourceView.ACCUMULATED_LINE_COLOR });

        fertilityText.anchor.set(0.5);
        fertilityText.position.x = fertilityBgWidth / 2;
        fertilityText.position.y = fertilityBgHeight / 2;

        let fertilityContainer = new PIXI.Container();
        fertilityContainer.position.y = -fertilityBgHeight;
        fertilityContainer.position.x = -fertilityBgWidth - 1;

        fertilityContainer.addChild(fertilityBg, fertilityText);
        this._uiContainer.addChild(fertilityContainer);
    }

    _playAnimation(animation) {
        let resp = super._playAnimation(animation);
        if (resp.isPlayed) {
            return resp;
        }

        switch (animation.type) {
            case ItemSourceView.ANIMATION_TYPES.HP_CHANGE: 
                this._playHpChange(animation.params);
                return this._makePlayAnimationResponse(true);
            case ItemSourceView.ANIMATION_TYPES.ACCUMULATED_CHANGE: 
                this._playAccumulatedChange(animation.params);
                return this._makePlayAnimationResponse(true);
            default:
                return this._makePlayAnimationResponse(false);
        }
    }

    _playHpChange({ hp }) {
        this._hpLineView.showValue(hp);
    }

    _playAccumulatedChange({ accumulated }) {
        this._renderAccumulatedValue(accumulated);
    }

    _onHpChangeAnimationRequest(params) {
        this._addAnimation(ItemSourceView.ANIMATION_TYPES.HP_CHANGE, params);
    }

    _onAccumulatedChangeAnimationRequest(params) {
        this._addAnimation(ItemSourceView.ANIMATION_TYPES.ACCUMULATED_CHANGE, params);
    }

    _onSeasonChanged() {
        this._renderCurrentSeasonSprite();
    }

}

export {
    ItemSourceView
}