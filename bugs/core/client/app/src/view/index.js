import { AppView } from './appView';
import { Requester } from '@utils/requester';
import { WorldSpritesheetManager } from './world/worldSpritesheetManager';
import { BaseGraphicView } from './world/base/baseGraphicView';
import { BaseHTMLView } from './panel/base/baseHTMLView';
import { PopupManager } from './popups/popupManager';
import { EventEmitter } from '@utils/eventEmitter.js';
import worldSpriteSheetAtlas from './textures/build/world_spritesheet.json';
import worldSpriteSheetUrl from './textures/build/world_spritesheet.png'

function initViewLayer(domainFacade) {
    let requester = new Requester();
    let eventBus = new EventEmitter();

    let spritesheetManager = new WorldSpritesheetManager(worldSpriteSheetUrl, worldSpriteSheetAtlas, requester);
    BaseGraphicView.useTextureManager(spritesheetManager);

    let popupManager = new PopupManager(document.querySelector('[data-popup-container]'));
    BaseGraphicView.usePopupManager(popupManager);

    BaseGraphicView.useDomainFacade(domainFacade);
    BaseHTMLView.useDomainFacade(domainFacade);

    BaseGraphicView.useEventBus(eventBus);
    BaseHTMLView.useEventBus(eventBus);

    let app = new AppView(document, domainFacade);
}

export { initViewLayer }