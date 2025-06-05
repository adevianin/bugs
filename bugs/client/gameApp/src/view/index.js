import * as PIXI from 'pixi.js';
import { AppView } from './appView';
import { Requester } from '@common/utils/requester';
import { WorldSpritesheetManager } from './world/worldSpritesheetManager';
import { BaseGraphicView } from './base/baseGraphicView';
import { EventEmitter } from '@common/utils/eventEmitter.js';
import worldSpriteSheetAtlas from './textures/build/world_spritesheet.json';
import worldSpriteSheetUrl from './textures/build/world_spritesheet.png';
import { BaseGameHTMLView } from './base/baseGameHTMLView';
import { BaseView } from '@common/view/base/baseView';
import { MessageMaster } from '@common/messages/messageMaster';
import { gameMsgLibrariesPack } from '@messages/msgLibraries';
import { StepProgressCheker } from './world/stepProgressChecker';


async function initViewLayer(domainFacade) {
    let requester = new Requester();
    let eventBus = new EventEmitter();
    let spritesheetManager = new WorldSpritesheetManager(worldSpriteSheetUrl, worldSpriteSheetAtlas, requester);
    let loaderEl = document.querySelector('[data-game-loader]');

    await spritesheetManager.prepareTextures();
    let pixiApp = new PIXI.Application();
    await pixiApp.init({
        resolution: window.devicePixelRatio,
        autoDensity: true,
        roundPixels: true, // fixes texture bleeding 
    });

    let mm = MessageMaster.init(gameMsgLibrariesPack);

    let stepProgressChecker = new StepProgressCheker(domainFacade);

    BaseView.useDomain(domainFacade);
    BaseView.useEventBus(eventBus);
    BaseView.useMessageMaster(mm);
    BaseGameHTMLView.usePixiApp(pixiApp);
    BaseGraphicView.useStepProgressChecker(stepProgressChecker);
    BaseGraphicView.useTextureManager(spritesheetManager);

    let app = new AppView(document.querySelector('[data-app]'));
    app.events.on('ready', () => {
        loaderEl.remove();
    })
}

export { initViewLayer }