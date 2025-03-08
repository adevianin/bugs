import "./style.css";
import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';

class BaseOperationCreatorView extends BaseGameHTMLView {

    constructor(performingColony, onDone) {
        let el = document.createElement('div');
        super(el);
        this._performingColony = performingColony;
        this._onDone = onDone;
    }

    _demonstrateMarkersRequest(markers) {
        this.$eventBus.emit('showMarkersRequest', markers);
    }

}

export {
    BaseOperationCreatorView
}