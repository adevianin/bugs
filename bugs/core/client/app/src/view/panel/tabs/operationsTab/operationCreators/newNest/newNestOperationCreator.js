import newNestOperationCreatorTmpl from './newNestOperationCreatorTmpl.html';
import { OperationCreator } from '../operationCreator';

class NewNestOperationCreator extends OperationCreator {

    constructor(el, onDone) {
        super(el, onDone);

        this._render();

        this._okBtnEl.addEventListener('click', this._onOk.bind(this));
    }

    _render() {
        this._el.innerHTML = newNestOperationCreatorTmpl;

        this._okBtnEl = this._el.querySelector('[data-ok-btn]');
    }

    _onOk() {
        this.$eventBus.emit('placeNewNestMarker', (point) => {
            NewNestOperationCreator.domainFacade.buildNewNest({
                x: point.x,
                y: point.y 
            })
            this._onDone();
        });
    }

}

export {
    NewNestOperationCreator
}