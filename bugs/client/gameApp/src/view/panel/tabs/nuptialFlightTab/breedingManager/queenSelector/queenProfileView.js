import { BaseHTMLView } from "@view/base/baseHTMLView";
import queenProfileTmpl from './queenProfileTmpl.html';
import { GenomeInlineView } from "@view/panel/base/genome/genomeInlineView";
import { AntStatsView } from "@view/panel/base/antStats/antStatsView";

class QueenProfileView extends BaseHTMLView {
    
    constructor(el) {
        super(el);

        this._render();

        this.$domainFacade.events.on('entityDied', this._onSomeoneDied.bind(this));
    }

    showQueen(queen) {
        this._queen = queen;
        this._queenStatsView.setStats(queen.stats);
        this._queenGenomeView.setGenome(queen.genome);
        this._nameEl.innerHTML = queen.name;
        this._renderIsDied();
    }

    _render() {
        this._el.innerHTML = queenProfileTmpl;

        this._queenStatsEl = this._el.querySelector('[data-queen-stats]');
        this._queenGenomeEl = this._el.querySelector('[data-queen-genome]');
        this._nameEl = this._el.querySelector('[data-name]');
        this._isDiedMarkerEl = this._el.querySelector('[data-is-died-marker]');

        this._queenStatsView = new AntStatsView();
        this._queenStatsEl.appendChild(this._queenStatsView.el);
        this._queenGenomeView = new GenomeInlineView(this._queenGenomeEl);
    }

    _renderIsDied() {
        this._isDiedMarkerEl.classList.toggle('g-hidden', !this._queen.isDied);
    }

    _onSomeoneDied(someone) {
        if (this._queen && someone.id == this._queen.id) {
            this._renderIsDied();
        }
    }

}

export {
    QueenProfileView
}