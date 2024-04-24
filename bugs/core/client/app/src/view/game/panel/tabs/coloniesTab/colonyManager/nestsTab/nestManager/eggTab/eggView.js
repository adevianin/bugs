import { BaseHTMLView } from "@view/base/baseHTMLView";
import eggTmpl from './eggTmpl.html';
import { ClosableGenomeView } from "@view/game/panel/base/genome/closableGenomeView";
import { antTypesLabels } from "@view/labels/antTypesLabels";

class EggView extends BaseHTMLView {
    constructor(el, egg, nest) {
        super(el);
        this._nest = nest;
        this._egg = egg;

        this._stopListenProgressChange = this._egg.on('progressChanged', this._onEggProgressChanged.bind(this));
        
        this._render();

        this._antTypeSelector.addEventListener('change', this._onEggAntTypeChanged.bind(this));
    }

    _render() {
        this._el.innerHTML = eggTmpl;

        this._el.querySelector('[data-name]').innerHTML = this._egg.name;

        this._genomeView = new ClosableGenomeView(this._el.querySelector('[data-genome]'), this._egg.genome);

        this._el.querySelector('[data-is-fertilized]').innerHTML = this._egg.isFertilized ? '+' : '-';

        this._progressEl = this._el.querySelector('[data-progress]');
        this._renderProgressValue();

        this._antTypeSelector = this._el.querySelector('[data-ant-type-selector]');
        this._renderAntTypeSelectorOptions();
        this._antTypeSelector.value = this._egg.antType;
    }

    _renderProgressValue() {
        this._progressEl.innerHTML = this._egg.progress;
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
        this._renderProgressValue();
    }

    _onEggAntTypeChanged() {
        let antType = this._antTypeSelector.value;
        this._nest.editCasteForEgg(this._egg.id, antType);
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