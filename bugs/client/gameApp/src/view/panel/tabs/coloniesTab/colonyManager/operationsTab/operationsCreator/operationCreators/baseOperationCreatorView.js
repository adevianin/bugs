import "./style.css";
import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';

class BaseOperationCreatorView extends BaseGameHTMLView {

    constructor(performingColony, onDone) {
        let el = document.createElement('div');
        super(el);
        this._performingColony = performingColony;
        this._onDone = onDone;
    }

    remove() {
        super.remove();
        this._stopListenAnyOperationWaiting();
    }

    _demonstrateMarkersRequest(markers, moveCamera = false) {
        this.$eventBus.emit('showMarkersRequest', markers);
        if (moveCamera && markers.length > 0) {
            this.$eventBus.emit('showPointRequest', markers[0].point);
        }
    }

    _waitAddingOperation(operationId, callback) {
        this._stopListenAnyOperationWaiting();
        if (this._performingColony.hasOperation(operationId)) {
            callback();
        } else {
            this._stopListenOperationAdding = this._performingColony.on(`operationAdded:${operationId}`, () => {
                callback();
            })
        }
    }

    _stopListenAnyOperationWaiting() {
        if (this._stopListenOperationAdding) {
            this._stopListenOperationAdding();
            this._stopListenOperationAdding = null;
        }
    }

}

export {
    BaseOperationCreatorView
}