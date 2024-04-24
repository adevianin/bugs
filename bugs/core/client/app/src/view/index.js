import { AppView } from './appView';
import { Requester } from '@utils/requester';
import { WorldSpritesheetManager } from './game/world/worldSpritesheetManager';
import { BaseGraphicView } from './base/baseGraphicView';
import { BaseHTMLView } from './base/baseHTMLView';
import { PopupManager } from './popups/popupManager';
import { EventEmitter } from '@utils/eventEmitter.js';
import worldSpriteSheetAtlas from './textures/build/world_spritesheet.json';
import worldSpriteSheetUrl from './textures/build/world_spritesheet.png'

async function initViewLayer(domainFacade) {
    let requester = new Requester();
    let eventBus = new EventEmitter();
    let spritesheetManager = new WorldSpritesheetManager(worldSpriteSheetUrl, worldSpriteSheetAtlas, requester);
    let popupManager = new PopupManager(document.querySelector('[data-popup-container]'));

    BaseGraphicView.useTextureManager(spritesheetManager);
    BaseGraphicView.usePopupManager(popupManager);
    BaseGraphicView.useDomainFacade(domainFacade);
    BaseGraphicView.useEventBus(eventBus);
    BaseHTMLView.useDomainFacade(domainFacade);
    BaseHTMLView.useEventBus(eventBus);

    await spritesheetManager.prepareTextures();

    let app = new AppView(document.querySelector('[data-app]'));
}

export { initViewLayer }