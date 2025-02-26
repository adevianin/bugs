import './style.css';
import { BaseHTMLView } from "@view/base/baseHTMLView";
import nuptialFlightTabTmpl from './nuptialFlightTab.html';
import { QueensListView } from "./queensList"; 
import { QueenManagerView } from "./queenManager";

class NuptialFlightTabView extends BaseHTMLView {

    constructor(el) {
        super(el);

        this._render();
        
        this._queensList.events.on('selectedQueenChanged', this._manageSelectedQueen.bind(this));
        this._bornNewAntaraBtn.addEventListener('click', this._onBornNewAntaraBtnClick.bind(this));
        this.$domainFacade.events.on('entityDied', this._onSomeoneDied.bind(this));
        this.$domainFacade.events.on('entityBorn', this._onSomeoneBorn.bind(this));
    }

    _render() {
        this._el.innerHTML = nuptialFlightTabTmpl;
        this._bornNewAntaraBtn = this._el.querySelector('[data-born-new-antara]');
        this._queensList = new QueensListView(this._el.querySelector('[data-queens-list]'));
        this._queenManager = new QueenManagerView(this._el.querySelector('[data-queen-manager]'));
        if (this._queensList.selectedQueen) {
            this._manageSelectedQueen();
        }

        this._renderBornNewAntaraBtnState();
    }

    _manageSelectedQueen() {
        this._queenManager.manageQueen(this._queensList.selectedQueen);
    }

    _renderBornNewAntaraBtnState() {
        this._bornNewAntaraBtn.classList.toggle('g-hidden', this.$domainFacade.isAnyMyAnt());
    }

    _onSomeoneDied(entity) {
        if (this.$domainFacade.isMyAnt(entity) ) {
            this._renderBornNewAntaraBtnState();
        }
    }

    _onSomeoneBorn(entity) {
        if (this.$domainFacade.isMyAnt(entity) ) {
            this._renderBornNewAntaraBtnState();
        }
    }

    _onBornNewAntaraBtnClick() {
        this.$domainFacade.bornNewAntara();
    }
}

export {
    NuptialFlightTabView
}