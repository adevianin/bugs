import { BaseHTMLView } from '@view/base/baseHTMLView';
import { GenomeView } from "./genomeView";
import genomeInlineTmpl from './genomeInlineTmpl.html';

class GenomeInlineView extends BaseHTMLView {

    constructor(el, genome) {
        super(el);
        this._genome = genome;

        this._render();

        this._closingBtn.addEventListener('click', this._onToggleClosingBtnClick.bind(this));
    }

    _render() {
        this._el.innerHTML = genomeInlineTmpl;

        this._genomView = new GenomeView(this._el.querySelector('[data-genome]'), this._genome);

        this._previewEl = this._el.querySelector('[data-preview]');
        this._closingBtn = this._el.querySelector('[data-closing-btn]');

        this._toggleClosing(true);
    }

    _toggleClosing(isClosed) {
        this._genomView.toggle(!isClosed);
        console.log(this._genome);
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