import { EntityView } from './entityView';
import * as PIXI from 'pixi.js';
import { PickedFoodView } from './pickedFood';

class AntView extends EntityView {

    constructor(entity, entityContainer) {
        super(entity, entityContainer);

        this._render();

        this._unbindPosChangedListener = this._entity.on('positionChanged', this._onAntPositionChange.bind(this));
        this._unbindPosChangedListener = this._entity.on('angleChanged', this._onAngleChange.bind(this));
        this._unbindStateChangeListener = this._entity.on('stateChanged', this._renderAntCurrentState.bind(this));
        this._unbindFoodLiftListener = this._entity.on('foodPickedUp', this._onFoodPickedUp.bind(this));
        this._unbindFoodDropListener = this._entity.on('foodDroped', this._removePickedFoodView.bind(this));
    }

    remove() {
        super.remove();
        this._entityContainer.removeChild(this._standSprite);
        this._entityContainer.removeChild(this._walkSprite);
        this._entityContainer.removeChild(this._deadSprite);
        this._unbindPosChangedListener();
        this._unbindStateChangeListener();
        this._unbindFoodLiftListener();
        this._unbindFoodDropListener();
        this._removePickedFoodView();
    }

    _render() {
        this._standSprite = new PIXI.Sprite(AntView.textureManager.getTexture('ant_worker_4.png'));
        this._standSprite.anchor.set(0.5);
        this._entityContainer.addChild(this._standSprite);

        this._walkSprite = new PIXI.AnimatedSprite(AntView.textureManager.getAnimatedTextures('ant_worker'));
        this._walkSprite.anchor.set(0.5);
        this._walkSprite.animationSpeed = 0.2;
        this._entityContainer.addChild(this._walkSprite);

        this._deadSprite = new PIXI.Sprite(AntView.textureManager.getTexture('ant_worker_dead.png'));
        this._deadSprite.anchor.set(0.5);
        this._entityContainer.addChild(this._deadSprite);

        this._renderAntCurrentState();
        this._renderAntPosition();
        if (this._entity.hasPickedFood()) { 
            this._renderPickedFoodView();
            this._renderPickedFoodPosition();
        }
    }

    _onFoodPickedUp() {
        this._renderPickedFoodView();
        this._renderPickedFoodPosition();
    }

    _onAntPositionChange() {
        this._renderAntPosition();
        if (this._entity.hasPickedFood()) { 
            this._renderPickedFoodPosition();
        }
    }

    _onAngleChange() {
        this._renderAngle();
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
            this._pickedFoodView = new PickedFoodView(food, this._entityContainer);
        }
    }

    _renderPickedFoodPosition() {
        this._pickedFoodView.entity.setPosition(this._entity.position.x, this._entity.position.y - 15);
    }

    _renderAntPosition() {
        this._standSprite.x = this._entity.position.x;
        this._standSprite.y = this._entity.position.y;

        this._walkSprite.x = this._entity.position.x;
        this._walkSprite.y = this._entity.position.y;

        this._deadSprite.x = this._entity.position.x;
        this._deadSprite.y = this._entity.position.y;
    }

    _renderAngle() {
        this._standSprite.angle = this._entity.angle;
        this._walkSprite.angle = this._entity.angle;
        this._deadSprite.angle = this._entity.angle;
    }

    _renderAntCurrentState() {
        let state = this._entity.state;

        this._toggleStandingState(state == 'standing');
        this._toggleWalkingState(state == 'walking');
        this._toggleDeadState(state == 'dead');
    }

    _toggleWalkingState(isEnabling) {
        if (isEnabling) {
            this._walkSprite.renderable = true;
            this._walkSprite.play();
        } else {
            this._walkSprite.renderable = false;
            this._walkSprite.stop();
        }
    }

    _toggleStandingState(isEnabling) {
        if (isEnabling) {
            this._standSprite.renderable = true;
        } else {
            this._standSprite.renderable = false;
        }
    }

    _toggleDeadState(isEnabling) {
        this._deadSprite.renderable = isEnabling;
    }
   
}

export {
    AntView
}