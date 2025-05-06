import './styles.css';
import genomeAnalizerTmpl from './genomeAnalizerTmpl.html';
import { BaseGameHTMLView } from "@view/base/baseGameHTMLView";
import { GenomeView } from '@view/panel/base/genome';

class GenomeAnalizerView extends BaseGameHTMLView {

    constructor(el) {
        super(el);

        this._render();

        this._closeBtn.addEventListener('click', this._onCloseBtnClick.bind(this));
        this.$eventBus.on('analizeGenomeRequest', this._onAnalizeGenomeRequest.bind(this));
    }

    _render() {
        this._el.innerHTML = genomeAnalizerTmpl;
        this._el.classList.add('genome-analizer-container');

        this._genomeView = new GenomeView(this._el.querySelector('[data-genome]'));

        this._closeBtn = this._el.querySelector('[data-close-btn]');
        this.toggle(false);
    }

    _onAnalizeGenomeRequest(genome) {
        this._genomeView.setGenome(genome);
        this.toggle(true);
    }

    _onCloseBtnClick() {
        this.toggle(false);
    }

}

export {
    GenomeAnalizerView
}