import { StateSyncRequestError } from "@common/domain/errors/stateSyncRequestError";
import { GenericRequestError } from "@common/domain/errors/genericRequestError";
import { UnauthorizedRequestError } from "@common/domain/errors/unauthorizedRequestError";

class BaseService {

    async _requestHandler(apiCallFunc) {
        try {
            let result = await apiCallFunc();
            return result.data;
        } catch(error) {
            switch(error.status) {
                case 409:
                    throw new StateSyncRequestError(error.data);
                case 401:
                    throw new UnauthorizedRequestError(error.data);
                default:
                    throw new GenericRequestError(error.data)
            }
        }
    }

}

export {
    BaseService
}