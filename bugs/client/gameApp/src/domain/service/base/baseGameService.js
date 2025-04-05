import { ConflictRequestError } from "@common/domain/errors/conflictRequestError";
import { BaseService } from "@common/domain/service/base/baseService";

class BaseGameService extends BaseService {

    constructor(mainEventBus, world) {
        super();
        this._mainEventBus = mainEventBus;
        this._world = world;
    }

    async _requestHandler(apiCallFunc) {
        try {
            return await super._requestHandler(apiCallFunc);
        } catch (e) {
            if (e instanceof ConflictRequestError) {
                await this._waitStepSync(e.data.step);
                throw e;
            } else {
                throw e;
            }
        }
    }

    async _waitStepSync(stepNumber) {
        console.log('waiting step', stepNumber, 'current', this._world.currentStep);
        return new Promise((res, rej) => {
            if (this._world.currentStep >= stepNumber) {
                res();
            } else {
                let stopListen = this._mainEventBus.on(`stepSyncDone:${stepNumber}`, () => {
                    stopListen();
                    res();
                });
            }
        });
    }

}

export {
    BaseGameService
}