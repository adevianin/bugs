import { AppView } from './appView';
import { Requester } from '@common/utils/requester';
import { WorldSpritesheetManager } from './game/world/worldSpritesheetManager';
import { BaseGraphicView } from './base/baseGraphicView';
import { BaseHTMLView } from './base/baseHTMLView';
import { PopupManager } from './popups/popupManager';
import { EventEmitter } from '@utils/eventEmitter.js';
import { uaMessages } from './messages/uaMessagesLib';
import worldSpriteSheetAtlas from './textures/build/world_spritesheet.json';
import worldSpriteSheetUrl from './textures/build/world_spritesheet.png';
import * as PIXI from 'pixi.js';

async function initViewLayer(domainFacade) {
    let requester = new Requester();
    let eventBus = new EventEmitter();
    let spritesheetManager = new WorldSpritesheetManager(worldSpriteSheetUrl, worldSpriteSheetAtlas, requester);
    let popupManager = new PopupManager(document.querySelector('[data-popup-container]'));
    let loaderEl = document.querySelector('[data-game-loader]');

    let pixiApp = new PIXI.Application();

    BaseGraphicView.useTextureManager(spritesheetManager);
    BaseGraphicView.usePopupManager(popupManager);
    BaseGraphicView.useDomainFacade(domainFacade);
    BaseGraphicView.useEventBus(eventBus);
    BaseGraphicView.usePixiApp(pixiApp);
    BaseHTMLView.useDomainFacade(domainFacade);
    BaseHTMLView.useEventBus(eventBus);
    BaseHTMLView.useMessages(uaMessages);
    BaseHTMLView.usePixiApp(pixiApp);

    await spritesheetManager.prepareTextures();
    await pixiApp.init();

    let app = new AppView(document.querySelector('[data-app]'));
    app.events.addListener('ready', () => {
        loaderEl.remove();
    })
}

export { initViewLayer }