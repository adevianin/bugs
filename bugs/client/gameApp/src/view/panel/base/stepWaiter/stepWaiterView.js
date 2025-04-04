import { BaseGameHTMLView } from "@view/base/baseGameHTMLView";
import { DotsLoaderView } from "@common/view/dotsLoader/dotsLoaderView";

class StepWaiterView extends BaseGameHTMLView {

    constructor(el) {
        super(el);
    
        this._render();
    }

    waitNextStep() {
        this.waitStep(this.$domain.currentStep + 1);
    }

    waitStep(stepNumber) {
        this._clearWaiting();
        this._loader.toggle(true);
        if (this.$domain.currentStep >= stepNumber) {
            this._onWaited();
        } else {
            this._stopWaitStep = this.$domain.events.on(`stepSyncDone:${stepNumber}`, this._onWaited.bind(this));
        }
    }

    remove() {
        this._clearWaiting();
        super.remove();
        this._loader.remove();
    }

    _render() {
        let div = document.createElement('div');
        this._el.append(div);
        this._loader = new DotsLoaderView(div);
    }

    _onWaited() {
        this._clearWaiting();
        this._loader.toggle(false);
    }

    _clearWaiting() {
        if (this._stopWaitStep) {
            this._stopWaitStep();
            this._stopWaitStep = null;
        }
    }
}

export {
    StepWaiterView
}