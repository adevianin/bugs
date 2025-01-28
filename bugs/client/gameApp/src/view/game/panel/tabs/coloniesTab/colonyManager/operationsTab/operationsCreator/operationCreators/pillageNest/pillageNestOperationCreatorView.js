import { BaseOperationCreatorView } from "../baseOperationCreatorView";
import pillageNestOperationCreatorTmpl from './pillageNestOperationCreatorTmpl.html';
import { NestSelectorView } from "@view/game/panel/base/nestSelector";

class PillageNestOperationCreatorView extends BaseOperationCreatorView {

    constructor(performingColony, onDone) {
        super(performingColony, onDone);
        this._nestToPillage = null;
        this._nestForLoot = null;

        this._render();

        this._chooseNestToPillageBtn.addEventListener('click', this._onChooseNestToPillageBtnClick.bind(this));
        this._startBtn.addEventListener('click', this._onStartBtnClick.bind(this));
    }

    remove() {
        this._nestForLootSelector.remove();
        super.remove();
    }

    _render() {
        this._el.innerHTML = pillageNestOperationCreatorTmpl;

        this._chooseNestToPillageBtn = this._el.querySelector('[data-choose-nest-to-pillage]');
        this._nestToPillageEl = this._el.querySelector('[data-nest-to-pillage]');
        this._warriorsCountEl = this._el.querySelector('[data-warriors-count]');
        this._workersCountEl = this._el.querySelector('[data-workers-count]');
        this._startBtn = this._el.querySelector('[data-start-btn]');

        this._nestForLootSelector = new NestSelectorView(this._performingColony.id)
        this._el.querySelector('[data-nest-selector-container]').append(this._nestForLootSelector.el);

        this._renderNestToPillage();
    }

    _renderNestToPillage() {
        this._nestToPillageEl.innerHTML = this._nestToPillage ? `(${ this._nestToPillage.id })` : '(не вибрано)';
    }

    _onChooseNestToPillageBtnClick() {
        this.$eventBus.emit('nestPickRequest', this._performingColony.id, (nestToPillage) => {
            this._nestToPillage = nestToPillage;
            this._renderNestToPillage();
        });
    }

    _onStartBtnClick() {
        if (!this._nestToPillage) {
            return
        }

        let warriorsCount = parseInt(this._warriorsCountEl.value);
        let workersCount = parseInt(this._workersCountEl.value);
        let nestForLootId = this._nestForLootSelector.nestId;
        this.$domainFacade.pillageNestOperation(this._performingColony.id, this._nestToPillage.id, nestForLootId, warriorsCount, workersCount);
    }

}

export {
    PillageNestOperationCreatorView
}