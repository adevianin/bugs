import { EntityView } from './entityView';
import * as PIXI from 'pixi.js';
import { PickedFoodView } from './pickedFood';

class BugView extends EntityView {

    constructor(entity, entityContainer) {
        super(entity, entityContainer);

        this._activeSprite = null;

        this._standSprite = new PIXI.Sprite(BugView.textureManager.getTexture('bug4.png'));
        this._standSprite.anchor.set(0.5);
        this._entityContainer.addChild(this._standSprite);

        this._walkSprite = new PIXI.AnimatedSprite(BugView.textureManager.getAnimatedTextures('bug'));
        this._walkSprite.anchor.set(0.5);
        this._walkSprite.animationSpeed = 0.2;
        this._entityContainer.addChild(this._walkSprite);

        this._activateCurrentState();
        
        this._render();

        this._entity.on('positionChanged', this._render.bind(this));
        this._entity.on('stateChanged', this._onBugStateChanged.bind(this));
        this._entity.on('onFoodLift', this._onFoodLift.bind(this));
        this._entity.on('onFoodDrop', this._onFoodDrop.bind(this));
    }

    _render() {
        this._activeSprite.x = this._entity.position.x;
        this._activeSprite.y = this._entity.position.y;
        this._activeSprite.angle = this._entity.angle;
        if (this._entity.hasPickedFood()) {
            this._entity.pickedFood.setPosition(this._entity.position.x, this._entity.position.y - 15);
        }
    }

    _onFoodLift() {
        this._pickedFoodView = new PickedFoodView(this._entity.pickedFood, this._entityContainer);
        this._render();
    }

    _onFoodDrop() {
        this._pickedFoodView.remove();
        this._render();
    }

    _onBugStateChanged() {
        this._activateCurrentState();
    }

    _activateCurrentState() {
        let state = this._entity.state;

        this._toggleStandingState(state == 'standing');
        this._toggleWalkingState(state == 'walking');
        this._render();
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