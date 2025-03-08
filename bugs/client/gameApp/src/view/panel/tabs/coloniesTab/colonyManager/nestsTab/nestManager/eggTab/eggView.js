import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';
import eggTmpl from './eggTmpl.html';
import { GenomeInlineView } from "@view/panel/base/genome/genomeInlineView";
import { antTypesLabels } from "@view/labels/antTypesLabels";
import { eggStatesLabels } from "@view/labels/eggStatesLabels";

class EggView extends BaseGameHTMLView {
    constructor(el, egg, nest) {
        super(el);
        this._nest = nest;
        this._egg = egg;

        this._stopListenProgressChange = this._egg.on('progressChanged', this._onEggProgressChanged.bind(this));
        
        this._render();

        this._antTypeSelector.addEventListener('change', this._onEggAntTypeChanged.bind(this));
        this._nameInput.addEventListener('change', this._onEggNameChanged.bind(this));
        this._toLarvaChamberBtn.addEventListener('click', this._onEggtoLarvaChamberClick.bind(this));
        this._deleteBtn.addEventListener('click', this._onEggDeleteClick.bind(this));
    }

    _render() {
        this._el.innerHTML = eggTmpl;

        this._nameInput = this._el.querySelector('[data-name]');
        this._nameInput.value = this._egg.name;

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
    }

    _renderProgress() {
        let progressValue = this._egg.isDevelopment ? this._egg.progress : 100;
        this._progressEl.innerHTML = progressValue;
        this._stateEl.innerHTML = eggStatesLabels[this._egg.state];
        this._toLarvaChamberBtn.disabled = !this._egg.isReady;
        // this._deleteBtn.disabled = !this._egg.isSpoiled;
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
            await this.$domainFacade.changeEggCasteInNest(this._nest.id, this._egg.id, antType)
        } catch (e) {
            console.error(e);
        }
    }

    async _onEggNameChanged() {
        let name = this._nameInput.value;
        if (!name) {
            return;
        }
        try {
            await this.$domainFacade.changeEggNameInNest(this._nest.id, this._egg.id, name);
        } catch (e) {
            console.error(e);
        }
    }

    async _onEggtoLarvaChamberClick() {
        try {
            await this.$domainFacade.moveEggToLarvaInNest(this._nest.id, this._egg.id);
        } catch (e) {
            console.error(e);
        }
    }

    async _onEggDeleteClick() {
        try {
            await this.$domainFacade.deleteEggInNest(this._nest.id, this._egg.id);
        } catch (e) {
            console.error(e);
        }
    }

    remove() {
        super.remove();
        this._genomeView.remove();
        this._stopListenProgressChange();
    }
}

export {
    EggView
}