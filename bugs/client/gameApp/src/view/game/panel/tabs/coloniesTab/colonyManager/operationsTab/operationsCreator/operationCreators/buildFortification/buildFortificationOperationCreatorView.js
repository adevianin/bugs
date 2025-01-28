import { BaseOperationCreatorView } from "../baseOperationCreatorView";
import buildFortificationOperationCreatorTmpl from './buildFortificationOperationCreatorTmpl.html';
import { NestSelectorView } from "@view/game/panel/base/nestSelector";

class BuildFortificationOperationCreatorView extends BaseOperationCreatorView {

    constructor(performingColony, onDone) {
        super(performingColony, onDone);

        this._render();

        this._startBtn.addEventListener('click', this._onStartBtnClick.bind(this));

    }

    remove() {
        this._nestSelector.remove();
        super.remove();
    }

    _render() {
        this._el.innerHTML = buildFortificationOperationCreatorTmpl;

        this._nestSelector = new NestSelectorView(this._performingColony.id);
        this._el.querySelector('[data-nest-selector]').append(this._nestSelector.el);

        this._workersCountInput = this._el.querySelector('[data-workers-count]');

        this._startBtn = this._el.querySelector('[data-start-btn]');
    }

    _onStartBtnClick() {
        let nestId = this._nestSelector.nestId;
        let workersCount = this._workersCountInput.value;
        this.$domainFacade.buildFortificationsOpearation(this._performingColony.id, nestId, workersCount);
        this._onDone();
    }

}

export {
    BuildFortificationOperationCreatorView
}