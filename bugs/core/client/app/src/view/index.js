import { AppView } from './appView';
import { Requester } from 'utils/requester';
import { WorldSpritesheetManager } from './world/worldSpritesheetManager';

function initViewLayer(domainFacade, initialData) {
    let requester = new Requester();
    let spritesheetManager = new WorldSpritesheetManager(initialData.urls.world_spritesheet, initialData.urls.world_spritesheet_atlas, requester);
    let app = new AppView(document, domainFacade, spritesheetManager);
}

export { initViewLayer }