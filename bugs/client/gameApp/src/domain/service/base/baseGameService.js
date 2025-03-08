import { GenericRequestError } from "@domain/errors/genericRequestError";
import { StateSyncRequestError } from "@domain/errors/stateSyncRequestError";

class BaseGameService {

    constructor(mainEventBus, world) {
        this._mainEventBus = mainEventBus;
        this._world = world;
    }

    async _requestHandler(apiCallFunc) {
        try {
            let result = await apiCallFunc();
            return result.data;
        } catch(error) {
            if (error.status == 409) {
                await this._waitStepSync(error.data.step);
                throw new StateSyncRequestError(error.data);
            }
            throw new GenericRequestError(error.data)
        }
    }

    async _waitStepSync(stepNumber) {
        return new Promise((res, rej) => {
            if (this._world.currentStep > stepNumber) {
                res();
            } else {
                this._mainEventBus.once(`stepSyncDone:${stepNumber}`, () => {
                    res();
                });
            }
        });
    }

}

export {
    BaseGameService
}