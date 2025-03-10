import { StateSyncRequestError } from "@common/domain/errors/stateSyncRequestError";
import { GenericRequestError } from "@common/domain/errors/genericRequestError";

class BaseService {

    async _requestHandler(apiCallFunc) {
        try {
            let result = await apiCallFunc();
            return result.data;
        } catch(error) {
            if (error.status == 409) {
                throw new StateSyncRequestError(error.data);
            }
            throw new GenericRequestError(error.data)
        }
    }

}

export {
    BaseService
}