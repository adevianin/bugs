import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';
import { NestView } from './nestView';

class NestsSelectView extends BaseGameHTMLView {

    constructor(el) {
        super(el);

        this._nests = [];
        this._nestViews = {};

        this.$domain.myState.on('nestBorn', this._onNestBorn.bind(this));
        this.$domain.myState.on('nestDied', this._onNestDied.bind(this));

        this._el.addEventListener('change', this._onChange.bind(this));
    }

    manageColony(colony, nestToSelect) {
        this._colony = colony;
        this._nests = this.$domain.getMyNestsFromMyColony(colony.id);

        this._clearNestViews();
        if (this._nests.length > 0) {
            this._renderNests();
            this._selectNest(nestToSelect || this._nests[0]);
        }
        
    }

    get selectedNest() {
        return this._nests.find(n => n.id == this._selectedNestId);
    }

    get _selectedNestId() {
        if (!this._el.value) {
            return null;
        }

        return parseInt(this._el.value);
    }

    _selectNest(nest) {
        this._el.value = nest.id;
        this._emitChange();
    }

    _renderNests() {
        for (let nest of this._nests) {
            this._renderNest(nest);
        }
    }

    _renderNest(nest) {
        let el = document.createElement('option');
        let nestView = new NestView(el, nest);
        this._nestViews[nest.id] = nestView;
        this._el.append(el);
    }

    _clearNestViews() {
        for (let nestId in this._nestViews) {
            this._nestViews[nestId].remove();
        }
        this._nestViews = {};
    }

    _emitChange() {
        this.events.emit('selectedNestChanged');
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

    _checkIsMyNest(nest) {
        return this._colony && nest.fromColony == this._colony.id;
    }

    _onChange() {
        this._emitChange();
    }

    _onNestBorn(nest) {
        if (this._checkIsMyNest(nest)) {
            this._nests.push(nest);
            this._renderNest(nest);
            if (this._selectedNestId == nest.id) {
                this._emitChange();
            }
        }
    }

    _onNestDied(nest) {
        if (this._checkIsMyNest(nest)) { 
            let isSelectedNestDied = this._selectedNestId == nest.id;
            this._deleteNestView(nest);
            this._deleteNestEntity(nest);
            if (isSelectedNestDied) {
                this._emitChange();
            }
        }
    }

}

export {
    NestsSelectView
}