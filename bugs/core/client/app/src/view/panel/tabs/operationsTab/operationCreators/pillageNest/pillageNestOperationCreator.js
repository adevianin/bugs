import pillageNestOperationCreatorTmpl from './pillageNestOperationCreatorTmpl.html'
import { OperationCreator } from '../../../coloniesTab/colonyManager/operationsTab/operationsCreator/operationCreators/baseOperationCreatorView';

class PillageNestOperationCreator extends OperationCreator {

    constructor(el, onDone) {
        super(el, onDone);

        this._render();

        this._choosePillagingNestBtnEl.addEventListener('click', this._onChoosePillagingNestBtnClick.bind(this));
        this._chooseUnloadingNestBtnEl.addEventListener('click', this._onChooseUnloadingNestBtnClick.bind(this));
    }

    _render() {
        this._el.innerHTML = pillageNestOperationCreatorTmpl;

        this._choosePillagingNestBtnEl = this._el.querySelector('[data-choose-pillaging-nest-btn]');
        this._chooseUnloadingNestBtnEl = this._el.querySelector('[data-choose-unloading-nest-btn]');
    }

    _onChoosePillagingNestBtnClick() {
        this.$eventBus.emit('placePillageNestMarkerRequest', (pillagingNest) => {
            this._pillagingNest = pillagingNest;
            this._onMarkerPlaced();
        });
    }

    _onChooseUnloadingNestBtnClick() {
        this.$eventBus.emit('placeUnloadingNestMarkerRequest', (unloadingNest) => {
            this._unloadingNest = unloadingNest;
            this._onMarkerPlaced();
        });
    }

    _onMarkerPlaced() {
        if (this._unloadingNest && this._pillagingNest) {
            this.$domainFacade.pillageNestOperation(this._pillagingNest, this._unloadingNest);
            this._onDone();
        }
    }

}

export {
    PillageNestOperationCreator
}