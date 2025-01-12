import * as PIXI from 'pixi.js';

class WorldSpritesheetManager {
    
    constructor(imageUrl, atlas, requester) {
        this._imageUrl = imageUrl;
        this._atlas = atlas;
        this._requester = requester;
        this._spritesheet = null;
    }

    async prepareTextures() {
        let texture = await PIXI.Assets.load(this._imageUrl);

        this._spritesheet = new PIXI.Spritesheet(
            texture,
            this._atlas
        );

        await this._spritesheet.parse();
    }

    getTexture(name) {
        return this._spritesheet.textures[name];
    }

    getAnimatedTextures(name) {
        return this._spritesheet.animations[name];
    }


}

export {
    WorldSpritesheetManager
}