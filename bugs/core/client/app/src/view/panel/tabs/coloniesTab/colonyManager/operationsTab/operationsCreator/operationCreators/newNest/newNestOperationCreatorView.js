import { BaseOperationCreatorView } from "../baseOperationCreatorView";
import newNestOperationCreatorTmpl from './newNestOperationCreatorTmpl.html';

class NewNestOperationCreatorView extends BaseOperationCreatorView {

    constructor(performingColony, onDone) {
        super(performingColony, onDone);
        this._buildingSite = null;

        this._render();

        this._chooseBuildingSiteBtn.addEventListener('click', this._onChooseBuildingSiteBtnClick.bind(this));
        this._startBtn.addEventListener('click', this._onStartBtnClick.bind(this));
    }

    _render() {
        this._el.innerHTML = newNestOperationCreatorTmpl;

        this._chooseBuildingSiteBtn = this._el.querySelector('[data-choose-nest-position]');
        this._startBtn = this._el.querySelector('[data-start]');
        this._workersCountEl = this._el.querySelector('[data-workers-count]');
        this._buildingSiteEl = this._el.querySelector('[data-building-site]');

        this._renderBuildingSite();
    }

    _renderBuildingSite() {
        if (this._buildingSite) {
            this._buildingSiteEl.innerHTML = `(${this._buildingSite.x};${this._buildingSite.y})`;
        } else {
            this._buildingSiteEl.innerHTML = 'не задано';
        }
    }

    _onChooseBuildingSiteBtnClick() {
        this.$eventBus.emit('placeNewNestMarkerRequest', (point) => { 
            this._buildingSite = point;
            this._renderBuildingSite();
        });
    }

    _onStartBtnClick() {
        if (!this._buildingSite) {
            return
        }
        let workersCount = parseInt(this._workersCountEl.value);
        this.$domainFacade.buildNewSubNestOperation(this._performingColony.id, this._buildingSite, workersCount);
        this._onDone();
    }

}

export { NewNestOperationCreatorView }