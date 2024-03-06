import { BaseHTMLView } from "../baseHTMLView";
import closableGenomeTmpl from './closableGenomeTmpl.html';
import { GenomeView } from "./genomeView";

class ClosableGenomeView extends BaseHTMLView {

    constructor(el, genome) {
        super(el);
        this._genome = genome;

        this._render();

        this._closingBtn.addEventListener('click', this._onToggleClosingBtnClick.bind(this));
    }

    _render() {
        this._el.innerHTML = closableGenomeTmpl;

        this._genomView = new GenomeView(this._el.querySelector('[data-genome]'));
        this._genomView.showGenome(this._genome);

        this._previewEl = this._el.querySelector('[data-preview]');
        this._closingBtn = this._el.querySelector('[data-closing-btn]');

        this._toggleClosing(true);
    }

    _toggleClosing(isClosed) {
        this._genomView.toggle(!isClosed);
        this._previewEl.classList.toggle('hidden', !isClosed);
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
    ClosableGenomeView
}