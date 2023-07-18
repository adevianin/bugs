import newNestOperationCreatorTmpl from './newNestOperationCreatorTmpl.html';
import { OperationCreator } from '../operationCreator';

class NewNestOperationCreator extends OperationCreator {

    constructor(el, onDone) {
        super(el, onDone);

        this._render();

        this._chooseBuildingSiteBtnEl.addEventListener('click', this._chooseBuildingSiteBtnClick.bind(this));
    }

    _render() {
        this._el.innerHTML = newNestOperationCreatorTmpl;

        this._chooseBuildingSiteBtnEl = this._el.querySelector('[data-choose-building-site-btn]');
    }

    _chooseBuildingSiteBtnClick() {
        this.$eventBus.emit('placeNewNestMarkerRequest', (point) => {
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