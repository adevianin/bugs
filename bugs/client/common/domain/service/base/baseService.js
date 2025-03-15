import { ConflictRequestError } from "@common/domain/errors/conflictRequestError";
import { GenericRequestError } from "@common/domain/errors/genericRequestError";
import { UnauthorizedRequestError } from "@common/domain/errors/unauthorizedRequestError";
import { ForbiddenRequestError } from "@common/domain/errors/forbiddenRequestError";

class BaseService {

    async _requestHandler(apiCallFunc) {
        try {
            let result = await apiCallFunc();
            return result.data;
        } catch(error) {
            switch(error.status) {
                case 409:
                    throw new ConflictRequestError(error.data);
                case 403:
                    throw new ForbiddenRequestError(error.data);
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