import { BaseHTMLView } from "@view/base/baseHTMLView";
import { AntStatsView } from "./antStatsView";
import antStatsInlineTmpl from './antStatsInlineTmpl.html';

class AntStatsInlineView extends BaseHTMLView {

    constructor(el, stats) {
        super(el);
        this._stats = stats;
        
        this._render();

        this._closingBtn.addEventListener('click', this._onToggleClosingBtnClick.bind(this));
    }

    toggleDisabling(isDisabled) {
        if (isDisabled) {
            this._toggleClosing(true);
        }
        this._closingBtn.disabled = isDisabled;
    }

    setStats(stats) {
        this._statsView.setStats(stats);
    }

    remove() {
        super.remove();
        this._statsView.remove();
    }

    _render() {
        this._el.innerHTML = antStatsInlineTmpl;

        this._statsEl = this._el.querySelector('[data-stats]');
        this._closingBtn = this._el.querySelector('[data-closing-btn]');

        this._statsView = new AntStatsView(this._stats);
        this._statsEl.appendChild(this._statsView.el);
        
        this._toggleClosing(true);
    }

    _toggleClosing(isClosed) {
        this._statsView.toggle(!isClosed);
        this._closingBtn.innerHTML = isClosed ? '+' : '-';
        this._isClosed = isClosed;
    }

    _onToggleClosingBtnClick() {
        this._toggleClosing(!this._isClosed);
    }
}

export {
    AntStatsInlineView
}