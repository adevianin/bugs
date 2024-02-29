import { BaseHTMLView } from "@view/panel/base/baseHTMLView";
import { GenomeView } from "@view/panel/base/genome";
import nuptialMaleProfileTmpl from './nuptialMaleProfileTmpl.html';

class NuptialMaleProfileView extends BaseHTMLView {

    constructor(el) {
        super(el);

        this._render();
    }

    _render() {
        this._el.innerHTML = nuptialMaleProfileTmpl;

        this._genomeView = new GenomeView(this._el.querySelector('[data-genome]'));
    }

    reset() {
        this._genomeView.reset();
    }

    showMale(male) {
        this._genomeView.showGenome(male.genome);
    }
}

export {
    NuptialMaleProfileView
}