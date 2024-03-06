import { BaseHTMLView } from "@view/panel/base/baseHTMLView";
import eggTmpl from './eggTmpl.html';
import { ClosableGenomeView } from "@view/panel/base/genome/closableGenomeView";
import { antTypesLabels } from "@view/panel/base/labels/antTypesLabels";

class EggView extends BaseHTMLView {
    constructor(el, egg) {
        super(el);
        this._egg = egg;

        this._egg.on('progressChanged', this._onEggProgressChanged.bind(this));
        
        this._render();
    }

    _render() {
        this._el.innerHTML = eggTmpl;

        this._el.querySelector('[data-name]').innerHTML = this._egg.name;
        this._genomeView = new ClosableGenomeView(this._el.querySelector('[data-genome]'), this._egg.genome);
        this._el.querySelector('[data-is-fertilized]').innerHTML = this._egg.isFertilized ? '+' : '-';
        this._progressEl = this._el.querySelector('[data-progress]');
        this._antTypeSelector = this._el.querySelector('[data-ant-type-selector]');

        this._renderProgress();
        this._renderAntTypeSelectorOptions();
    }

    _renderProgress() {
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
        this._renderProgress();
    }

    remove() {
        super.remove();
        this._genomeView.remove();
    }
}

export {
    EggView
}