import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';
import { GAME_MESSAGE_IDS } from '@messages/messageIds';

class NestSelectorView extends BaseGameHTMLView {

    constructor(el, colonyId, canBeEmpty = true) {
        super(el);
        this._colonyId = colonyId;
        this._nests = this.$domain.getNestsFromColony(this._colonyId);
        this._isDisabled = false;
        this._canBeEmpty = canBeEmpty;

        this._render();

        this._stopListenNestDied = this.$domain.events.on(`nestDied:${this._colonyId}`, this._onNestDied.bind(this));
        this._stopListenNestBorn = this.$domain.events.on(`nestBorn:${this._colonyId}`, this._onNestBorn.bind(this));
        this._el.addEventListener('change', this._onChange.bind(this));
    }

    get nestId() {
        return parseInt(this._el.value) || null;
    }

    set nestId(nestId) {
        this._el.value = nestId;
    }

    set disabled(isDisabled) {
        this._isDisabled = isDisabled;
        this._el.disabled = isDisabled;
    }

    get disabled() {
        return this._isDisabled;
    }

    remove() {
        this._stopListenNestDied();
        this._stopListenNestBorn();
        super.remove();
    }

    selectAt(index) {
        let option = this._el.children[index];
        if (option) {
            this.nestId = option.getAttribute('value');
        }
    }

    _render() {
        this._renderEmptyOption();
        
        for (let nest of this._nests) {
            this._renderNestOption(nest);
        }
    }

    _renderEmptyOption() {
        let optionEl = document.createElement('option');
        optionEl.setAttribute('value', 'none');
        if (!this._canBeEmpty) {
            optionEl.setAttribute('disabled', '');
        }
        optionEl.innerHTML = this.$mm.get(GAME_MESSAGE_IDS.NEST_SELECTOR_NOT_SELECTED);
        this._el.append(optionEl);
    }

    _renderNestOption(nest) {
        let optionEl = document.createElement('option');
        optionEl.setAttribute('value', nest.id);
        optionEl.innerHTML = nest.name;
        this._el.append(optionEl);
    }

    _removeNestOption(nestId) {
        this._el.querySelector(`[value="${nestId}"]`).remove();
    }

    _removeNestFromArray(nest) {
        let index = this._nests.indexOf(nest);
        if (index > -1) {
            this._nests.splice(index, 1);
        }
    }

    _clearValue() {
        this._el.value = 'none';
        // this.events.emit('changed');
    }

    _onNestDied(nest) {
        if (this.nestId == nest.id) {
            this._clearValue();
        }
        this._removeNestOption(nest.id);
        this._removeNestFromArray(nest);
        
    }

    _onNestBorn(nest) {
        this._nests.push(nest);
        this._renderNestOption(nest);
    }

    _onChange() {
        this.events.emit('changed');
    }

}

export {
    NestSelectorView
}