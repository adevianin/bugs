import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';
import { GenomeView } from "./genomeView";
import genomeInlineTmpl from './genomeInlineTmpl.html';

class GenomeInlineView extends BaseGameHTMLView {

    constructor(el, genome) {
        super(el);
        this._genome = genome;

        this._render();

        this._closingBtn.addEventListener('click', this._onToggleClosingBtnClick.bind(this));
    }

    toggleDisabling(isDisabled) {
        if (isDisabled) {
            this._toggleClosing(true);
        }
        this._closingBtn.disabled = isDisabled;
    }

    close() {
        this._toggleClosing(true);
    }

    setGenome(genome) {
        this._genomView.setGenome(genome);
    }

    _render() {
        this._el.innerHTML = genomeInlineTmpl;
        this._genomView = new GenomeView(this._el.querySelector('[data-genome]'), this._genome);
        this._closingBtn = this._el.querySelector('[data-closing-btn]');
        this._toggleClosing(true);
    }

    _toggleClosing(isClosed) {
        this._genomView.toggle(!isClosed);
        this._closingBtn.innerHTML = isClosed ? '+' : '-';
        this._isClosed = isClosed;
    }

    _onToggleClosingBtnClick() {
        this._toggleClosing(!this._isClosed);
    }

    remove() {
        super.remove();
        this._genomView.remove();
    }

}

export {
    GenomeInlineView
}