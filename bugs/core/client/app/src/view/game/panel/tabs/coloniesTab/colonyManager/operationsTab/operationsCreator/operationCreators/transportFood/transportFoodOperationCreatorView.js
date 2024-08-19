import { BaseOperationCreatorView } from "../baseOperationCreatorView";
import transportFoodOperationCreatorTmpl from './transportFoodOperationCreatorTmpl.html';
import { NestSelectorView } from "@view/game/panel/base/nestSelector";

class TransportFoodOperationCreatorView extends BaseOperationCreatorView {

    constructor(performingColony, onDone) {
        super(performingColony, onDone);

        this._render();

        this._startBtn.addEventListener('click', this._onStartBtnClick.bind(this));

    }

    remove() {
        this._nestSelectorFrom.remove();
        this._nestSelectorTo.remove();
        super.remove();
    }

    _render() {
        this._el.innerHTML = transportFoodOperationCreatorTmpl;

        this._nestSelectorFrom = new NestSelectorView(this._performingColony.id);
        this._el.querySelector('[data-from-nest-selector-container]').append(this._nestSelectorFrom.el);

        this._nestSelectorTo = new NestSelectorView(this._performingColony.id);
        this._el.querySelector('[data-to-nest-selector-container]').append(this._nestSelectorTo.el);

        this._foodCountInput = this._el.querySelector('[data-food-count]');
        this._workersCountInput = this._el.querySelector('[data-workers-count]');

        this._startBtn = this._el.querySelector('[data-start-btn]');

        this._updateFoodCountInput();
    }

    _updateFoodCountInput() {
        let nest = this.$domainFacade.findEntityById(this._nestSelectorFrom.nestId);
        this._foodCountInput.setAttribute('max', nest.storedCalories);
    }

    _onStartBtnClick() {
        let performingColonyId = this._performingColony.id;
        let fromNestId = this._nestSelectorFrom.nestId;
        let toNestId = this._nestSelectorTo.nestId;
        let foodCount = this._foodCountInput.value;
        let workersCount = this._workersCountInput.value;
        this.$domainFacade.transportFoodOperation(performingColonyId, fromNestId, toNestId, foodCount, workersCount);
        this._onDone();
    }

}

export {
    TransportFoodOperationCreatorView
}