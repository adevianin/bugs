import { EntityView } from "./entityView";
import * as PIXI from 'pixi.js';
import { HpLineView } from "./hpLine";

class LiveEntityView extends EntityView {

    constructor(entity, entitiesContainer) {
        super(entity, entitiesContainer);
        
        this._unbindPositionChangedListener = this._entity.on('positionChanged', this._renderPosition.bind(this));
        this._unbindAngleChangedListener = this._entity.on('angleChanged', this._renderAngle.bind(this));
        this._unbindStateChangeListener = this._entity.on('stateChanged', this._renderState.bind(this));
        this._unbindHibernationStateListener = this._entity.on('isInHibernationChanged', this._renderVisibility.bind(this));
    }

    _render() {
        this._bodyContainer = new PIXI.Container();
        this._uiContainer = new PIXI.Container();
        this._pickedItemContainer = new PIXI.Container();
        
        this._entityContainer.addChild(this._bodyContainer);
        this._entityContainer.addChild(this._pickedItemContainer);
        this._entityContainer.addChild(this._uiContainer);

        this._standSprite = this._buildStandSprite();
        this._walkSprite = this._buildWalkSprite();
        this._deadSprite = this._buildDeadSprite();

        this._bodyContainer.addChild(this._standSprite);
        this._bodyContainer.addChild(this._walkSprite);
        this._bodyContainer.addChild(this._deadSprite);

        let halfEntityWidth = this._standSprite.width / 2;
        let halfEntityHeight = this._standSprite.height / 2;

        this._bodyContainer.pivot.x = halfEntityWidth;
        this._bodyContainer.pivot.y = halfEntityHeight;
        this._uiContainer.pivot.x = halfEntityWidth;
        this._uiContainer.pivot.y = halfEntityHeight;
        this._pickedItemContainer.pivot.x = halfEntityWidth;
        this._pickedItemContainer.pivot.y = halfEntityHeight;

        this._hpLineView = this._buildHpLineView();

        this._renderPosition();
        this._renderAngle();
        this._renderState();
        this._renderVisibility();
    }

    remove() {
        setTimeout(() => {
            super.remove();
        }, 5000);
        this._unbindPositionChangedListener();
        this._unbindAngleChangedListener();
        this._unbindStateChangeListener();
        this._unbindHibernationStateListener();
        this._hpLineView.remove();
    }

    _buildStandSprite() {
        throw 'abstract method';
    }

    _buildWalkSprite() {
        throw 'abstract method';
    }

    _buildDeadSprite() {
        throw 'abstract method';
    }

    _buildHpLineView() {
        return new HpLineView(this._entity, { x: 0, y: -4 }, this._standSprite.width, this._uiContainer);
    }

    _renderPosition() {
        this._entityContainer.x = this._entity.position.x;
        this._entityContainer.y = this._entity.position.y;
    }

    _renderAngle() {
        this._bodyContainer.angle = this._entity.angle;
    }

    _renderState() {
        let state = this._entity.state;

        this._toggleStandingState(state == 'standing');
        this._toggleWalkingState(state == 'walking');
        this._toggleDeadState(state == 'dead');
    }

    _renderVisibility() {
        this._entityContainer.renderable = this._entity.isVisible;
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
        this._standSprite.renderable = isEnabling;
    }

    _toggleDeadState(isEnabling) {
        this._deadSprite.renderable = isEnabling;
    }
}

export {
    LiveEntityView
}