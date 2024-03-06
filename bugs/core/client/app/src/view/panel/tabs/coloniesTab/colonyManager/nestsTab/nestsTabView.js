import { BaseHTMLView } from "@view/panel/base/baseHTMLView";
import nestsTabTmpl from './nestsTabTmpl.html';
import { NestsListView } from "./nestsList";
import { NestManagerView } from "./nestManager";

class NestsTabView extends BaseHTMLView {

    constructor(el) {
        super(el)

        this._render();

        this._nestsList.events.addListener('selectedNestChanged', this._manageSelectedNest.bind(this));
    }

    manageColony(colony, nestToSelect) {
        this._nestsList.manageColony(colony, nestToSelect);
    }

    _render() {
        this._el.innerHTML = nestsTabTmpl;

        this._nestsList = new NestsListView(this._el.querySelector('[data-nests-list]'));
        this._nestManager = new NestManagerView(this._el.querySelector('[data-nest-manager]'));
    }

    _manageSelectedNest() {
        this._nestManager.manageNest(this._nestsList.selectedNest);
    }
}

export { NestsTabView }