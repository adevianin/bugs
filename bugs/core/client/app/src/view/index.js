import { AppView } from './appView';
import { Requester } from 'utils/requester';
import { WorldSpritesheetManager } from './world/worldSpritesheetManager';
import { BaseGraphicView } from './base/baseGraphicView';
import { BaseHTMLView } from './base/baseHTMLView';
import { PopupManager } from './popups/popupManager';
import { EventEmitter } from 'utils/eventEmitter.js';

function initViewLayer(domainFacade, initialData) {
    let requester = new Requester();
    let eventBus = new EventEmitter();

    let spritesheetManager = new WorldSpritesheetManager(initialData.urls.world_spritesheet, initialData.urls.world_spritesheet_atlas, requester);
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