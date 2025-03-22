import { EntityView } from './entityView';
import * as PIXI from 'pixi.js';
import { ACTION_TYPES } from '@domain/entity/action/actionTypes';
import { entityWalker } from '@utils/entityWalker';

class ItemView extends EntityView {

    constructor(entity, entitiesContainer) {
        super(entity, entitiesContainer);

        this._unbindIsPickedChangeListener = this._entity.on('isPickedChanged', this._renderIsPicked.bind(this));
        this._unbindPositionChangeListener = this._entity.on('positionChanged', this._renderPosition.bind(this));
        this._unbindAngleChangeListener = this._entity.on('angleChanged', this._renderAngle.bind(this));
        this._stopListenBeingBringedAnimationRequest = this._entity.on(`actionAnimationReqest:${ACTION_TYPES.ITEM_BEING_BRINGED}`, this._onBeingBringedAnimationRequest.bind(this));

        this._render();
    }

    _render() {
        this._sprite = new PIXI.Sprite(this.$textureManager.getTexture(`item_${ this._entity.itemType }_${ this._entity.itemVariety }v.png`));
        this._entityContainer.addChild(this._sprite);

        let halfWidth = this._sprite.width / 2;
        let halfHeight = this._sprite.height / 2;

        this._entityContainer.pivot.x = halfWidth;
        this._entityContainer.pivot.y = halfHeight;

        this._renderPosition();
        this._renderIsPicked();
        this._renderAngle();
    }

    _renderPosition() {
        this._entityContainer.x = this.entity.position.x;
        this._entityContainer.y = this.entity.position.y;
    }

    _renderIsPicked() {
        this._sprite.renderable = !this._entity.isPicked;
    }

    _renderAngle() {
        this._entityContainer.angle = this._entity.angle;
    }

    remove() {
        this._unbindIsPickedChangeListener();
        this._unbindPositionChangeListener();
        this._stopListenBeingBringedAnimationRequest();
        super.remove();
    }

    async _onBeingBringedAnimationRequest(animationParams, timeMultiplier, onDone) {
        if (this._entityContainer.renderable) {
            await entityWalker(this._entity, animationParams.destinationPosition, animationParams.userSpeed, timeMultiplier);
            onDone();
        } else {
            this._entity.setPosition(animationParams.destinationPosition.x, animationParams.destinationPosition.y);
            onDone();
        }
    }
    
}

export {
    ItemView
}