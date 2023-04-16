import { EntityView } from './entityView';
import * as PIXI from 'pixi.js';

class BugView extends EntityView {

    constructor(entity, spritesheetManager, entityContainer) {
        super(entity, spritesheetManager, entityContainer);

        this._sprite = null;

        this._standSprite = new PIXI.Sprite(spritesheetManager.getTexture('bug4.png'));
        this._standSprite.pivot.x = 16;
        this._standSprite.pivot.y = 16;

        this._walkSprite = new PIXI.AnimatedSprite(spritesheetManager.getAnimatedTextures('bug'));
        this._walkSprite.pivot.x = 16;
        this._walkSprite.pivot.y = 16;
        this._walkSprite.animationSpeed = 0.2;

        this._activateCurrentState();
        
        this._render();

        this._entity.on('positionChanged', this._render.bind(this));
        this._entity.on('stateChanged', this._onBugStateChanged.bind(this));
        this._entity.on('onFoodLift', this._onFoodLift.bind(this));
        this._entity.on('onFoodDrop', this._onFoodDrop.bind(this));
    }

    _render() {
        this._sprite.x = this._entity.position.x;
        this._sprite.y = this._entity.position.y;
        this._sprite.angle = this._entity.angle;
        if (this._pickedFoodSprite) {
            this._pickedFoodSprite.x = this._entity.position.x;
            this._pickedFoodSprite.y = this._entity.position.y - 20;
        }
    }

    _onFoodLift() {
        this._pickedFoodSprite = new PIXI.Sprite(this._spritesheetManager.getTexture('food.png'));
        this._entityContainer.addChild(this._pickedFoodSprite);
        this._render();
    }

    _onFoodDrop() {
        this._entityContainer.removeChild(this._pickedFoodSprite);
        this._pickedFoodSprite = null;
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
            this._sprite = this._walkSprite;
            this._entityContainer.addChild(this._walkSprite);
            this._walkSprite.play();
        } else {
            this._entityContainer.removeChild(this._walkSprite);
            this._walkSprite.stop();
        }
    }

    _toggleStandingState(isEnabling) {
        if (isEnabling) {
            this._sprite = this._standSprite;
            this._entityContainer.addChild(this._standSprite);
        } else {
            this._entityContainer.removeChild(this._standSprite);
        }
    }

   
}

export {
    BugView
}