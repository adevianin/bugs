import './genomeInlineStyles.css';
import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';
import genomeInlineTmpl from './genomeInlineTmpl.html';

class GenomeInlineView extends BaseGameHTMLView {

    constructor(el, genome) {
        super(el);
        this._genome = genome;

        this._render();

        this._analizeBtn.addEventListener('click', this._onAnalizeBtnClick.bind(this));
    }

    setGenome(genome) {
        this._genome = genome;
    }

    _render() {
        this._el.innerHTML = genomeInlineTmpl;

        this._analizeBtn = this._el.querySelector('[data-analize-btn]');
    }

    _onAnalizeBtnClick() {
        this.$eventBus.emit('analizeGenomeRequest', this._genome);
    }

}

export {
    GenomeInlineView
}