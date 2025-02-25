import { BaseHTMLView } from "@view/base/baseHTMLView";
import { NestView } from "./nestView";

class NestsListView extends BaseHTMLView {

    constructor(el) {
        super(el);
        this._nestViews = {};
    }

    manageColony(colony, nestToSelect) {
        this._colony = colony;
        this._nests = this.$domainFacade.getNestsFromColony(colony.id);
        this._selectNest(nestToSelect || this._nests[0]);
        this._renderNests();
        this._renderSelectedNest();
    }

    get selectedNest() {
        return this._selectedNest;
    }

    selectNest(nest) {
        this._selectNest(nest);
        this._renderSelectedNest();
    }

    _selectNest(nest) {
        this._selectedNest = nest;
        this.events.emit('selectedNestChanged');
    }

    _renderNests() {
        this._clearNestViews();
        for (let nest of this._nests) {
            let el = document.createElement('li');
            let view = new NestView(el, nest);
            view.events.addListener('click', () => this._onNestClick(nest));
            this._nestViews[nest.id] = view;
            this._el.append(el);
        }
    }

    _renderSelectedNest() {
        for (let nestId in this._nestViews) {
            this._nestViews[nestId].toggleSelected(this._selectedNest.id == nestId);
        }
    }

    _clearNestViews() {
        for (let nestId in this._nestViews) {
            this._nestViews[nestId].remove();
        }
        this._nestViews = {};
    }

    _onNestClick(nest) {
        this._selectNest(nest);
        this._renderSelectedNest();
    }
}

export {
    NestsListView
}