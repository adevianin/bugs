import { BaseHTMLView } from "@view/base/baseHTMLView";
import larvaTmpl from './larvaTmpl.html';
import { antTypesLabels } from '@view/labels/antTypesLabels';
import { ClosableGenomeView } from "@view/game/panel/base/genome/closableGenomeView";

class LarvaView extends BaseHTMLView {

    constructor(el, larva) {
        super(el);
        this._larva = larva;

        this._render();

        this._stopListenProgressChange = larva.on('progressChanged', this._onProgressChanged.bind(this));
    }

    _render() {
        this._el.innerHTML = larvaTmpl;

        this._progressEl = this._el.querySelector('[data-progress]');
        this._el.querySelector('[data-ant-type]').innerHTML = antTypesLabels[this._larva.antType];
        this._el.querySelector('[data-name]').innerHTML = this._larva.name;
        this._genomeView = new ClosableGenomeView(this._el.querySelector('[data-genome]'), this._larva.genome);
        this._renderProgress();
    }

    remove() {
        super.remove();
        this._genomeView.remove();
        this._stopListenProgressChange();
    }

    _renderProgress() {
        this._progressEl.innerHTML = `${Math.round(this._larva.ateFood)}/${this._larva.requiredFood}`;
    }

    _onProgressChanged() {
        this._renderProgress();
    }
}

export {
    LarvaView
}