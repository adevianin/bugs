import { BaseView } from './base/baseView';
import { AppView } from './appView';
import { Requester } from '@common/utils/requester';
import { WorldSpritesheetManager } from './world/worldSpritesheetManager';
import { BaseGraphicView } from './base/baseGraphicView';
import { EventEmitter } from '@utils/eventEmitter.js';
import { uaMessages } from '../messages/uaMessagesLib';
import worldSpriteSheetAtlas from './textures/build/world_spritesheet.json';
import worldSpriteSheetUrl from './textures/build/world_spritesheet.png';
import { MessageMaster } from '@messages/messageMaster';
import { msgLibrariesPack } from '@messages/msgLibraries';
import * as PIXI from 'pixi.js';

async function initViewLayer(domainFacade) {
    let requester = new Requester();
    let eventBus = new EventEmitter();
    let spritesheetManager = new WorldSpritesheetManager(worldSpriteSheetUrl, worldSpriteSheetAtlas, requester);
    let loaderEl = document.querySelector('[data-game-loader]');

    await spritesheetManager.prepareTextures();
    let pixiApp = new PIXI.Application();
    await pixiApp.init();

    let mm = MessageMaster.build(msgLibrariesPack);

    BaseView.useDomainFacade(domainFacade);
    BaseView.useEventBus(eventBus);
    BaseView.useMessages(uaMessages);
    BaseView.usePixiApp(pixiApp);
    BaseView.useMessageMaster(mm);
    BaseGraphicView.useTextureManager(spritesheetManager);

    let app = new AppView(document.querySelector('[data-app]'));
    app.events.addListener('ready', () => {
        loaderEl.remove();
    })
}

export { initViewLayer }