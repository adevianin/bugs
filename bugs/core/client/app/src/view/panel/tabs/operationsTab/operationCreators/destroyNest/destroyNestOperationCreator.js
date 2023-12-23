import destroyNestOperationCreatorTmpl from './destoryNestOperationCreatorTmpl.html'
import { OperationCreator } from '../../../coloniesTab/colonyManager/operationsTab/operationsCreator/operationCreators/baseOperationCreatorView';

class DestroyNestOperationCreator extends OperationCreator {

    constructor(el, onDone) {
        super(el, onDone);

        this._render();

        this._chooseNestBtnEl.addEventListener('click', this._onChooseNestBtnClick.bind(this));
    }

    _render() {
        this._el.innerHTML = destroyNestOperationCreatorTmpl;

        this._chooseNestBtnEl = this._el.querySelector('[data-choose-nest-btn]');
    }

    _onChooseNestBtnClick() {
        this.$eventBus.emit('placeDestroyNestMarkerRequest', (nest) => {
            this.$domainFacade.destroyNestOperation(nest);
            this._onDone();
        });
    }

}

export {
    DestroyNestOperationCreator
}