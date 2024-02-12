import './style.css';
import { BaseHTMLView } from "@view/panel/base/baseHTMLView";
import queenManagerTmpl from './queenManagerTmpl.html';
import { MalesSearchView } from './malesSearch';
// import { GenesView } from '@view/panel/base/genes';

class QueenManagerView extends BaseHTMLView {

    constructor(el) {
        super(el);

        this._render();

        this._chooseNestPositionBtn.addEventListener('click', this._onChooseNestPositionBtnClick.bind(this));
        this._startBtn.addEventListener('click', this._onStartBtnClick.bind(this));
    }

    manageQueen(queen) {
        this._queen = queen;
        this._buildingSite = null;

        this._malesSearch.reset();
        // this._queenGenesView.showGenes(this._queen.genes);
        this._renderQueen();
        this._renderBuildingSite();
    }

    _render() {
        this._el.innerHTML = queenManagerTmpl;
        this._malesSearch = new MalesSearchView(this._el.querySelector('[data-males-search]'));
        this._chooseNestPositionBtn = this._el.querySelector('[data-choose-nest-position]');
        this._buildingSiteEl = this._el.querySelector('[data-building-site]');
        // this._queenGenesView = new GenesView(this._el.querySelector('[data-queen-genes]'));
        this._startBtn = this._el.querySelector('[data-start]');
    }

    _renderQueen() {
        this._el.querySelector('[data-queen-name]').innerHTML = this._queen.id;
    }

    _renderBuildingSite() {
        if (this._buildingSite) {
            this._buildingSiteEl.innerHTML = `(${this._buildingSite.x};${this._buildingSite.y})`;
        } else {
            this._buildingSiteEl.innerHTML = 'не задано';
        }
    }

    _onChooseNestPositionBtnClick() {
        this.$eventBus.emit('placeNewNestMarkerRequest', (point) => { 
            this._buildingSite = point;
            this._renderBuildingSite();
        });
    }

    _onStartBtnClick() {
        if (this._malesSearch.selectedMale && this._buildingSite) {
            this.$domainFacade.foundColony(this._queen.id, this._malesSearch.selectedMale.id, this._buildingSite);
        }
    }
}

export {
    QueenManagerView
}