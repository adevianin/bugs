import { AppView } from './appView';
import { Requester } from 'utils/requester';
import { WorldSpritesheetManager } from './world/worldSpritesheetManager';
import { BaseView } from './world/baseView';
import { PopupManager } from './popups/popupManager';

function initViewLayer(domainFacade, initialData) {
    let requester = new Requester();

    let spritesheetManager = new WorldSpritesheetManager(initialData.urls.world_spritesheet, initialData.urls.world_spritesheet_atlas, requester);
    BaseView.useTextureManager(spritesheetManager);

    let popupManager = new PopupManager(document.querySelector('[data-popup-container]'));
    BaseView.usePopupManager(popupManager);

    BaseView.useDomainFacade(domainFacade);

    let app = new AppView(document, domainFacade);
}

export { initViewLayer }