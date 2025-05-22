import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';
import eggTabTmpl from './eggTabTmpl.html';
import { EggView } from "./eggView";
import { DotsLoaderView } from '@common/view/dotsLoader/dotsLoaderView';
import { ErrorCodes } from '@domain/enum/errorCodes';
import { GAME_MESSAGE_IDS } from '@messages/messageIds';

class EggTabView extends BaseGameHTMLView {

    constructor(el) {
        super(el);
        this._eggsViews = {};

        this._render();

        this._addEggBtn.addEventListener('click', this._onAddEggBtnClick.bind(this));
    }

    _render() {
        this._el.innerHTML = eggTabTmpl;
        this._eggsListEl = this._el.querySelector('[data-eggs-list]');
        this._addEggBtn = this._el.querySelector('[data-add-egg]');
        this._addEggBtn.innerHTML = this.$mm.get(GAME_MESSAGE_IDS.NEST_MANAGER_EGG_TAB_LAY_EGG_BTN_LABEL);
        this._isFertilizeCheckbox = this._el.querySelector('[data-is-fertilized]');
        this._errorContainerEl = this._el.querySelector('[data-error-container]');
        this._addEggLoader = new DotsLoaderView(this._el.querySelector('[data-lay-egg-loader]'));
        this._noEggsPlaceholder = this._el.querySelector('[data-no-eggs-placeholder]');

        this._el.querySelector('[data-title]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.NEST_MANAGER_EGG_TAB_TITLE);
        this._el.querySelector('[data-fertilize-label]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.NEST_MANAGER_EGG_TAB_FERTILIZE_LABEL);
        this._el.querySelector('[data-col-title-name]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.NEST_MANAGER_EGG_TAB_COL_TITLE_NAME);
        this._el.querySelector('[data-col-title-state]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.NEST_MANAGER_EGG_TAB_COL_TITLE_STATE);
        this._el.querySelector('[data-col-title-caste]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.NEST_MANAGER_EGG_TAB_COL_TITLE_CASTE);
        this._el.querySelector('[data-col-title-actions]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.NEST_MANAGER_EGG_TAB_COL_TITLE_ACTIONS);
        this._el.querySelector('[data-no-eggs-placeholder-label]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.NEST_MANAGER_EGG_TAB_NO_EGGS_LABEL);
        this._el.querySelector('[data-lay-egg-title]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.NEST_MANAGER_EGG_TAB_LAY_EGG_TITLE);
    }

    manageNest(nest) {
        this._stopListenNest();
        this._nest = nest;
        this._listenNest();

        this._renderEggsList();
        this._renderNoEggsState();
        this._renderError('');
    }

    _listenNest() {
        this._stopListenEggDeleted = this._nest.on('eggRemoved', this._onEggDeleted.bind(this));
        this._stopListenEggAdded = this._nest.on('eggAdded', this._onEggAdded.bind(this));
    }

    _stopListenNest() {
        if (!this._nest) {
            return
        }

        this._stopListenEggDeleted();
        this._stopListenEggAdded();
        this._stopWaitingEggAdding();
    }

    _renderEggsList() {
        this._clearEggsViews();
        for (let egg of this._nest.eggs) {
            this._renderEgg(egg);
        }
    }

    _renderEgg(egg) {
        let el = document.createElement('tr');
        this._eggsListEl.append(el);
        let view = new EggView(el, egg, this._nest);
        view.events.on('deleteRequest', () => this._onDeleteEggRequest(egg));
        this._eggsViews[egg.id] = view;
    }

    _clearEggsViews() {
        for (let eggId in this._eggsViews) {
            this._eggsViews[eggId].remove();
        }
        this._eggsViews = {};
    }

    _removeEggView(egg) {
        this._eggsViews[egg.id].remove();
        delete this._eggsViews[egg.id];
    }

    async _validate() {
        let errorId = await this.$domain.validateLayingEggInNest(this._nest.id);
        this._renderError(errorId ? this.$mm.get(errorId) : '');

        return !errorId;
    }

    _toggleAddEggBtn(isEnabled) {
        this._addEggBtn.disabled = !isEnabled;
    }

    _renderNoEggsState() {
        let isEmpty = true;
        for (let egg of this._nest.eggs) {
            if (!egg.isMarkedAsRemoving()) {
                isEmpty = false;
                break;
            }
        }
        this._noEggsPlaceholder.classList.toggle('g-hidden', !isEmpty);
    }

    _onEggDeleted(egg) {
        this._removeEggView(egg);
        this._renderNoEggsState();
    }

    _onEggAdded(egg) {
        this._renderEgg(egg);
        this._renderNoEggsState();
    }

    async _onAddEggBtnClick() {
        let isValid = await this._validate();
        if (!isValid) {
            return;
        }

        this._toggleAddEggBtn(false);
        this._addEggLoader.toggleVisibility(true);
        
        let name = this._generateAntName();
        let isFertilized = this._isFertilizeCheckbox.checked;

        let result = await this.$domain.layEggInNest(this._nest.id, name, isFertilized);

        if (result.success) {
            this._waitEggAdding(result.eggId, () => {
                this._toggleAddEggBtn(true);
                this._addEggLoader.toggleVisibility(false);
            });
        } else {
            this._toggleAddEggBtn(true);
            this._addEggLoader.toggleVisibility(false);
            if (result.errCode == ErrorCodes.CONFLICT) {
                await this._validate();
            } else {
                this._renderError(this.$mm.get(GAME_MESSAGE_IDS.SOMETHING_WENT_WRONG));
            }
        }
    }

    _waitEggAdding(eggId, callback) {
        this._stopWaitingEggAdding();
        
        if (this._nest.hasEgg(eggId)) {
            callback();
        } else {
            this._stopListeningEggAdding = this._nest.on(`eggAdded:${eggId}`, () => {
                callback();
            });
        }
    }

    _stopWaitingEggAdding() {
        if (this._stopListeningEggAdding) {
            this._stopListeningEggAdding();
            this._stopListeningEggAdding = null;
        }
    }

    _generateAntName() {
        let adjectives = this.$mm.get(GAME_MESSAGE_IDS.ANT_NAME_ADJECTIVES);
        let nouns = this.$mm.get(GAME_MESSAGE_IDS.ANT_NAME_NOUNS);

        let randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
        let randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

        return `${randomAdjective} ${randomNoun}`;
    }

    _renderError(errText) {
        this._errorContainerEl.innerHTML = errText || '';
    }

    _onDeleteEggRequest(egg) {
        egg.markAsRemoving();
        this._eggsViews[egg.id].toggle(false);
        this.$domain.deleteEggInNest(this._nest.id, egg.id);
        this._renderNoEggsState();
    }

}

export {
    EggTabView
}