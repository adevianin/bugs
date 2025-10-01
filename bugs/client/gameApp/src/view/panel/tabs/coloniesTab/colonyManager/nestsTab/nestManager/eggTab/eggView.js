import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';
import eggTmpl from './eggTmpl.html';
import { GenomeInlineView } from "@view/panel/base/genome/genomeInlineView";
import { NameEditorView } from '@view/panel/base/nameEditor/nameEditorView';
import { doubleClickProtection } from '@common/utils/doubleClickProtection';
import { EggStates } from "@domain/enum/eggStates";
import { GAME_MESSAGE_IDS } from '@messages/messageIds';
import { getAntCasteMsgId } from '@utils/getAntCasteMsgId';
import { isMobileCheck } from '@utils/isMobileCheck';

class EggView extends BaseGameHTMLView {
    constructor(el, egg, nest) {
        super(el);
        this._nest = nest;
        this._egg = egg;
        this._isToLarvaChamberBtnBlocked = false;

        this._stopListenProgressChange = this._egg.on('progressChanged', this._onEggProgressChanged.bind(this));
        
        this._render();

        this._antTypeSelector.addEventListener('change', this._onEggAntTypeChanged.bind(this));
        this._deleteBtn.addEventListener('click', doubleClickProtection(this._onEggDeleteClick.bind(this)));
    }

    remove() {
        super.remove();
        this._genomeView.remove();
        this._nameEditor.remove();
        this._stopListenProgressChange();
        this._stopWaitAnyLarva();
    }

    _render() {
        this._el.innerHTML = eggTmpl;

        this._genomeView = new GenomeInlineView(this._el.querySelector('[data-genome-btn-container]'), this._egg.genome);

        this._deleteBtn = this._el.querySelector('[data-delete]');
        this._deleteBtn.innerHTML = this.$mm.get(GAME_MESSAGE_IDS.NEST_MANAGER_EGG_TAB_DELETE_EGG_BTN_LABEL);

        this._stateEl = this._el.querySelector('[data-state]');
        this._renderProgress();

        this._antTypeSelector = this._el.querySelector('[data-ant-type-selector]');
        this._renderAntTypeSelectorOptions();
        this._antTypeSelector.value = this._egg.antType;

        this._nameEditor = new NameEditorView(this._el.querySelector('[data-name-editor]'), this._applyEggName.bind(this), this._egg.name);
        if (isMobileCheck()) {
            this._nameEditor.events.on('modeChanged', this._onNameEditorModeChanged.bind(this));
        }

        this._casteSelectorTdEl = this._el.querySelector('[data-caste-selector-td]');
        this._nameEditorTdEl = this._el.querySelector('[data-name-editor-td]');
    }

    async _applyEggName(newName) {
        await this.$domain.changeEggNameInNest(this._nest.id, this._egg.id, newName);
        return true;
    }

    _renderProgress() {
        this._stateEl.innerHTML = this._egg.isDevelopment ? `${this._egg.progress}%` : this._getEggStateText(this._egg.state);
    }

    _getEggStateText(state) {
        switch (state) {
            case EggStates.DEVELOPMENT:
                return this.$mm.get(GAME_MESSAGE_IDS.EGG_STATE_DEVELOPMENT);
            case EggStates.READY:
                return this.$mm.get(GAME_MESSAGE_IDS.EGG_STATE_READY);
            case EggStates.SPOILED:
                return this.$mm.get(GAME_MESSAGE_IDS.EGG_STATE_SPOILED);
        }
    }

    _toggleToLarvaChamberBtnBlock(isBlocked) {
        this._isToLarvaChamberBtnBlocked = isBlocked;
    }

    _renderAntTypeSelectorOptions() {
        let antTypes = this._egg.avaliableAntTypes;
        for (let antType of antTypes) {
            let option = document.createElement('option');
            this._antTypeSelector.append(option);
            option.value = antType;
            option.innerHTML = this.$mm.get(getAntCasteMsgId(antType));
        }
    }

    _onEggProgressChanged() {
        this._renderProgress();
    }

    async _onEggAntTypeChanged() {
        let antType = this._antTypeSelector.value;
        await this.$domain.changeEggCasteInNest(this._nest.id, this._egg.id, antType)
    }

    _onEggDeleteClick() {
        this.events.emit('deleteRequest');
    }

    _waitLarva(larvaId, callback) {
        this._stopWaitAnyLarva();
        if (this._nest.hasLarva(larvaId)) {
            callback();
        } else {
            this._stopListenLarvaAdding = this._nest.on(`larvaAdded:${larvaId}`, () => {
                callback();
            });
        }
    }

    _stopWaitAnyLarva() {
        if (this._stopListenLarvaAdding) {
            this._stopListenLarvaAdding();
            this._stopListenLarvaAdding = null;
        }
    }

    _toggleNameEditMode(isNameEditing) {
        this._casteSelectorTdEl.classList.toggle('g-hidden', isNameEditing);
        if (isNameEditing) {
            this._nameEditorTdEl.setAttribute('colspan', 2);
        } else {
            this._nameEditorTdEl.removeAttribute('colspan');
        }
    }

    _onNameEditorModeChanged(mode) {
        this._toggleNameEditMode(mode == NameEditorView.MODES.EDIT);
    }

}

export {
    EggView
}