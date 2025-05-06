import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';
import maleProfileTmpl from './maleProfileTmpl.html';
import { GenomeInlineView } from "@view/panel/base/genome/genomeInlineView";
import { AntStatsView } from "@view/panel/base/antStats/antStatsView";

class MaleProfileView extends BaseGameHTMLView {

    constructor(el) {
        super(el);

        this._render();
    }

    _render() {
        this._el.innerHTML = maleProfileTmpl;

        this._statsView = new AntStatsView();
        this._el.querySelector('[data-stats]').appendChild(this._statsView.el);
        this._genomeView = new GenomeInlineView(this._el.querySelector('[data-genome]'));
    }

    showMale(male) {
        this._statsView.setStats(male.stats);
        this._genomeView.setGenome(male.genome);
    }

}

export {
    MaleProfileView
}