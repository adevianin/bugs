import { BaseOperationCreatorView } from "../baseOperationCreatorView";
import bringBugOperationCreatorTmpl from './bringBugOperationCreatorTmpl.html';
import { NestSelectorView } from "@view/game/panel/base/nestSelector";

class BringBugOperationCreatorView extends BaseOperationCreatorView {

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
        this._el.innerHTML = bringBugOperationCreatorTmpl;

        this._nestSelector = new NestSelectorView(this._performingColony.id);
        this._el.querySelector('[data-nest-selector]').append(this._nestSelector.el);

        this._startBtn = this._el.querySelector('[data-start-btn]');
    }

    _onStartBtnClick() {
        let nestId = this._nestSelector.nestId;
        this.$domainFacade.bringBugOpearation(this._performingColony.id, nestId);
        this._onDone();
    }

}

export {
    BringBugOperationCreatorView
}