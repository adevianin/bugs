import * as PIXI from 'pixi.js';
import { PickedFoodView } from './pickedFood';
import { LiveEntityView } from './liveEntityView';

class AntView extends LiveEntityView {

    constructor(entity, entityContainer) {
        super(entity, entityContainer);

        this._render();

        this._unbindFoodLiftListener = this._entity.on('foodPickedUp', this._renderPickedFoodView.bind(this));
        this._unbindFoodDropListener = this._entity.on('foodDroped', this._removePickedFoodView.bind(this));
        this._unbindIsHiddenChangedListener = this._entity.on('locatedInNestChanged', this._renderIsInNest.bind(this));
    }

    remove() {
        super.remove();
        this._unbindFoodLiftListener();
        this._unbindFoodDropListener();
        this._unbindIsHiddenChangedListener();
        this._removePickedFoodView();
    }

    _render() {
        super._render();

        if (this._entity.hasPickedFood()) { 
            this._renderPickedFoodView();
        }

        this._renderIsInNest();
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

    _removePickedFoodView() {
        if (this._pickedFoodView) {
            this._pickedFoodView.remove();
            this._pickedFoodView = null;
        }
    }

    _renderPickedFoodView() {
        if (!this._pickedFoodView) {
            let food = AntView.domainFacade.findEntityById(this._entity.pickedFoodId);
            this._pickedFoodView = new PickedFoodView(food, this._pickedItemContainer);
        }
    }

    _renderIsInNest() {
        this._entityContainer.renderable = !this._entity.isInNest;
    }

}

export {
    AntView
}