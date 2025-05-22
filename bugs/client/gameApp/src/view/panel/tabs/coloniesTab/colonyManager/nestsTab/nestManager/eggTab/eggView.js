import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';
import eggTmpl from './eggTmpl.html';
import { GenomeInlineView } from "@view/panel/base/genome/genomeInlineView";
import { NameEditorView } from '@view/panel/base/nameEditor/nameEditorView';
import { doubleClickProtection } from '@common/utils/doubleClickProtection';
import { DotsLoaderView } from '@common/view/dotsLoader/dotsLoaderView';
import { EggStates } from "@domain/enum/eggStates";
import { GAME_MESSAGE_IDS } from '@messages/messageIds';
import { antTypesLabelIds } from '@view/labels/antTypesLabelIds';

class EggView extends BaseGameHTMLView {
    constructor(el, egg, nest) {
        super(el);
        this._nest = nest;
        this._egg = egg;
        this._isToLarvaChamberBtnBlocked = false;

        this._stopListenProgressChange = this._egg.on('progressChanged', this._onEggProgressChanged.bind(this));
        
        this._render();

        this._antTypeSelector.addEventListener('change', this._onEggAntTypeChanged.bind(this));
        this._toLarvaChamberBtn.addEventListener('click', doubleClickProtection(this._onEggtoLarvaChamberClick.bind(this)));
        this._deleteBtn.addEventListener('click', doubleClickProtection(this._onEggDeleteClick.bind(this)));
    }

    remove() {
        super.remove();
        this._genomeView.remove();
        this._nameEditor.remove();
        this._toLarvaLoaderView.remove();
        this._stopListenProgressChange();
        this._stopWaitAnyLarva();
    }

    _render() {
        this._el.innerHTML = eggTmpl;

        this._genomeView = new GenomeInlineView(this._el.querySelector('[data-genome-btn-container]'), this._egg.genome);

        this._toLarvaChamberBtn = this._el.querySelector('[data-to-larva-chamber]');
        this._toLarvaChamberBtn.innerHTML = this.$mm.get(GAME_MESSAGE_IDS.NEST_MANAGER_EGG_TAB_EGG_TO_LARVA_BTN_LABEL);
        this._deleteBtn = this._el.querySelector('[data-delete]');
        this._deleteBtn.innerHTML = this.$mm.get(GAME_MESSAGE_IDS.NEST_MANAGER_EGG_TAB_DELETE_EGG_BTN_LABEL);

        this._stateEl = this._el.querySelector('[data-state]');
        this._renderProgress();

        this._antTypeSelector = this._el.querySelector('[data-ant-type-selector]');
        this._renderAntTypeSelectorOptions();
        this._antTypeSelector.value = this._egg.antType;

        this._nameEditor = new NameEditorView(this._el.querySelector('[data-name-editor]'), this._applyEggName.bind(this), this._egg.name);

        this._toLarvaLoaderView = new DotsLoaderView(this._el.querySelector('[data-to-larva-loader]'));
    }

    async _applyEggName(newName) {
        await this.$domain.changeEggNameInNest(this._nest.id, this._egg.id, newName);
        return true;
    }

    _renderProgress() {
        this._stateEl.innerHTML = this._egg.isDevelopment ? `${this._egg.progress}%` : this._getEggStateText(this._egg.state);
        this._renderToLarvaChamberBtnState();
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

    _renderToLarvaChamberBtnState() {
        this._toLarvaChamberBtn.disabled = !this._egg.isReady || this._isToLarvaChamberBtnBlocked;
    }

    _toggleToLarvaChamberBtnBlock(isBlocked) {
        this._isToLarvaChamberBtnBlocked = isBlocked;
        this._renderToLarvaChamberBtnState();
    }

    _renderAntTypeSelectorOptions() {
        let antTypes = this._egg.avaliableAntTypes;
        for (let antType of antTypes) {
            let option = document.createElement('option');
            this._antTypeSelector.append(option);
            option.value = antType;
            option.innerHTML = this.$mm.get(antTypesLabelIds[antType]);
        }
    }

    _onEggProgressChanged() {
        this._renderProgress();
    }

    async _onEggAntTypeChanged() {
        let antType = this._antTypeSelector.value;
        await this.$domain.changeEggCasteInNest(this._nest.id, this._egg.id, antType)
    }

    async _onEggtoLarvaChamberClick() {
        this._toLarvaLoaderView.toggleVisibility(true);
        this._toggleToLarvaChamberBtnBlock(true);
        let result = await this.$domain.moveEggToLarvaInNest(this._nest.id, this._egg.id);
        if (result.success) {
            this._waitLarva(result.larvaId, () => {
                this._toLarvaLoaderView.toggleVisibility(false);
                this._toggleToLarvaChamberBtnBlock(false);
                this.toggle(false);
            });
        } else {
            this._toLarvaLoaderView.toggleVisibility(false);
            this._toggleToLarvaChamberBtnBlock(false);
        }
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

}

export {
    EggView
}