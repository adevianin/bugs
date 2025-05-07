import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';
import nestsTabTmpl from './nestsTabTmpl.html';
import { NestsSelectView } from './nestsSelect/nestsSelectView';
import { NestManagerView } from "./nestManager";
import { GAME_MESSAGE_IDS } from '@messages/messageIds';

class NestsTabView extends BaseGameHTMLView {

    constructor(el) {
        super(el)

        this._render();

        this._nestsList.events.on('selectedNestChanged', this._manageSelectedNest.bind(this));
    }

    manageColony(colony, nestToSelect) {
        this._nestsList.manageColony(colony, nestToSelect);
    }

    _render() {
        this._el.innerHTML = nestsTabTmpl;

        this._nestsList = new NestsSelectView(this._el.querySelector('[data-nests-select]'));
        this._nestManager = new NestManagerView(this._el.querySelector('[data-nest-manager]'));

        this._el.querySelector('[data-nest-label]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.NESTS_TAB_NEST_LABEL);
    }

    _manageSelectedNest() {
        this._nestManager.manageNest(this._nestsList.selectedNest);
    }
}

export { NestsTabView }