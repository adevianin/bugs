import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';
import eggTmpl from './eggTmpl.html';
import { GenomeInlineView } from "@view/panel/base/genome/genomeInlineView";
import { antTypesLabels } from "@view/labels/antTypesLabels";
import { eggStatesLabels } from "@view/labels/eggStatesLabels";
import { NameEditorView } from '@view/panel/base/nameEditor/nameEditorView';
import { doubleClickProtection } from '@common/utils/doubleClickProtection';
import { DotsLoaderView } from '@common/view/dotsLoader/dotsLoaderView';

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
    }

    _render() {
        this._el.innerHTML = eggTmpl;

        this._genomeView = new GenomeInlineView(this._el.querySelector('[data-genome]'), this._egg.genome);

        this._el.querySelector('[data-is-fertilized]').innerHTML = this._egg.isFertilized ? '+' : '-';

        this._toLarvaChamberBtn = this._el.querySelector('[data-to-larva-chamber]');
        this._deleteBtn = this._el.querySelector('[data-delete]');

        this._progressEl = this._el.querySelector('[data-progress]');
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
        let progressValue = this._egg.isDevelopment ? this._egg.progress : 100;
        this._progressEl.innerHTML = progressValue;
        this._stateEl.innerHTML = eggStatesLabels[this._egg.state];
        this._renderToLarvaChamberBtnState();
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
            option.innerHTML = antTypesLabels[antType];
        }
    }

    _onEggProgressChanged() {
        this._renderProgress();
    }

    async _onEggAntTypeChanged() {
        let antType = this._antTypeSelector.value;
        try {
            await this.$domain.changeEggCasteInNest(this._nest.id, this._egg.id, antType)
        } catch (e) {
            console.error(e);
        }
    }

    async _onEggtoLarvaChamberClick() {
        this._toLarvaLoaderView.toggle(true);
        this._toggleToLarvaChamberBtnBlock(true);
        try {
            await this.$domain.moveEggToLarvaInNest(this._nest.id, this._egg.id);
        } catch (e) {
            console.error(e);
        }
        this._toLarvaLoaderView.toggle(false);
        this._toggleToLarvaChamberBtnBlock(false);
    }

    async _onEggDeleteClick() {
        try {
            await this.$domain.deleteEggInNest(this._nest.id, this._egg.id);
        } catch (e) {
            console.error(e);
        }
    }

}

export {
    EggView
}