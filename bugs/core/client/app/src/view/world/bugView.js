import { EntityView } from './entityView';
import * as PIXI from 'pixi.js';
import { PickedFoodView } from './pickedFood';

class BugView extends EntityView {

    constructor(entity, entityContainer) {
        super(entity, entityContainer);

        this._render();

        this._unbindPosChangedListener = this._entity.on('positionChanged', this._onBugPositionChange.bind(this));
        this._unbindStateChangeListener = this._entity.on('stateChanged', this._renderBugCurrentState.bind(this));
        this._unbindFoodLiftListener = this._entity.on('foodLift', this._onFoodLift.bind(this));
        this._unbindFoodDropListener = this._entity.on('foodDrop', this._removePickedFoodView.bind(this));
    }

    remove() {
        super.remove();
        this._entityContainer.removeChild(this._standSprite);
        this._entityContainer.removeChild(this._walkSprite);
        this._unbindPosChangedListener();
        this._unbindStateChangeListener();
        this._unbindFoodLiftListener();
        this._unbindFoodDropListener();
        this._removePickedFoodView();
    }

    _render() {
        this._activeSprite = null;

        this._standSprite = new PIXI.Sprite(BugView.textureManager.getTexture('bug4.png'));
        this._standSprite.anchor.set(0.5);
        this._entityContainer.addChild(this._standSprite);

        this._walkSprite = new PIXI.AnimatedSprite(BugView.textureManager.getAnimatedTextures('bug'));
        this._walkSprite.anchor.set(0.5);
        this._walkSprite.animationSpeed = 0.2;
        this._entityContainer.addChild(this._walkSprite);

        this._renderBugCurrentState();
        this._renderBugPosition();
        if (this._entity.hasPickedFood()) { 
            this._renderPickedFoodView();
            this._renderPickedFoodPosition();
        }
    }

    _onFoodLift() {
        this._renderPickedFoodView();
        this._renderPickedFoodPosition();
    }

    _onBugPositionChange() {
        this._renderBugPosition();
        if (this._entity.hasPickedFood()) { 
            this._renderPickedFoodPosition();
        }
    }

    _removePickedFoodView() {
        if (this._pickedFoodView) {
            this._pickedFoodView.remove();
            this._pickedFoodView = null;
        }
    }

    _renderPickedFoodView() {
        if (!this._pickedFoodView) {
            this._pickedFoodView = new PickedFoodView(this._entity.pickedFood, this._entityContainer);
        }
    }

    _renderPickedFoodPosition() {
        this._entity.pickedFood.setPosition(this._entity.position.x, this._entity.position.y - 15);
    }

    _renderBugPosition() {
        this._activeSprite.x = this._entity.position.x;
        this._activeSprite.y = this._entity.position.y;
        this._activeSprite.angle = this._entity.angle;
    }

    _renderBugCurrentState() {
        let state = this._entity.state;

        this._toggleStandingState(state == 'standing');
        this._toggleWalkingState(state == 'walking');
    }

    _toggleWalkingState(isEnabling) {
        if (isEnabling) {
            this._activeSprite = this._walkSprite;
            this._walkSprite.renderable = true;
            this._walkSprite.play();
        } else {
            this._walkSprite.renderable = false;
            this._walkSprite.stop();
        }
    }

    _toggleStandingState(isEnabling) {
        if (isEnabling) {
            this._activeSprite = this._standSprite;
            this._standSprite.renderable = true;
        } else {
            this._standSprite.renderable = false;
        }
    }
   
}

export {
    BugView
}