import { BaseHTMLView } from "@view/base/baseHTMLView";
import { NestView } from "./nestView";
import { EntityTypes } from "@domain/enum/entityTypes";

class NestsListView extends BaseHTMLView {

    constructor(el) {
        super(el);
        this._nestViews = {};

        this.$domainFacade.events.on('entityDied', this._onSomeoneDied.bind(this));
        this.$domainFacade.events.on('entityBorn', this._onSomeoneBorn.bind(this));
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

    _selectNest(nest) {
        this._selectedNest = nest;
        this.events.emit('selectedNestChanged');
    }

    _renderNests() {
        this._clearNestViews();
        for (let nest of this._nests) {
            this._renderNest(nest);
        }
    }

    _renderNest(nest) {
        let el = document.createElement('li');
        let view = new NestView(el, nest);
        view.events.addListener('click', () => this._onNestClick(nest));
        this._nestViews[nest.id] = view;
        this._el.append(el);
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

    _deleteNestView(nest) {
        this._nestViews[nest.id].remove();
        delete this._nestViews[nest.id];
    }

    _deleteNestEntity(nest) {
        let index = this._nests.indexOf(nest);
        if (index != -1) {
            this._nests.splice(index, 1);
        }
    }

    _onNestClick(nest) {
        this._selectNest(nest);
        this._renderSelectedNest();
    }

    _onSomeoneDied(entity) {
        if (this._checkIsMyNest(entity)) {
            this._deleteNestView(entity);
            this._deleteNestEntity(entity);
            if (this._selectedNest == entity) {
                this._selectedNest = null;
                if (this._nests.length > 0) {
                    this._selectNest(this._nests[0]);
                    this._renderSelectedNest();
                }
            }
        }
    }

    _onSomeoneBorn(entity) {
        if (this._checkIsMyNest(entity)) { 
            this._renderNest(entity);
        }
    }

    _checkIsMyNest(entity) {
        return this._colony && entity.type == EntityTypes.NEST && entity.fromColony == this._colony.id;
    }
}

export {
    NestsListView
}