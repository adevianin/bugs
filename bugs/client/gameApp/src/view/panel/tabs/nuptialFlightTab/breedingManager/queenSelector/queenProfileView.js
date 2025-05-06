import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';
import queenProfileTmpl from './queenProfileTmpl.html';
import { GenomeInlineView } from "@view/panel/base/genome/genomeInlineView";
import { AntStatsView } from "@view/panel/base/antStats/antStatsView";
import { GAME_MESSAGE_IDS } from '@messages/messageIds';

class QueenProfileView extends BaseGameHTMLView {
    
    constructor(el) {
        super(el);

        this._render();
    }

    showQueen(queen) {
        this._queen = queen;
        this._queenStatsView.setStats(queen.stats);
        this._queenGenomeView.setGenome(queen.genome);
        this._nameEl.innerHTML = queen.name;
    }

    _render() {
        this._el.innerHTML = queenProfileTmpl;

        this._queenStatsEl = this._el.querySelector('[data-queen-stats]');
        this._queenGenomeEl = this._el.querySelector('[data-queen-genome]');
        this._nameEl = this._el.querySelector('[data-name]');

        this._el.querySelector('[data-queen-profile-label-genome]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.QUEEN_PROFILE_LABEL_GENOME);

        this._queenStatsView = new AntStatsView();
        this._queenStatsEl.appendChild(this._queenStatsView.el);
        this._queenGenomeView = new GenomeInlineView(this._queenGenomeEl);
    }

}

export {
    QueenProfileView
}