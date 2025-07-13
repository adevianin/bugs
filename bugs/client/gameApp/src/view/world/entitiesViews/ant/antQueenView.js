import { ACTION_TYPES } from '@domain/entity/action/actionTypes';
import { BaseAntView } from "./baseAntView";
import { CONSTS } from '@domain/consts';
import { distance_point } from '@utils/distance';

class AntQueenView extends BaseAntView {

    static ANIMATION_TYPES = class extends BaseAntView.ANIMATION_TYPES {
        static FLEW_NUPTIAL_BACK = 'flew_nuptial_back';
        static WINGS_REMOVED = 'wings_removed';
    }

    constructor(entity, entityContainer, entitiesLayer, hudLayer) {
        super(entity, entityContainer, entitiesLayer, hudLayer);

        this._render();

        let antId = this._entity.id;
        this._stopListenFlewNuptialBackAnimationRequest = this.$eventBus.on(`entityActionAnimationRequest:${antId}:${ACTION_TYPES.ANT_FLEW_NUPTIAL_FLIGHT_BACK}`, this._onFlewNuptialBackAnimationRequest.bind(this));
        this._stopListenWingsRemovedAR = this.$eventBus.on(`entityActionAnimationRequest:${antId}:${ACTION_TYPES.ANT_WINGS_REMOVED}`, this._onWingsRemovedAR.bind(this));
    }

    remove() {
        super.remove();
        this._stopListenFlewNuptialBackAnimationRequest();
        this._stopListenWingsRemovedAR();
    }

    _prepareTextures() {
        this._standTexture = this.$textureManager.getTexture(`ant_${this.entity.antType}_1.png`);
        let walkTextures = this.$textureManager.getAnimatedTextures(`ant_${this.entity.antType}`);
        this._walkTextures = [walkTextures[0], walkTextures[1], walkTextures[0], walkTextures[2]];
        this._deadTexture = this.$textureManager.getTexture(`ant_${this.entity.antType}_dead.png`);

        this._standTextureNoWings = this.$textureManager.getTexture(`ant_${this.entity.antType}_no_wings_1.png`);
        let walkTexturesNoWings = this.$textureManager.getAnimatedTextures(`ant_${this.entity.antType}_no_wings`);
        this._walkTexturesNoWings = [walkTexturesNoWings[0], walkTexturesNoWings[1], walkTexturesNoWings[0], walkTexturesNoWings[2]];
        this._deadTextureNoWings = this.$textureManager.getTexture(`ant_${this.entity.antType}_no_wings_dead.png`);
    }

    _renderEntityState() {
        super._renderEntityState();
        this._renderIsWingsRemovedState(this._entity.isWingsRemoved);
    }

    _renderIsWingsRemovedState(isWingsRemoved) {
        this._standSprite.texture = isWingsRemoved ? this._standTextureNoWings : this._standTexture;
        this._walkSprite.textures = isWingsRemoved ? this._walkTexturesNoWings : this._walkTextures;
        this._deadSprite.texture = isWingsRemoved ? this._deadTextureNoWings : this._deadTexture;
    }

    _playAnimation(animation) {
        let resp = super._playAnimation(animation);
        if (resp.isPlayed) {
            return resp;
        }

        switch (animation.type) {
            case AntQueenView.ANIMATION_TYPES.FLEW_NUPTIAL_BACK: 
                let animPromise = this._playFlewNuptialBackAnimation(animation.params);
                return this._makePlayAnimationResponse(true, animPromise);
            case AntQueenView.ANIMATION_TYPES.WINGS_REMOVED: 
                this._playWingsRemovedAnimation(animation.params);
                return this._makePlayAnimationResponse(true);
            default:
                return this._makePlayAnimationResponse(false);
        }
    }

    async _playFlewNuptialBackAnimation({ landingPosition, fromPosition }) {
        let pointFrom = fromPosition;
        let pointTo = landingPosition;
        let userSpeed = distance_point(pointFrom, pointTo) / (CONSTS.STEP_TIME * 1000);

        this._toggleEntityVisibility(true);
        this._renderVisualState(AntQueenView.VISUAL_STATES.FLYING);
        await this._playEntityWalkAnimation({ pointFrom, pointTo, userSpeed }, AntQueenView.ANIMATION_TYPES.FLEW_NUPTIAL_BACK);
        this._renderVisualState(AntQueenView.VISUAL_STATES.STANDING);
    }

    _playWingsRemovedAnimation() {
        this._renderIsWingsRemovedState(true);
    }

    _onFlewNuptialBackAnimationRequest(params) {
        this._addAnimation(AntQueenView.ANIMATION_TYPES.FLEW_NUPTIAL_BACK, params);
    }

    _onWingsRemovedAR() {
        this._addAnimation(AntQueenView.ANIMATION_TYPES.WINGS_REMOVED);
    }

}

export {
    AntQueenView
}