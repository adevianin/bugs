import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';

class ColoniesSelectView extends BaseGameHTMLView {

    constructor(el) {
        super(el);

        this.$domain.myState.on('colonyBorn', this._onColonyBorn.bind(this));
        this.$domain.myState.on('colonyDied', this._onColonyDied.bind(this));

        this._el.addEventListener('change', this._onColonyChanged.bind(this));

        this._renderColonies();
    }

    get selectedColony() {
        return this.$domain.myState.colonies.find(c => c.id == this._selectedColonyId);
    }

    get _selectedColonyId() {
        if (!this._el.value) {
            return null;
        }
        return parseInt(this._el.value);
    }

    selectColony(colonyId) {
        this._el.value = colonyId;
    }

    _renderColonies() {
        for (let colony of this.$domain.myState.colonies) {
            this._renderColony(colony);
        }
    }

    _renderColony(colony) {
        let optionEl = document.createElement('option');
        optionEl.value = colony.id;
        optionEl.innerHTML = colony.name;
        this._el.append(optionEl);
    }

    _removeColonyFromSelect(colonyId) {
        for (let option of this._el.children) {
            let optionColonyId = parseInt(option.getAttribute('value'));
            if (optionColonyId == colonyId) {
                option.remove();
                return;
            }
        }
    }

    _onColonyChanged() {
        this._emitChange();
    }

    _onColonyBorn(colony) {
        this._renderColony(colony);
        if (this.selectedColony.id == colony.id) {
            this._emitChange();
        }
    }

    _onColonyDied(colony) {
        let isSlectedColonyDied = this._selectedColonyId == colony.id;
        this._removeColonyFromSelect(colony.id);
        if (isSlectedColonyDied) {
            this._emitChange();
        }
    }

    _emitChange() {
        this.events.emit('selectedColonyChanged');
    }

}

export {
    ColoniesSelectView
}