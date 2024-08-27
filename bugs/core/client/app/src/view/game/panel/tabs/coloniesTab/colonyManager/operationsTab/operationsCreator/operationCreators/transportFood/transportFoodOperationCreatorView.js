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

        this._workersCountInput = this._el.querySelector('[data-workers-count]');
        this._warriorsCountInput = this._el.querySelector('[data-warriors-count]');

        this._startBtn = this._el.querySelector('[data-start-btn]');
    }

    _onStartBtnClick() {
        let performingColonyId = this._performingColony.id;
        let fromNestId = this._nestSelectorFrom.nestId;
        let toNestId = this._nestSelectorTo.nestId;
        let workersCount = this._workersCountInput.value;
        let warriorsCount = this._warriorsCountInput.value;
        this.$domainFacade.transportFoodOperation(performingColonyId, fromNestId, toNestId, workersCount, warriorsCount);
        this._onDone();
    }

}

export {
    TransportFoodOperationCreatorView
}