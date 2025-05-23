import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';
import genomeInlineTmpl from './genomeInlineTmpl.html';
import { GAME_MESSAGE_IDS } from '@messages/messageIds';

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
        this._analizeBtn.innerHTML = this.$mm.get(GAME_MESSAGE_IDS.GENOME_LABEL_ANALIZE_GENOME);
    }

    _onAnalizeBtnClick() {
        this.$eventBus.emit('analizeGenomeRequest', this._genome);
    }

}

export {
    GenomeInlineView
}