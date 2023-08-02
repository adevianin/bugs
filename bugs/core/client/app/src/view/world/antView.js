import { EntityView } from './entityView';
import * as PIXI from 'pixi.js';
import { PickedFoodView } from './pickedFood';
import { HpLineView } from './hpLine';

class AntView extends EntityView {

    constructor(entity, entityContainer) {
        super(entity, entityContainer);

        this._render();

        this._unbindPosChangedListener = this._entity.on('positionChanged', this._onAntPositionChange.bind(this));
        this._unbindAngleChangedListener = this._entity.on('angleChanged', this._onAngleChange.bind(this));
        this._unbindStateChangeListener = this._entity.on('stateChanged', this._renderAntCurrentState.bind(this));
        this._unbindFoodLiftListener = this._entity.on('foodPickedUp', this._onFoodPickedUp.bind(this));
        this._unbindFoodDropListener = this._entity.on('foodDroped', this._removePickedFoodView.bind(this));
        this._unbindIsHiddenChangedListener = this._entity.on('locatedInNestChanged', this._renderIsInNest.bind(this));
    }

    remove() {
        super.remove();
        this._entityContainer.removeChild(this._antContainer);
        this._unbindPosChangedListener();
        this._unbindAngleChangedListener();
        this._unbindStateChangeListener();
        this._unbindFoodLiftListener();
        this._unbindFoodDropListener();
        this._unbindIsHiddenChangedListener();
        this._removePickedFoodView();
        this._removeHpLineView();
    }

    _render() {
        this._antContainer = new PIXI.Container();
        this._bodyContainer = new PIXI.Container();
        this._uiContainer = new PIXI.Container();
        this._pickedItemContainer = new PIXI.Container();
        this._antContainer.addChild(this._bodyContainer);
        this._antContainer.addChild(this._pickedItemContainer);
        this._antContainer.addChild(this._uiContainer);
        this._entityContainer.addChild(this._antContainer);

        this._standSprite = new PIXI.Sprite(this.$textureManager.getTexture(`ant_${this.entity.antType}_4.png`));
        // this._standSprite.anchor.set(0.5);
        this._bodyContainer.addChild(this._standSprite);

        this._walkSprite = new PIXI.AnimatedSprite(this.$textureManager.getAnimatedTextures(`ant_${this.entity.antType}`));
        // this._walkSprite.anchor.set(0.5);
        this._walkSprite.animationSpeed = 0.2;
        this._bodyContainer.addChild(this._walkSprite);

        this._deadSprite = new PIXI.Sprite(this.$textureManager.getTexture(`ant_${this.entity.antType}_dead.png`));
        // this._deadSprite.anchor.set(0.5);
        this._bodyContainer.addChild(this._deadSprite);

        let halfAntWidth = this._standSprite.width / 2;
        let halfAntHeight = this._standSprite.height / 2;

        this._bodyContainer.pivot.x = halfAntWidth;
        this._bodyContainer.pivot.y = halfAntHeight;
        this._uiContainer.pivot.x = halfAntWidth;
        this._uiContainer.pivot.y = halfAntHeight;
        this._pickedItemContainer.pivot.x = halfAntWidth;
        this._pickedItemContainer.pivot.y = halfAntHeight;

        this._renderAntCurrentState();
        this._renderAntPosition();
        if (this._entity.hasPickedFood()) { 
            this._renderPickedFoodView();
        }
        this._renderHpLineView();

        this._renderIsInNest();
    }

    _onFoodPickedUp() {
        this._renderPickedFoodView();
    }

    _onAntPositionChange() {
        this._renderAntPosition();
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
            this._pickedFoodView = new PickedFoodView(food, this._pickedItemContainer);
        }
    }

    _renderAntPosition() {
        this._antContainer.x = this._entity.position.x;
        this._antContainer.y = this._entity.position.y;
    }

    _renderAngle() {
        this._bodyContainer.angle = this._entity.angle
    }

    _renderAntCurrentState() {
        let state = this._entity.state;

        this._toggleStandingState(state == 'standing');
        this._toggleWalkingState(state == 'walking');
        this._toggleDeadState(state == 'dead');
    }

    _renderIsInNest() {
        this._antContainer.renderable = !this._entity.isInNest;
    }

    _renderHpLineView() {
        this._hpLineView = new HpLineView(this._entity, this._uiContainer);
    }

    _removeHpLineView() {
        this._hpLineView.remove();
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