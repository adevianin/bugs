import { CONSTS } from "@domain/consts";

class StepProgressCheker {

    constructor(domainFacade) {
        this._domainFacade = domainFacade;
        this._domainFacade.events.on('stepStart', this._onStepStart.bind(this));
        this._stepStartTime = 0;
        this._estimatedNewStepStartTime = 0;
    }

    getLeftTimeForCurrentStep () {
        return this.getLeftTimeForStep(this._domainFacade.currentStep);
    }

    getLeftTimeForStep(stepNumber) {
        if (this._domainFacade.currentStep == stepNumber) {
            let now = performance.now();
            if (now < this._estimatedNewStepStartTime) {
                return this._estimatedNewStepStartTime - now;
            } else {
                return 0;
            }
        } else if (this._domainFacade.currentStep > stepNumber) {
            return 0;
        } else if (this._domainFacade.currentStep < stepNumber) {
            throw 'cant calc future step';
        }
    }

    _onStepStart() {
        this._stepStartTime = performance.now();
        this._estimatedNewStepStartTime = this._stepStartTime + CONSTS.STEP_TIME * 1000;
    }



}

export {
    StepProgressCheker
}