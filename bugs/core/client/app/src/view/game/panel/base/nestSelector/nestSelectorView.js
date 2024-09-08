import { BaseHTMLView } from "@view/base/baseHTMLView";
import { EntityTypes } from "@domain/enum/entityTypes";

class NestSelectorView extends BaseHTMLView {

    constructor(colonyId) {
        let el = document.createElement('select');
        super(el);
        this._colonyId = colonyId;

        this._stopListenEntityDied = this.$domainFacade.events.on('entityDied', this._onSomeoneDied.bind(this));
        this._stopListenEntityBorn = this.$domainFacade.events.on('entityBorn', this._onSomeoneBorn.bind(this));
        this._el.addEventListener('change', this._onChange.bind(this));

        this._render();
    }

    get nestId() {
        return parseInt(this._el.value);
    }

    set nestId(nestId) {
        this._el.value = nestId;
    }

    _render() {
        let nests = this.$domainFacade.getNestsFromColony(this._colonyId);
        this._el.innerHTML = '';
        for (let nest of nests) {
            this._renderNestOption(nest);
        }
    }

    _renderNestOption(nest) {
        let optionEl = document.createElement('option');
        optionEl.setAttribute('value', nest.id);
        optionEl.innerHTML = `nest ${nest.id}`;
        this._el.append(optionEl);
    }

    _onSomeoneDied(entity) {
        if (this._isMyNest(entity)) {
            this._el.querySelector(`[value="${entity.id}"]`).remove();
        }
    }

    _onSomeoneBorn(entity) {
        if (this._isMyNest(entity)) {
            this._renderNestOption(entity);
        }
    }

    _isMyNest(entity) {
        return entity.type == EntityTypes.NEST && entity.fromColony == this._colonyId;
    }

    _onChange() {
        this.events.emit('changed');
    }

    remove() {
        this._stopListenEntityDied();
        this._stopListenEntityBorn();
        super.remove();
    }
}

export {
    NestSelectorView
}