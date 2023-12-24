import { BaseOperationCreatorView } from "../baseOperationCreatorView";
import pillageNestOperationCreatorTmpl from './pillageNestOperationCreatorTmpl.html';

class PillageNestOperationCreatorView extends BaseOperationCreatorView {

    constructor(performingColony, onDone) {
        super(performingColony, onDone);
        this._nestToPillage = null;
        this._nestForLoot = null;

        this._render();

        this._chooseNestToPillageBtn.addEventListener('click', this._onChooseNestToPillageBtnClick.bind(this));
        this._chooseNestForLootBtn.addEventListener('click', this._onChooseNestForLootBtnClick.bind(this));
        this._startBtn.addEventListener('click', this._onStartBtnClick.bind(this));
    }

    _render() {
        this._el.innerHTML = pillageNestOperationCreatorTmpl;

        this._chooseNestToPillageBtn = this._el.querySelector('[data-choose-nest-to-pillage]');
        this._nestToPillageEl = this._el.querySelector('[data-nest-to-pillage]');
        this._chooseNestForLootBtn = this._el.querySelector('[data-choose-nest-for-loot]');
        this._nestForLootEl = this._el.querySelector('[data-nest-for-loot]');
        this._warriorsCountEl = this._el.querySelector('[data-warriors-count]');
        this._workersCountEl = this._el.querySelector('[data-workers-count]');
        this._startBtn = this._el.querySelector('[data-start-btn]');

        this._renderNestToPillage();
        this._renderNestForLoot();
    }

    _renderNestToPillage() {
        this._nestToPillageEl.innerHTML = this._nestToPillage ? `(${ this._nestToPillage.id })` : '(не вибрано)';
    }

    _renderNestForLoot() {
        this._nestForLootEl.innerHTML = this._nestForLoot ? `(${ this._nestForLoot.id })` : '(не вибрано)';
    }

    _onChooseNestToPillageBtnClick() {
        this.$eventBus.emit('placePillageNestMarkerRequest', this._performingColony.id, (nestToPillage) => {
            this._nestToPillage = nestToPillage;
            this._renderNestToPillage();
        });
    }

    _onChooseNestForLootBtnClick() {
        this.$eventBus.emit('placeNestForLootMarkerRequest', this._performingColony.id, (nestForLoot) => {
            this._nestForLoot = nestForLoot;
            this._renderNestForLoot();
        });
    }

    _onStartBtnClick() {
        if (!this._nestToPillage || !this._nestForLoot) {
            return
        }

        let warriorsCount = parseInt(this._warriorsCountEl.value);
        let workersCount = parseInt(this._workersCountEl.value);
        this.$domainFacade.pillageNestOperation(this._performingColony.id, this._nestToPillage, this._nestForLoot, warriorsCount, workersCount);
    }

}

export {
    PillageNestOperationCreatorView
}