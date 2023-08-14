import { EntityView } from './entityView';
import * as PIXI from 'pixi.js';
import { HpLineView } from './hpLine';

class FoodSourceView extends EntityView { 

    constructor(entity, entitiesContainer) {
        super(entity, entitiesContainer);

        this._unbindFertileChangeListener = this._entity.on('fertileChanged', this._renderFertile.bind(this));

        this._render();
    }

    _render() {
        this._bodyContainer = new PIXI.Container();
        this._uiContainer = new PIXI.Container();
        this._entityContainer.addChild(this._bodyContainer);
        this._entityContainer.addChild(this._uiContainer);
        
        this._standSprite = new PIXI.Sprite(this.$textureManager.getTexture(`food_source_${this._entity.foodType}.png`));
        this._bodyContainer.addChild(this._standSprite);
        this._deadSprite = new PIXI.Sprite(this.$textureManager.getTexture(`food_source_${this._entity.foodType}_dead.png`));
        this._bodyContainer.addChild(this._deadSprite);

        this._entityContainer.x = this._entity.position.x;
        this._entityContainer.y = this._entity.position.y;

        this._entityContainer.pivot.x = this._standSprite.width / 2;
        this._entityContainer.pivot.y = this._standSprite.height;

        this._hpLineView = new HpLineView(this._entity, { x: 0, y: -10 }, this._standSprite.width, this._uiContainer);

        this._renderFertile();
    }

    _renderFertile() {
        this._standSprite.renderable = this._entity.isFertile;
        this._deadSprite.renderable = !this._entity.isFertile;
    }

    remove() {
        super.remove();
        this._hpLineView.remove();
        this._unbindFertileChangeListener();
    }
}

export {
    FoodSourceView
}