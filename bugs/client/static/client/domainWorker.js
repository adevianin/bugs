/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./common/domain/errors/conflictRequestError.js":
/*!******************************************************!*\
  !*** ./common/domain/errors/conflictRequestError.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ConflictRequestError: () => (/* binding */ ConflictRequestError)
/* harmony export */ });
/* harmony import */ var _genericRequestError__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./genericRequestError */ "./common/domain/errors/genericRequestError.js");


class ConflictRequestError extends _genericRequestError__WEBPACK_IMPORTED_MODULE_0__.GenericRequestError {

}



/***/ }),

/***/ "./common/domain/errors/forbiddenRequestError.js":
/*!*******************************************************!*\
  !*** ./common/domain/errors/forbiddenRequestError.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ForbiddenRequestError: () => (/* binding */ ForbiddenRequestError)
/* harmony export */ });
/* harmony import */ var _genericRequestError__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./genericRequestError */ "./common/domain/errors/genericRequestError.js");


class ForbiddenRequestError extends _genericRequestError__WEBPACK_IMPORTED_MODULE_0__.GenericRequestError {

}



/***/ }),

/***/ "./common/domain/errors/genericRequestError.js":
/*!*****************************************************!*\
  !*** ./common/domain/errors/genericRequestError.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GenericRequestError: () => (/* binding */ GenericRequestError)
/* harmony export */ });
class GenericRequestError extends Error {

    constructor(data) {
        super();
        this.data = data;
    }

}



/***/ }),

/***/ "./common/domain/errors/unauthorizedRequestError.js":
/*!**********************************************************!*\
  !*** ./common/domain/errors/unauthorizedRequestError.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   UnauthorizedRequestError: () => (/* binding */ UnauthorizedRequestError)
/* harmony export */ });
/* harmony import */ var _genericRequestError__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./genericRequestError */ "./common/domain/errors/genericRequestError.js");


class UnauthorizedRequestError extends _genericRequestError__WEBPACK_IMPORTED_MODULE_0__.GenericRequestError {

}



/***/ }),

/***/ "./common/domain/service/accountService.js":
/*!*************************************************!*\
  !*** ./common/domain/service/accountService.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AccountService: () => (/* binding */ AccountService)
/* harmony export */ });
/* harmony import */ var _common_messages_messageIds__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @common/messages/messageIds */ "./common/messages/messageIds.js");
/* harmony import */ var _base_baseService__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./base/baseService */ "./common/domain/service/base/baseService.js");
/* harmony import */ var _errors_unauthorizedRequestError__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../errors/unauthorizedRequestError */ "./common/domain/errors/unauthorizedRequestError.js");
/* harmony import */ var _errors_conflictRequestError__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../errors/conflictRequestError */ "./common/domain/errors/conflictRequestError.js");
/* harmony import */ var _errors_forbiddenRequestError__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../errors/forbiddenRequestError */ "./common/domain/errors/forbiddenRequestError.js");






class AccountService extends _base_baseService__WEBPACK_IMPORTED_MODULE_1__.BaseService {

    static MIN_USERNAME_LENGTH = 4;
    static MAX_USERNAME_LENGTH = 50;
    static USERNAME_REGEX = /^[a-zA-Z0-9_-]+$/;
    static MIN_PASSWORD_LENGTH = 6;
    static MAX_PASSWORD_LENGTH = 100;
    static EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    static MIN_EMAIL_LENGTH = 4;
    static MAX_EMAIL_LENGTH = 254;

    static USERNAME_MIN_LENGTH_ERR = Object.freeze({
        msgId: _common_messages_messageIds__WEBPACK_IMPORTED_MODULE_0__.COMMON_MESSAGE_IDS.USERNAME_MIN_LENGTH_ERR,
        minLength: AccountService.MIN_USERNAME_LENGTH
    });
    static USERNAME_MAX_LENGTH_ERR = Object.freeze({
        msgId: _common_messages_messageIds__WEBPACK_IMPORTED_MODULE_0__.COMMON_MESSAGE_IDS.USERNAME_MAX_LENGTH_ERR,
        maxLength: AccountService.MAX_USERNAME_LENGTH
    });
    static USERNAME_INVALID_CHARS_ERR = Object.freeze({
        msgId: _common_messages_messageIds__WEBPACK_IMPORTED_MODULE_0__.COMMON_MESSAGE_IDS.USERNAME_INVALID_CHARS
    });
    static USERNAME_TAKEN_ERR = Object.freeze({
        msgId: _common_messages_messageIds__WEBPACK_IMPORTED_MODULE_0__.COMMON_MESSAGE_IDS.USERNAME_TAKEN
    });
    
    constructor(accountApi) {
        super();
        this._accountApi = accountApi;
    }

    login(email, password) {
        return this._requestHandler(() => this._accountApi.login(email, password));
    }

    logout() {
        return this._accountApi.logout();
    }

    async register(username, email, password) {
        return this._requestHandler(() => this._accountApi.register(username, email, password));
    }

    async resetPasswordRequest(email) {
        try {
            await this._requestHandler(() => this._accountApi.resetPasswordRequest(email));
            return null;
        } catch (e) {
            return _common_messages_messageIds__WEBPACK_IMPORTED_MODULE_0__.COMMON_MESSAGE_IDS.SOMETHING_WENT_WRONG;
        }
    }

    async setNewPassword(newPassword, token, id) {
        try {
            await this._requestHandler(() => this._accountApi.setNewPassword(newPassword, token, id));
            return null;
        } catch (e) {
            if (e instanceof _errors_forbiddenRequestError__WEBPACK_IMPORTED_MODULE_4__.ForbiddenRequestError) {
                return _common_messages_messageIds__WEBPACK_IMPORTED_MODULE_0__.COMMON_MESSAGE_IDS.RESET_PASSWORD_LINK_EXPIRED;
            } else {
                return _common_messages_messageIds__WEBPACK_IMPORTED_MODULE_0__.COMMON_MESSAGE_IDS.SOMETHING_WENT_WRONG;
            }
        }
    }

    async changeUsername(newUsername) {
        let usernameErr = await this.validateUsername(newUsername, false);
        if (usernameErr) {
            return { success: false, err: usernameErr };
        }

        try {
            let data = await this._requestHandler(() => this._accountApi.changeUsername(newUsername));
            return { success: true, userData: data.user };
        } catch (e) {
            if (e instanceof _errors_conflictRequestError__WEBPACK_IMPORTED_MODULE_3__.ConflictRequestError) {
                return { success: false, err: AccountService.USERNAME_TAKEN_ERR };
            } else {
                return { success: false, err: { msgId: _common_messages_messageIds__WEBPACK_IMPORTED_MODULE_0__.COMMON_MESSAGE_IDS.SOMETHING_WENT_WRONG } };
            }
        }
    }

    async changeEmail(newEmail, password) {
        if (!password) {
            return { success: false, err: _common_messages_messageIds__WEBPACK_IMPORTED_MODULE_0__.COMMON_MESSAGE_IDS.PASSWORD_NEEDED };
        }

        let emailErr = await this.validateEmail(newEmail, false);
        if (emailErr) {
            return { success: false, err: emailErr };
        }

        try {
            let data = await this._requestHandler(() => this._accountApi.changeEmail(newEmail, password));
            return { success: true, userData: data.user };
        } catch (e) {
            if (e instanceof _errors_unauthorizedRequestError__WEBPACK_IMPORTED_MODULE_2__.UnauthorizedRequestError) {
                return { success: false, err: _common_messages_messageIds__WEBPACK_IMPORTED_MODULE_0__.COMMON_MESSAGE_IDS.PASSWORD_IS_NOT_VALID_EMAIL_NOT_CHANGED };
            } else if (e instanceof _errors_conflictRequestError__WEBPACK_IMPORTED_MODULE_3__.ConflictRequestError) {
                return { success: false, err: _common_messages_messageIds__WEBPACK_IMPORTED_MODULE_0__.COMMON_MESSAGE_IDS.EMAIL_TAKEN };
            } else {
                return { success: false, err: _common_messages_messageIds__WEBPACK_IMPORTED_MODULE_0__.COMMON_MESSAGE_IDS.SOMETHING_WENT_WRONG };
            }
        }
    }

    async changePassword(newPassword, oldPassword) {
        try {
            await this._requestHandler(() => this._accountApi.changePassword(newPassword, oldPassword));
            return null;
        } catch (e) {
            if (e instanceof _errors_unauthorizedRequestError__WEBPACK_IMPORTED_MODULE_2__.UnauthorizedRequestError) {
                return _common_messages_messageIds__WEBPACK_IMPORTED_MODULE_0__.COMMON_MESSAGE_IDS.OLD_PASSWORD_IS_NOT_VALID_PASSWORD_NOT_CHANGED;
            } else {
                return _common_messages_messageIds__WEBPACK_IMPORTED_MODULE_0__.COMMON_MESSAGE_IDS.SOMETHING_WENT_WRONG;
            }
        }
    }

    verifyEmailRequest() {
        this._requestHandler(() => this._accountApi.verifyEmailRequest());
    }

    async validateUsername(username = '', checkUniq = true) {
        if (username.length < AccountService.MIN_USERNAME_LENGTH) {
            return AccountService.USERNAME_MIN_LENGTH_ERR;
        }

        if (username.length > AccountService.MAX_USERNAME_LENGTH) {
            return AccountService.USERNAME_MAX_LENGTH_ERR;
        }

        if (!AccountService.USERNAME_REGEX.test(username)) {
            return AccountService.USERNAME_INVALID_CHARS_ERR;
        }

        if (checkUniq) {
            let isUniq = await this._accountApi.checkUsernameUniqueness(username);
            if (!isUniq) {
                return AccountService.USERNAME_TAKEN_ERR;
            }
        }

        return null;
    }

    validatePassword(password = '') {
        if (password.length < AccountService.MIN_PASSWORD_LENGTH) {
            return {
                msgId: _common_messages_messageIds__WEBPACK_IMPORTED_MODULE_0__.COMMON_MESSAGE_IDS.PASSWORD_MIN_LENGTH_ERR,
                minLength: AccountService.MIN_PASSWORD_LENGTH
            }
        }

        if (password.length > AccountService.MAX_PASSWORD_LENGTH) {
            return {
                msgId: _common_messages_messageIds__WEBPACK_IMPORTED_MODULE_0__.COMMON_MESSAGE_IDS.PASSWORD_MAX_LENGTH_ERR,
                maxLength: AccountService.MAX_PASSWORD_LENGTH
            }
        }

        return null;
    }

    async validateEmail(email = '', checkUniq = true) {
        if (email.length < AccountService.MIN_EMAIL_LENGTH ||
            email.length > AccountService.MAX_EMAIL_LENGTH ||
            !AccountService.EMAIL_REGEX.test(email)
        ) {
            return _common_messages_messageIds__WEBPACK_IMPORTED_MODULE_0__.COMMON_MESSAGE_IDS.EMAIL_INVALID;
        }

        if (checkUniq) {
            let isUniq = await this._accountApi.checkEmailUniqueness(email);
            if (!isUniq) {
                return _common_messages_messageIds__WEBPACK_IMPORTED_MODULE_0__.COMMON_MESSAGE_IDS.EMAIL_TAKEN;
            }
        }

        return null;
    }

}



/***/ }),

/***/ "./common/domain/service/base/baseService.js":
/*!***************************************************!*\
  !*** ./common/domain/service/base/baseService.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BaseService: () => (/* binding */ BaseService)
/* harmony export */ });
/* harmony import */ var _common_domain_errors_conflictRequestError__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @common/domain/errors/conflictRequestError */ "./common/domain/errors/conflictRequestError.js");
/* harmony import */ var _common_domain_errors_genericRequestError__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @common/domain/errors/genericRequestError */ "./common/domain/errors/genericRequestError.js");
/* harmony import */ var _common_domain_errors_unauthorizedRequestError__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @common/domain/errors/unauthorizedRequestError */ "./common/domain/errors/unauthorizedRequestError.js");
/* harmony import */ var _common_domain_errors_forbiddenRequestError__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @common/domain/errors/forbiddenRequestError */ "./common/domain/errors/forbiddenRequestError.js");





class BaseService {

    async _requestHandler(apiCallFunc) {
        try {
            let result = await apiCallFunc();
            return result.data;
        } catch(error) {
            switch(error.status) {
                case 409:
                    throw new _common_domain_errors_conflictRequestError__WEBPACK_IMPORTED_MODULE_0__.ConflictRequestError(error.data);
                case 403:
                    throw new _common_domain_errors_forbiddenRequestError__WEBPACK_IMPORTED_MODULE_3__.ForbiddenRequestError(error.data);
                case 401:
                    throw new _common_domain_errors_unauthorizedRequestError__WEBPACK_IMPORTED_MODULE_2__.UnauthorizedRequestError(error.data);
                default:
                    throw new _common_domain_errors_genericRequestError__WEBPACK_IMPORTED_MODULE_1__.GenericRequestError(error.data)
            }
        }
    }

}



/***/ }),

/***/ "./common/messages/messageIds.js":
/*!***************************************!*\
  !*** ./common/messages/messageIds.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   COMMON_MESSAGE_IDS: () => (/* binding */ COMMON_MESSAGE_IDS)
/* harmony export */ });
const COMMON_MESSAGE_IDS = {
    USERNAME_MIN_LENGTH_ERR: 'USERNAME_MIN_LENGTH_ERR',
    USERNAME_MAX_LENGTH_ERR: 'USERNAME_MAX_LENGTH_ERR',
    USERNAME_INVALID_CHARS: 'USERNAME_INVALID_CHARS',
    USERNAME_TAKEN: 'USERNAME_TAKEN',
    USERNAME_NEEDED: 'USERNAME_NEEDED',
    EMAIL_INVALID: 'EMAIL_INVALID',
    EMAIL_TAKEN: 'EMAIL_TAKEN',
    EMAIL_NEEDED: 'EMAIL_NEEDED',
    PASSWORD_MIN_LENGTH_ERR: 'PASSWORD_MIN_LENGTH_ERR',
    PASSWORD_MAX_LENGTH_ERR: 'PASSWORD_MAX_LENGTH_ERR',
    PASSWORD_CONFIRMATION_IS_NOT_VALID: 'PASSWORD_CONFIRMATION_IS_NOT_VALID',
    PASSWORD_NEEDED: 'PASSWORD_NEEDED',
    NOT_VALID_PASSWORD_OR_EMAIL: 'NOT_VALID_PASSWORD_OR_EMAIL',
    PASSWORD_IS_NOT_VALID_EMAIL_NOT_CHANGED: 'PASSWORD_IS_NOT_VALID_EMAIL_NOT_CHANGED',
    OLD_PASSWORD_IS_NOT_VALID_PASSWORD_NOT_CHANGED: 'OLD_PASSWORD_IS_NOT_VALID_PASSWORD_NOT_CHANGED',
    RESET_PASSWORD_LINK_EXPIRED: 'RESET_PASSWORD_LINK_EXPIRED',
    SOMETHING_WENT_WRONG: 'SOMETHING_WENT_WRONG',
}



/***/ }),

/***/ "./common/sync/accountApi.js":
/*!***********************************!*\
  !*** ./common/sync/accountApi.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AccountApi: () => (/* binding */ AccountApi)
/* harmony export */ });
class AccountApi {
    
    constructor(requester) {
        this._requester = requester;
    }

    login(email, password) {
        return this._requester.post('api/accounts/login', {
            email, password
        });
    }

    logout() {
        return this._requester.post('/api/accounts/logout').then(res => {
            return res.data.redirectUrl;
        });
    }

    register(username, email, password) {
        return this._requester.post('api/accounts/register', {
            username, email, password
        });
    }

    resetPasswordRequest(email) {
        return this._requester.post('api/accounts/reset_password_request', {
            email
        });
    }

    setNewPassword(newPassword, token, id) {
        return this._requester.post('api/accounts/set_new_password', {
            newPassword, token, id
        });
    }

    changeUsername(newUsername) {
        return this._requester.post('/api/accounts/change_username', {
            newUsername
        });
    }

    changeEmail(newEmail, password) {
        return this._requester.post('/api/accounts/change_email', {
            newEmail, password
        });
    }

    changePassword(newPassword, oldPassword) {
        return this._requester.post('/api/accounts/change_password', {
            newPassword, oldPassword
        });
    }

    verifyEmailRequest() {
        return this._requester.post('/api/accounts/verify_email_request');
    }

    checkUsernameUniqueness(username) {
        return this._requester.post('api/accounts/check_username_uniqueness', {
            username
        }).then(res => {
            return res.data.is_unique;
        });
    }

    checkEmailUniqueness(email) {
        return this._requester.post('api/accounts/check_email_uniqueness', {
            email
        }).then(res => {
            return res.data.is_unique;
        });
    }

}



/***/ }),

/***/ "./common/utils/eventEmitter.js":
/*!**************************************!*\
  !*** ./common/utils/eventEmitter.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EventEmitter: () => (/* binding */ EventEmitter)
/* harmony export */ });
/* harmony import */ var nanoevents__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! nanoevents */ "./node_modules/nanoevents/index.js");


class EventEmitter {
    constructor() {
        this._emitter = (0,nanoevents__WEBPACK_IMPORTED_MODULE_0__.createNanoEvents)();
    }

    on(eventName, callback) {
        return this._emitter.on(eventName, callback);
    }

    once(eventName, callback) {
        let stopListen = this._emitter.on(eventName, (...args) => {
            stopListen();
            callback(...args);
        });
    }

    emit(eventName, ...args) {
        this._emitter.emit(eventName, ...args);
    }

    removeAllListeners() {
        this._emitter.events = {};
    }

}



/***/ }),

/***/ "./common/utils/getCookie.js":
/*!***********************************!*\
  !*** ./common/utils/getCookie.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getCookie: () => (/* binding */ getCookie)
/* harmony export */ });
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}



/***/ }),

/***/ "./common/utils/requester.js":
/*!***********************************!*\
  !*** ./common/utils/requester.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Requester: () => (/* binding */ Requester)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! axios */ "./node_modules/axios/lib/axios.js");
/* harmony import */ var _common_utils_getCookie__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @common/utils/getCookie */ "./common/utils/getCookie.js");



class Requester {

    setCsrfToken(token) {
        this._csrftoken = token;
    }

    post(url, params) {
        return new Promise((res, rej) => {
            axios__WEBPACK_IMPORTED_MODULE_1__["default"].post(url, params, { headers: {
                'Content-type': 'application/json',
                'X-CSRFToken': this._readCsrfToken()
            }})
            .then(axiosResponse => {res(this._buildResultFromAxiosResponse(axiosResponse))})
            .catch(axiosError => {rej(this._buildResultFromAxiosError(axiosError))})
        });
    }

    get(url, params) {
        return new Promise((res, rej) => {
            axios__WEBPACK_IMPORTED_MODULE_1__["default"].get(url, params, { headers: {
                'Content-type': 'application/json',
                'X-CSRFToken': this._readCsrfToken()
            }})
            .then(axiosResponse => {res(this._buildResultFromAxiosResponse(axiosResponse))})
            .catch(axiosError => {rej(this._buildResultFromAxiosError(axiosError))})
        }) 
    }

    _readCsrfToken() {
        return this._csrftoken || (0,_common_utils_getCookie__WEBPACK_IMPORTED_MODULE_0__.getCookie)('csrftoken');
    }

    _buildResultFromAxiosResponse(axiosResponse) {
        return {
            status: axiosResponse.status,
            data: axiosResponse.data
        }
    }

    _buildResultFromAxiosError(axiosError) {
        return {
            status: axiosError.response ? axiosError.response.status : null,
            data: axiosError.response ? axiosError.response.data : null
        }
    }
}



/***/ }),

/***/ "./gameApp/src/domain/consts.js":
/*!**************************************!*\
  !*** ./gameApp/src/domain/consts.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CONSTS: () => (/* binding */ CONSTS),
/* harmony export */   initConsts: () => (/* binding */ initConsts)
/* harmony export */ });
const CONSTS = {
    NEW_EGG_FOOD_COST: null,
    STEPS_IN_YEAR: null,
    SPRING_START_YEAR_STEP: null,
    SUMMER_START_YEAR_STEP: null,
    AUTUMN_START_YEAR_STEP: null,
    WINTER_START_YEAR_STEP: null,
    LAY_EGG_SEASONS: null,
    NUPTIAL_FLIGHT_SEASONS: null,
    MAX_DISTANCE_TO_SUB_NEST: null,
    MAX_SUB_NEST_COUNT: null,
    REQUIRED_GENES: null,
    MAX_DISTANCE_TO_OPERATION_TARGET: null,
    BUILD_NEW_SUB_NEST_OPERATION_REQUIREMENTS: null,
    DESTROY_NEST_OPERATION_REQUIREMENTS: null,
    PILLAGE_NEST_OPERATION_REQUIREMENTS: null,
    TRANSPORT_FOOD_OPERATION_REQUIREMENTS: null,
    BUILD_FORTIFICATION_OPERATION_REQUIREMENTS: null,
    ITEM_SOURCE_BLOCKING_RADIUS: null,
    NEST_BLOCKING_RADIUS: null,
    MAP_CHUNK_SIZE: null,
    VIEW_CHUNK_SIZE: null,
    MAX_NAME_LENGTH: null,
    MIN_NAME_LENGTH: null,
    NEST_AREA: null,
    STEP_TIME: null
}

function initConsts(constsValues) {
    Object.assign(CONSTS, constsValues)
}



/***/ }),

/***/ "./gameApp/src/domain/entity/action/actionTypes.js":
/*!*********************************************************!*\
  !*** ./gameApp/src/domain/entity/action/actionTypes.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ACTION_TYPES: () => (/* binding */ ACTION_TYPES)
/* harmony export */ });
const ACTION_TYPES = {
    ANT_PICKED_UP_ITEM: 'ant_picked_up_item',
    ANT_DROPPED_PICKED_ITEM: 'ant_dropped_picked_item',
    ANT_FLEW_NUPTIAL_FLIGHT: 'ant_flew_nuptial_flight',
    ANT_FLEW_NUPTIAL_FLIGHT_BACK: 'ant_flew_nuptial_flight_back',
    ANT_GOT_FERTILIZED: 'ant_got_fertilized',
    ANT_HOME_NEST_CHANGED: 'ant_home_nest_changed',
    ANT_CURRENT_ACTIVITY_CHANGED: 'ant_current_activity_changed',
    ANT_HUNGRY_STATE_CHANGED: 'ant_hungry_state_changed',
    ENTITY_DIED: 'entity_died',
    ENTITY_BORN: 'entity_born',
    ENTITY_WALK: 'entity_walk',
    ENTITY_GOT_IN_NEST: 'entity_got_in_nest',
    ENTITY_GOT_OUT_OF_NEST: 'entity_got_out_of_nest',
    ENTITY_HIBERNATION_STATUS_CHANGED: 'entity_hibernation_status_changed',
    ENTITY_HP_CHANGE: 'entity_hp_change',
    ENTITY_ROTATED: 'entity_rotated',
    ENTITY_COLONY_CHANGED: 'entity_colony_changed',
    ITEM_WAS_PICKED_UP: 'item_was_picked_up',
    ITEM_WAS_DROPPED: 'item_was_dropped',
    ITEM_BEING_BRINGED: 'item_being_bringed',
    ITEM_BRINGING_STATE_CHANGED: 'item_bringing_state_changed',
    ITEM_SOURCE_IS_DAMAGED_CHANGED: 'item_source_is_damaged_changed',
    ITEM_SOURCE_ACCUMULATED_CHANGED: 'item_source_accumulated_changed',
    NEST_STORED_CALORIES_CHANGED: 'nest_stored_calories_changed',
    NEST_LARVA_FED: 'nest_larva_fed',
    NEST_LARVA_ADDED: 'nest_larva_added',
    NEST_LARVA_REMOVED: 'nest_larva_removed',
    NEST_EGG_ADDED: 'nest_egg_added',
    NEST_EGG_DEVELOP: 'nest_egg_develop',
    NEST_EGG_REMOVED: 'nest_egg_removed',
    NEST_BUILD_STATUS_CHANGED: 'nest_build_status_changed',
    NEST_FORTIFICATION_CHANGED: 'nest_fortification_changed',
    NEST_RENAMED: 'nest_renamed',
    NUPTIAL_ENVIRONMENT_MALES_CHANGED: 'nuptial_environment_males_changed',
    NUPTIAL_ENVIRONMENT_SPECIE_GENES_CHANGED: 'nuptial_environment_specie_genes_changed',
    COLONY_BORN: 'colony_born',
    COLONY_DIED: 'colony_died',
    COLONY_OPERATION_CHANGED: 'colony_operation_changed',
    COLONY_OPERATION_CREATED: 'colony_operation_created',
    COLONY_OPERATION_DELETED: 'colony_operation_deleted',
    COLONY_ENEMIES_CHANGED: 'colony_enemies_changed'
};



/***/ }),

/***/ "./gameApp/src/domain/entity/ant/baseAnt.js":
/*!**************************************************!*\
  !*** ./gameApp/src/domain/entity/ant/baseAnt.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BaseAnt: () => (/* binding */ BaseAnt)
/* harmony export */ });
/* harmony import */ var _liveEntity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../liveEntity */ "./gameApp/src/domain/entity/liveEntity.js");
/* harmony import */ var _domain_enum_entityTypes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @domain/enum/entityTypes */ "./gameApp/src/domain/enum/entityTypes.js");
/* harmony import */ var _action_actionTypes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../action/actionTypes */ "./gameApp/src/domain/entity/action/actionTypes.js");




class BaseAnt extends _liveEntity__WEBPACK_IMPORTED_MODULE_0__.LiveEntity {

    constructor(eventBus, id, name, position, angle, fromColony, ownerId, hp, maxHp, isInHibernation, antType, pickedItemId, locatedInNestId, homeNestId, stats, behavior, 
            genome, birthStep, currentActivity, isHungry) {
        super(eventBus, id, position, angle, _domain_enum_entityTypes__WEBPACK_IMPORTED_MODULE_1__.EntityTypes.ANT, fromColony, ownerId, hp, maxHp, isInHibernation);
        this._name = name;
        this._pickedItemId = pickedItemId;
        this._antType = antType;
        this.locatedInNestId = locatedInNestId;
        this._homeNestId = homeNestId;
        this._stats = stats;
        this._behavior = behavior;
        this._genome = genome
        this._birthStep = birthStep;
        this._currentActivity = currentActivity;
        this._isHungry = isHungry;
    }

    get isVisible() {
        return super.isVisible && !this.isInNest;
    }

    get name() {
        return this._name;
    }

    get antType() {
        return this._antType;
    }

    get isInNest() {
        return !!this._locatedInNestId;
    }

    get locatedInNestId() {
        return this._locatedInNestId;
    }

    set locatedInNestId(nestId) {
        this._locatedInNestId = nestId;
    }

    get pickedItemId() {
        return this._pickedItemId;
    }

    set pickedItemId(itemId) {
        this._pickedItemId = itemId;
    }

    get homeNestId() {
        return this._homeNestId;
    }

    set homeNestId(homeNestId) {
        this._homeNestId = homeNestId;
        this.events.emit('homeNestChanged');
    }

    get stats() {
        return this._stats;
    }

    get guardianBehavior() {
        return this._behavior.guardianBehavior;
    }

    set guardianBehavior(behaviorValue) {
        this._behavior.guardianBehavior = behaviorValue;
        this.events.emit('guardianBehaviorChanged');
    }

    get isCooperativeBehavior() {
        return this._behavior.isCooperative;
    }

    set isCooperativeBehavior(isCooperative) {
        this._behavior.isCooperative = isCooperative;
        this.events.emit('isCooperativeBehaviorChanged');
    }

    get genome() {
        return this._genome;
    }

    get birthStep() {
        return this._birthStep;
    }

    get isQueenOfColony() {
        return false;
    }

    get canFlyNuptialFlight() {
        return false;
    }

    set isInNuptialFlight(val) {
        this._isInNuptialFlight = val;
        this.events.emit('isInNuptialFlightChanged');
    }

    get isInNuptialFlight() {
        return this._isInNuptialFlight;
    }

    get canBeCooperative() {
        return true;
    }

    get canBeGuardian() {
        return true;
    }

    get currentActivity() {
        return this._currentActivity;
    }

    set currentActivity(val) {
        this._currentActivity = val;
        this.events.emit('currentActivityChanged');
    }

    get isHungry() {
        return this._isHungry;
    }

    set isHungry(val) {
        this._isHungry = val;
        this.events.emit('isHungryChanged');
    }

    hasPickedItem() {
        return !!this._pickedItemId;
    }

    playAction(action) {
        let isPlayed = super.playAction(action);
        if (isPlayed) {
            return true;
        }

        switch (action.type) {
            case _action_actionTypes__WEBPACK_IMPORTED_MODULE_2__.ACTION_TYPES.ANT_PICKED_UP_ITEM:
                this._playItemPickingAction(action);
                return true;
            case _action_actionTypes__WEBPACK_IMPORTED_MODULE_2__.ACTION_TYPES.ANT_DROPPED_PICKED_ITEM:
                this._playItemDroped(action);
                return true;
            case _action_actionTypes__WEBPACK_IMPORTED_MODULE_2__.ACTION_TYPES.ANT_HOME_NEST_CHANGED:
                this._playHomeNestChanged(action);
                return true;
            case _action_actionTypes__WEBPACK_IMPORTED_MODULE_2__.ACTION_TYPES.ENTITY_GOT_IN_NEST:
                this._playGotInNest(action);
                return true;
            case _action_actionTypes__WEBPACK_IMPORTED_MODULE_2__.ACTION_TYPES.ENTITY_GOT_OUT_OF_NEST:
                this._playGotOutOfNest(action);
                return true;
            case _action_actionTypes__WEBPACK_IMPORTED_MODULE_2__.ACTION_TYPES.ANT_CURRENT_ACTIVITY_CHANGED:
                this._playCurrentActivityChanged(action);
                return true;
            case _action_actionTypes__WEBPACK_IMPORTED_MODULE_2__.ACTION_TYPES.ANT_HUNGRY_STATE_CHANGED:
                this._playHungryStateChanged(action);
                return true;
            default:
                return false;
        }
    }

    _playItemPickingAction(action) {
        this.pickedItemId = action.actionData.item_id;
        this._requestActionAnimation(_action_actionTypes__WEBPACK_IMPORTED_MODULE_2__.ACTION_TYPES.ANT_PICKED_UP_ITEM, {
            itemId: this.pickedItemId
        });
    }

    _playItemDroped(action) {
        this._requestActionAnimation(_action_actionTypes__WEBPACK_IMPORTED_MODULE_2__.ACTION_TYPES.ANT_DROPPED_PICKED_ITEM, {
            droppingItemId: this.pickedItemId
        });
        this.pickedItemId = null;
    }

    _playGotInNest(action) {
        this.locatedInNestId = action.actionData.nest_id;
        this._requestActionAnimation(_action_actionTypes__WEBPACK_IMPORTED_MODULE_2__.ACTION_TYPES.ENTITY_GOT_IN_NEST, {
            isAntVisibleAfter: this.isVisible
        });
    }

    _playGotOutOfNest() {
        this.locatedInNestId = null;
        this._requestActionAnimation(_action_actionTypes__WEBPACK_IMPORTED_MODULE_2__.ACTION_TYPES.ENTITY_GOT_OUT_OF_NEST, {
            isAntVisibleAfter: this.isVisible
        });
    }

    _playHomeNestChanged(action) {
        this.homeNestId = action.nestId;
    }

    _playCurrentActivityChanged(action) {
        this.currentActivity = action.activity;
    }

    _playHungryStateChanged(action) {
        this.isHungry = action.isHungry;
    }

}



/***/ }),

/***/ "./gameApp/src/domain/entity/ant/index.js":
/*!************************************************!*\
  !*** ./gameApp/src/domain/entity/ant/index.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MaleAnt: () => (/* reexport safe */ _maleAnt__WEBPACK_IMPORTED_MODULE_3__.MaleAnt),
/* harmony export */   QueenAnt: () => (/* reexport safe */ _queenAnt__WEBPACK_IMPORTED_MODULE_0__.QueenAnt),
/* harmony export */   WarriorAnt: () => (/* reexport safe */ _warriorAnt__WEBPACK_IMPORTED_MODULE_1__.WarriorAnt),
/* harmony export */   WorkerAnt: () => (/* reexport safe */ _workerAnt__WEBPACK_IMPORTED_MODULE_2__.WorkerAnt)
/* harmony export */ });
/* harmony import */ var _queenAnt__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./queenAnt */ "./gameApp/src/domain/entity/ant/queenAnt.js");
/* harmony import */ var _warriorAnt__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./warriorAnt */ "./gameApp/src/domain/entity/ant/warriorAnt.js");
/* harmony import */ var _workerAnt__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./workerAnt */ "./gameApp/src/domain/entity/ant/workerAnt.js");
/* harmony import */ var _maleAnt__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./maleAnt */ "./gameApp/src/domain/entity/ant/maleAnt.js");







/***/ }),

/***/ "./gameApp/src/domain/entity/ant/maleAnt.js":
/*!**************************************************!*\
  !*** ./gameApp/src/domain/entity/ant/maleAnt.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MaleAnt: () => (/* binding */ MaleAnt)
/* harmony export */ });
/* harmony import */ var _baseAnt__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./baseAnt */ "./gameApp/src/domain/entity/ant/baseAnt.js");
/* harmony import */ var _domain_enum_antTypes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @domain/enum/antTypes */ "./gameApp/src/domain/enum/antTypes.js");
/* harmony import */ var _action_actionTypes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../action/actionTypes */ "./gameApp/src/domain/entity/action/actionTypes.js");




class MaleAnt extends _baseAnt__WEBPACK_IMPORTED_MODULE_0__.BaseAnt {

    constructor(eventBus, id, name, position, angle, fromColony, ownerId, hp, maxHp, isInHibernation, pickedItemId, locatedInNestId, homeNestId, stats, behavior, 
        genome, birthStep, currentActivity, isHungry) {
        super(eventBus, id, name, position, angle, fromColony, ownerId, hp, maxHp, isInHibernation, _domain_enum_antTypes__WEBPACK_IMPORTED_MODULE_1__.AntTypes.MALE, pickedItemId, locatedInNestId, homeNestId, stats, 
            behavior, genome, birthStep, currentActivity, isHungry);
    }

    get canFlyNuptialFlight() {
        return true;
    }

    get canBeCooperative() {
        return false;
    }

    get canBeGuardian() {
        return false;
    }

    get isVisible() {
        return super.isVisible && !this._isInNuptialFlight;
    }

    playAction(action) {
        let isPlayed = super.playAction(action);
        if (isPlayed) {
            return true;
        }

        switch (action.type) {
            case _action_actionTypes__WEBPACK_IMPORTED_MODULE_2__.ACTION_TYPES.ANT_FLEW_NUPTIAL_FLIGHT:
                this._playFlyNuptialFlight(action);
                return true;
            default:
                throw 'unknown type of action'
        }
    }

    _playFlyNuptialFlight() {
        this._requestActionAnimation(_action_actionTypes__WEBPACK_IMPORTED_MODULE_2__.ACTION_TYPES.ANT_FLEW_NUPTIAL_FLIGHT, {
            startPosition: this.position
        });
    }

}



/***/ }),

/***/ "./gameApp/src/domain/entity/ant/queenAnt.js":
/*!***************************************************!*\
  !*** ./gameApp/src/domain/entity/ant/queenAnt.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   QueenAnt: () => (/* binding */ QueenAnt)
/* harmony export */ });
/* harmony import */ var _baseAnt__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./baseAnt */ "./gameApp/src/domain/entity/ant/baseAnt.js");
/* harmony import */ var _domain_enum_antTypes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @domain/enum/antTypes */ "./gameApp/src/domain/enum/antTypes.js");
/* harmony import */ var _action_actionTypes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../action/actionTypes */ "./gameApp/src/domain/entity/action/actionTypes.js");
/* harmony import */ var _genetic_genome__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../genetic/genome */ "./gameApp/src/domain/entity/genetic/genome.js");





class QueenAnt extends _baseAnt__WEBPACK_IMPORTED_MODULE_0__.BaseAnt {

    constructor(eventBus, id, name, position, angle, fromColony, ownerId, hp, maxHp, isInHibernation, pickedItemId, locatedInNestId, homeNestId, stats, behavior, genome, 
        birthStep, currentActivity, isFertilized, isInNuptialFlight, breedingMaleGenome, isHungry) {
        super(eventBus, id, name, position, angle, fromColony, ownerId, hp, maxHp, isInHibernation, _domain_enum_antTypes__WEBPACK_IMPORTED_MODULE_1__.AntTypes.QUEEN, pickedItemId, locatedInNestId, homeNestId, stats, 
            behavior, genome, birthStep, currentActivity, isHungry);
        this._isFertilized = isFertilized;
        this._isInNuptialFlight = isInNuptialFlight;
        this._breedingMaleGenome = breedingMaleGenome;
    }

    get isVisible() {
        return super.isVisible && !this._isInNuptialFlight;
    }

    set isFertilized(val) {
        this._isFertilized = val;
    }

    get isFertilized() {
        return this._isFertilized;
    }

    get breedingMaleGenome() {
        return this._breedingMaleGenome;
    }

    get isQueenOfColony() {
        return this._isFertilized;
    }

    get canFlyNuptialFlight() {
        return !this.isQueenOfColony;
    }

    get canBeCooperative() {
        return false;
    }

    get canBeGuardian() {
        return false;
    }

    playAction(action) {
        let isPlayed = super.playAction(action);
        if (isPlayed) {
            return true;
        }

        switch (action.type) {
            case _action_actionTypes__WEBPACK_IMPORTED_MODULE_2__.ACTION_TYPES.ANT_FLEW_NUPTIAL_FLIGHT:
                this._playFlyNuptialFlight(action);
                return true;
            case _action_actionTypes__WEBPACK_IMPORTED_MODULE_2__.ACTION_TYPES.ANT_FLEW_NUPTIAL_FLIGHT_BACK:
                this._playFlyNuptialFlightBack(action);
                return true;
            case _action_actionTypes__WEBPACK_IMPORTED_MODULE_2__.ACTION_TYPES.ANT_GOT_FERTILIZED:
                this._playGotFertilized(action);
                return true;
            default:
                throw 'unknown type of action';
        }
    }

    _playFlyNuptialFlight(action) {
        this.isInNuptialFlight = true;
        this._requestActionAnimation(_action_actionTypes__WEBPACK_IMPORTED_MODULE_2__.ACTION_TYPES.ANT_FLEW_NUPTIAL_FLIGHT, {
            startPosition: this.position,
            isBornInNuptialFlight: action.isBornInNuptialFlight
        });
    }

    _playFlyNuptialFlightBack(action) {
        this.setPosition(action.landingPosition.x, action.landingPosition.y)
        this.isInNuptialFlight = false;
        this._emitToEventBus('queenFlewNuptialFlightBack');
        this._requestActionAnimation(_action_actionTypes__WEBPACK_IMPORTED_MODULE_2__.ACTION_TYPES.ANT_FLEW_NUPTIAL_FLIGHT_BACK, {
            landingPosition: action.landingPosition
        });
    }

    _playGotFertilized(action) {
        this.isFertilized = true;
        this._breedingMaleGenome = _genetic_genome__WEBPACK_IMPORTED_MODULE_3__.Genome.buildFromJson(action.breedingMaleGenome);
        this.events.emit('gotFertilized');
    }
}



/***/ }),

/***/ "./gameApp/src/domain/entity/ant/warriorAnt.js":
/*!*****************************************************!*\
  !*** ./gameApp/src/domain/entity/ant/warriorAnt.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   WarriorAnt: () => (/* binding */ WarriorAnt)
/* harmony export */ });
/* harmony import */ var _baseAnt__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./baseAnt */ "./gameApp/src/domain/entity/ant/baseAnt.js");
/* harmony import */ var _domain_enum_antTypes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @domain/enum/antTypes */ "./gameApp/src/domain/enum/antTypes.js");



class WarriorAnt extends _baseAnt__WEBPACK_IMPORTED_MODULE_0__.BaseAnt {

    constructor(eventBus, id, name, position, angle, fromColony, ownerId, hp, maxHp, isInHibernation, pickedItemId, locatedInNestId, homeNestId, stats, behavior, genome, 
        birthStep, currentActivity, isHungry) {
        super(eventBus, id, name, position, angle, fromColony, ownerId, hp, maxHp, isInHibernation, _domain_enum_antTypes__WEBPACK_IMPORTED_MODULE_1__.AntTypes.WARRIOR, pickedItemId, locatedInNestId, homeNestId, stats, 
            behavior, genome, birthStep, currentActivity, isHungry);
    }

    playAction(action) {
        let isPlayed = super.playAction(action);
        if (isPlayed) {
            return true;
        }

        switch (action.type) {
            default:
                throw 'unknown type of action';
        }
    }
}



/***/ }),

/***/ "./gameApp/src/domain/entity/ant/workerAnt.js":
/*!****************************************************!*\
  !*** ./gameApp/src/domain/entity/ant/workerAnt.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   WorkerAnt: () => (/* binding */ WorkerAnt)
/* harmony export */ });
/* harmony import */ var _baseAnt__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./baseAnt */ "./gameApp/src/domain/entity/ant/baseAnt.js");
/* harmony import */ var _domain_enum_antTypes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @domain/enum/antTypes */ "./gameApp/src/domain/enum/antTypes.js");



class WorkerAnt extends _baseAnt__WEBPACK_IMPORTED_MODULE_0__.BaseAnt {

    constructor(eventBus, id, name, position, angle, fromColony, ownerId, hp, maxHp, isInHibernation, pickedItemId, locatedInNestId, homeNestId, stats, behavior, genome, 
        birthStep, currentActivity, isHungry) {
        super(eventBus, id, name, position, angle, fromColony, ownerId, hp, maxHp, isInHibernation, _domain_enum_antTypes__WEBPACK_IMPORTED_MODULE_1__.AntTypes.WORKER, pickedItemId, locatedInNestId, homeNestId, stats, 
            behavior, genome, birthStep, currentActivity, isHungry);
    }

    playAction(action) {
        let isPlayed = super.playAction(action);
        if (isPlayed) {
            return true;
        }

        switch (action.type) {
            default:
                throw 'unknown type of action';
        }
    }

}



/***/ }),

/***/ "./gameApp/src/domain/entity/antColony.js":
/*!************************************************!*\
  !*** ./gameApp/src/domain/entity/antColony.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AntColony: () => (/* binding */ AntColony)
/* harmony export */ });
/* harmony import */ var _action_actionTypes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./action/actionTypes */ "./gameApp/src/domain/entity/action/actionTypes.js");
/* harmony import */ var _common_utils_eventEmitter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @common/utils/eventEmitter */ "./common/utils/eventEmitter.js");



class AntColony {

    constructor(eventBus, id, onwerId, name, operations, enemies) {
        this.events = new _common_utils_eventEmitter__WEBPACK_IMPORTED_MODULE_1__.EventEmitter();
        this._eventBus = eventBus;
        this._id = id;
        this._onwerId = onwerId;
        this._operations = operations;
        this._name = name;
        this._enemies = enemies;
    }

    get id() {
        return this._id;
    }

    get ownerId() {
        return this._onwerId;
    }

    get name() {
        return this._name;
    }

    get operations() {
        return this._operations;
    }

    get enemies() {
        return this._enemies;
    }

    playAction(action) {
        switch(action.type) {
            case _action_actionTypes__WEBPACK_IMPORTED_MODULE_0__.ACTION_TYPES.COLONY_DIED:
                this._playColonyDiedAction(action);
                break;
            case _action_actionTypes__WEBPACK_IMPORTED_MODULE_0__.ACTION_TYPES.COLONY_OPERATION_CREATED:
                this._playColonyOperationCreated(action)
                break;
            case _action_actionTypes__WEBPACK_IMPORTED_MODULE_0__.ACTION_TYPES.COLONY_OPERATION_CHANGED:
                this._playColonyOperationChanged(action)
                break;
            case _action_actionTypes__WEBPACK_IMPORTED_MODULE_0__.ACTION_TYPES.COLONY_OPERATION_DELETED:
                this._playColonyOperationDeleted(action)
                break;
            case _action_actionTypes__WEBPACK_IMPORTED_MODULE_0__.ACTION_TYPES.COLONY_ENEMIES_CHANGED:
                this._playColonyEnemiesChanged(action)
                break;
            default:
                throw 'unknown colony action type';
        }
    }

    _playColonyOperationCreated(action) {
        this._operations.push(action.operation);
        this.events.emit('addedOperation', action.operation);
        // this.events.emit(`addedOperation:${action.operation.id}`);
    }

    _playColonyOperationChanged(action) {
        let operation = this._findOperationById(action.operation.id);
        Object.assign(operation, action.operation);
        this.events.emit('operationChanged', operation);
    }

    _playColonyOperationDeleted(action) {
        let deletedOperationId = action.operationId;
        this._operations = this._operations.filter(operation => operation.id != deletedOperationId);
        this.events.emit('operationDeleted', deletedOperationId);
    }

    _playColonyEnemiesChanged(action) {
        this._enemies = action.enemies;
        this.events.emit('enemiesChanged');
    }

    _playColonyDiedAction(action) {
        this._emitToEventBus('colonyDied'); //to delete colony from world
        this.events.removeAllListeners();
    }

    _findOperationById(id) {
        for (let operation of this._operations) {
            if (operation.id == id) {
                return operation;
            }
        }

        return null;
    }

    _emitToEventBus(eventName, data) {
        this._eventBus.emit(eventName, this, data);
    }

}



/***/ }),

/***/ "./gameApp/src/domain/entity/chunk.js":
/*!********************************************!*\
  !*** ./gameApp/src/domain/entity/chunk.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Chunk: () => (/* binding */ Chunk)
/* harmony export */ });
class Chunk {

    constructor(x, y, width, height) {
        this._entities = [];
        this._shape = {x, y, width, height};
    }

    get shape() {
        return this._shape;
    }

    get entities() {
        return this._entities;
    }

    addEntity(entity) {
        this._entities.push(entity);
    }

    removeEntity(entity) {
        let index = this._entities.indexOf(entity);
        if (index > -1) {
            this._entities.splice(index, 1);
        }
    }

    hasEntity(entity) {
        let index = this._entities.indexOf(entity);
        return index > -1;
    }

    // containsPoint({x, y}) {
    //     let minX = this._shape.x;
    //     let maxX = this._shape.x + this._shape.width - 1;
    //     let minY = this._shape.y;
    //     let maxY = this._shape.y + this._shape.height - 1;

    //     return x >= minX && x <= maxX && y >= minY && y <= maxY;
    // }

    intersectsRect(x, y, width, height) {
        let chunkMinX = this._shape.x;
        let chunkMaxX = this._shape.x + this._shape.width - 1;
        let chunkMinY = this._shape.y;
        let chunkMaxY = this._shape.y + this._shape.height - 1;

        let otherMinX = x;
        let otherMaxX = x + width - 1;
        let otherMinY = y;
        let otherMaxY = y + height - 1;

        return !(
            chunkMaxX < otherMinX || 
            chunkMinX > otherMaxX || 
            chunkMaxY < otherMinY ||
            chunkMinY > otherMaxY
        );
    }
}



/***/ }),

/***/ "./gameApp/src/domain/entity/climate.js":
/*!**********************************************!*\
  !*** ./gameApp/src/domain/entity/climate.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Climate: () => (/* binding */ Climate)
/* harmony export */ });
/* harmony import */ var _common_utils_eventEmitter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @common/utils/eventEmitter */ "./common/utils/eventEmitter.js");


class Climate extends _common_utils_eventEmitter__WEBPACK_IMPORTED_MODULE_0__.EventEmitter {

    constructor() {
        super();
    }

    get dailyTemperature() {
        return this._dailyTemp;
    }

    get directionOfChange() {
        return this._directionOfChange;
    }

    setTemperatureChange(dailyTemp, directionOfChange) {
        this._dailyTemp = dailyTemp;
        this._directionOfChange = directionOfChange;
        this.emit('change');
    }

    playAction(action) {
        switch(action.type) {
            case 'climate_temperature_change':
                this._playTemperatureChangeAction(action);
        }
    }

    _playTemperatureChangeAction(action) {
        this.setTemperatureChange(action.dailyTemperature, action.directionOfChange);
    }
}



/***/ }),

/***/ "./gameApp/src/domain/entity/egg.js":
/*!******************************************!*\
  !*** ./gameApp/src/domain/entity/egg.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Egg: () => (/* binding */ Egg)
/* harmony export */ });
/* harmony import */ var _common_utils_eventEmitter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @common/utils/eventEmitter */ "./common/utils/eventEmitter.js");
/* harmony import */ var _genetic_genome__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./genetic/genome */ "./gameApp/src/domain/entity/genetic/genome.js");
/* harmony import */ var _domain_enum_eggStates__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @domain/enum/eggStates */ "./gameApp/src/domain/enum/eggStates.js");




class Egg {

    static buildFromJson(json) {
        let genome = _genetic_genome__WEBPACK_IMPORTED_MODULE_1__.Genome.buildFromJson(json.genome);
        return new Egg(json.id, json.name, genome, json.progress, json.antType, json.state);
    }

    constructor(id, name, genome, progress, antType, state) {
        this.events = new _common_utils_eventEmitter__WEBPACK_IMPORTED_MODULE_0__.EventEmitter();
        this.id = id;
        this.name = name;
        this.genome = genome;
        this.progress = progress;
        this.antType = antType;
        this.state = state;
    }

    get isFertilized() {
        return this.genome.isFertilized;
    }

    get avaliableAntTypes() {
        return this.genome.avaliableAntTypes;
    }

    updateProgress(progress, state) {
        this.progress = progress;
        this.state = state;
    }

}



/***/ }),

/***/ "./gameApp/src/domain/entity/entity.js":
/*!*********************************************!*\
  !*** ./gameApp/src/domain/entity/entity.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Entity: () => (/* binding */ Entity)
/* harmony export */ });
/* harmony import */ var _common_utils_eventEmitter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @common/utils/eventEmitter */ "./common/utils/eventEmitter.js");
/* harmony import */ var _action_actionTypes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./action/actionTypes */ "./gameApp/src/domain/entity/action/actionTypes.js");



class Entity {

    constructor(eventBus, id, position, angle, type, fromColony, ownerId, hp, maxHp) {
        this.events = new _common_utils_eventEmitter__WEBPACK_IMPORTED_MODULE_0__.EventEmitter();
        this._eventBus = eventBus;
        this.id = id;
        this._position = position;
        this.type = type;
        this._fromColony = fromColony;
        this._ownerId = ownerId;
        this._angle = angle;
        this._hp = hp;
        this._maxHp = maxHp;
        this._isDied = false;
        this._chunkId = null;
    }

    get isVisible() {
        return true;
    }

    get state() {
        return this._state;
    }

    setPosition(x, y) {
        this._position = {x, y};
        this.events.emit('positionChanged');
        this._eventBus.emit('entityMoved', this);
    }

    get position(){
        return this._position;
    }

    get angle() {
        return this._angle;
    }

    set angle(value) {
        this._angle = value;
        this.events.emit('angleChanged');
    }

    get fromColony() {
        return this._fromColony;
    }

    set fromColony(val) {
        this._fromColony = val;
        this.events.emit('fromColonyChanged');
    }

    get ownerId() {
        return this._ownerId;
    }

    get hp() {
        return this._hp;
    }

    set hp(value) {
        this._hp = value;
        this.events.emit('hpChanged');
    }

    get maxHp() {
        return this._maxHp
    }

    get isDied() {
        return this._isDied;
    }

    get chunkId() {
        return this._chunkId;
    }

    set chunkId(newChunkId) {
        let prevChunkId = this._chunkId;
        this._chunkId = newChunkId;
        if (newChunkId && prevChunkId) {
            this._eventBus.emit('entityChunkMigration', this, prevChunkId);
        } else if (newChunkId && !prevChunkId) {
            this._eventBus.emit('entityAddedToChunks', this, null);
        } else if (!newChunkId && prevChunkId) {
            this._eventBus.emit('entityRemovedFromChunks', this);
        } 
    }

    playAction(action) {
        switch (action.type) {
            case _action_actionTypes__WEBPACK_IMPORTED_MODULE_1__.ACTION_TYPES.ENTITY_HP_CHANGE:
                this._playHpChange(action);
                return true;
            case _action_actionTypes__WEBPACK_IMPORTED_MODULE_1__.ACTION_TYPES.ENTITY_DIED:
                this._playEntityDied(action);
                return true;
            case _action_actionTypes__WEBPACK_IMPORTED_MODULE_1__.ACTION_TYPES.ENTITY_COLONY_CHANGED:
                this._playEntityColonyChanged(action);
                return true;
            default:
                return false;
        }
    }

    _emitToEventBus(eventName, data) {
        this._eventBus.emit(eventName, this, data);
    }

    _playHpChange(action) {
        this.hp = action.actionData.hp;
        this._requestActionAnimation(_action_actionTypes__WEBPACK_IMPORTED_MODULE_1__.ACTION_TYPES.ENTITY_HP_CHANGE, {
            hp: this.hp
        });
    }

    _playEntityDied(action) {
        this._isDied = true;
        this._requestActionAnimation(_action_actionTypes__WEBPACK_IMPORTED_MODULE_1__.ACTION_TYPES.ENTITY_DIED);
        this._emitToEventBus('entityDied');//to delete entity from world
        this.events.removeAllListeners();
    }

    _playEntityColonyChanged(action) {
        this.fromColony = action.colonyId;
    }

    _requestActionAnimation(animationType, animationParams = {}) {
        this._eventBus.emit('entityActionAnimationRequest', this._chunkId, this.id, animationType, animationParams);
    }

}



/***/ }),

/***/ "./gameApp/src/domain/entity/genetic/chromosomesSet.js":
/*!*************************************************************!*\
  !*** ./gameApp/src/domain/entity/genetic/chromosomesSet.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ChromosomesSet: () => (/* binding */ ChromosomesSet)
/* harmony export */ });
class ChromosomesSet {
    constructor(chromosomes) {
        this._chromosomes = chromosomes;
    }

    get chromosomes() {
        return this._chromosomes;
    }

    getChromosomeByType(type) {
        for (let chromosome of this._chromosomes) {
            if (chromosome.type == type) {
                return chromosome;
            }
        }
    }
}



/***/ }),

/***/ "./gameApp/src/domain/entity/genetic/genome.js":
/*!*****************************************************!*\
  !*** ./gameApp/src/domain/entity/genetic/genome.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Genome: () => (/* binding */ Genome)
/* harmony export */ });
/* harmony import */ var _chromosomesSet__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./chromosomesSet */ "./gameApp/src/domain/entity/genetic/chromosomesSet.js");


class Genome {

    static buildFromJson(json) {
        let maternalChromosomesSet = new _chromosomesSet__WEBPACK_IMPORTED_MODULE_0__.ChromosomesSet(json.maternal);
        let paternalChromosomesSet = json.paternal ? new _chromosomesSet__WEBPACK_IMPORTED_MODULE_0__.ChromosomesSet(json.paternal) : null;
        return new Genome(maternalChromosomesSet, paternalChromosomesSet, json.avaliableAntTypes);
    }

    constructor(maternal, paternal, avaliableAntTypes) {
        this._maternal = maternal;
        this._paternal = paternal;
        this._avaliableAntTypes = avaliableAntTypes;
    }
    
    get maternal() {
        return this._maternal;
    }
    
    get paternal() {
        return this._paternal;
    }
    
    get avaliableAntTypes() {
        return this._avaliableAntTypes;
    }

    get isFertilized() {
        return !!this._paternal;
    }

}



/***/ }),

/***/ "./gameApp/src/domain/entity/item.js":
/*!*******************************************!*\
  !*** ./gameApp/src/domain/entity/item.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Item: () => (/* binding */ Item)
/* harmony export */ });
/* harmony import */ var _entity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./entity */ "./gameApp/src/domain/entity/entity.js");
/* harmony import */ var _enum_entityTypes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enum/entityTypes */ "./gameApp/src/domain/enum/entityTypes.js");
/* harmony import */ var _action_actionTypes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./action/actionTypes */ "./gameApp/src/domain/entity/action/actionTypes.js");




class Item extends _entity__WEBPACK_IMPORTED_MODULE_0__.Entity {
    
    constructor(eventBus, id, position, angle, fromColony, hp, maxHp, itemType, itemVariety, isPicked, isBringing) {
        super(eventBus, id, position, angle, _enum_entityTypes__WEBPACK_IMPORTED_MODULE_1__.EntityTypes.ITEM, fromColony, null, hp, maxHp);
        this._itemType = itemType;
        this._itemVariety = itemVariety;
        this._isPicked = isPicked;
        this._isBringing = isBringing;
    }

    get isVisible() {
        return super.isVisible && !this.isPicked;
    }

    get itemType() {
        return this._itemType;
    }

    get itemVariety() {
        return this._itemVariety;
    }

    get isPicked() {
        return this._isPicked;
    }

    set isPicked(value) {
        this._isPicked = value;
    }

    get isBringing() {
        return this._isBringing;
    }

    playAction(action) {
        let promise = super.playAction(action)
        if (promise) {
            return promise
        }
        switch (action.type) {
            case _action_actionTypes__WEBPACK_IMPORTED_MODULE_2__.ACTION_TYPES.ITEM_WAS_PICKED_UP:
                return this._playItemPickedUp(action);
            case _action_actionTypes__WEBPACK_IMPORTED_MODULE_2__.ACTION_TYPES.ITEM_WAS_DROPPED:
                return this._playItemDrop(action);
            case _action_actionTypes__WEBPACK_IMPORTED_MODULE_2__.ACTION_TYPES.ITEM_BEING_BRINGED:
                return this._playItemBeingBringed(action);
            case _action_actionTypes__WEBPACK_IMPORTED_MODULE_2__.ACTION_TYPES.ITEM_BRINGING_STATE_CHANGED:
                return this._playItemBringingStateChanged(action);
        }
    }

    async _playItemPickedUp(action) {
        this.isPicked = true;
        this._requestActionAnimation(_action_actionTypes__WEBPACK_IMPORTED_MODULE_2__.ACTION_TYPES.ITEM_WAS_PICKED_UP);
    }
    
    playItemDrop(pos) {
        this.isPicked = false;
        this.setPosition(pos.x, pos.y);
        this._requestActionAnimation(_action_actionTypes__WEBPACK_IMPORTED_MODULE_2__.ACTION_TYPES.ITEM_WAS_DROPPED, {
            dropPosition: pos
        });
    }

    async _playItemDrop(action) {
    }

    async _playItemBeingBringed(action) {
        this._requestActionAnimation(_action_actionTypes__WEBPACK_IMPORTED_MODULE_2__.ACTION_TYPES.ITEM_BEING_BRINGED, {
            pointFrom: this.position, 
            pointTo: action.new_position,
            userSpeed: action.bring_user_speed
        });
        this.setPosition(action.new_position.x, action.new_position.y);
    }

    _playItemBringingStateChanged(action) {
        this._isBringing = action.isBringing;
        return Promise.resolve();
    }

}



/***/ }),

/***/ "./gameApp/src/domain/entity/itemArea.js":
/*!***********************************************!*\
  !*** ./gameApp/src/domain/entity/itemArea.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ItemArea: () => (/* binding */ ItemArea)
/* harmony export */ });
/* harmony import */ var _entity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./entity */ "./gameApp/src/domain/entity/entity.js");
/* harmony import */ var _enum_entityTypes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enum/entityTypes */ "./gameApp/src/domain/enum/entityTypes.js");



class ItemArea extends _entity__WEBPACK_IMPORTED_MODULE_0__.Entity {
    constructor(eventBus, id, position, angle, hp, maxHp) {
        super(eventBus, id, position, angle, _enum_entityTypes__WEBPACK_IMPORTED_MODULE_1__.EntityTypes.ITEM_AREA, null, null, hp, maxHp);
    }
}



/***/ }),

/***/ "./gameApp/src/domain/entity/itemSource.js":
/*!*************************************************!*\
  !*** ./gameApp/src/domain/entity/itemSource.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ItemSource: () => (/* binding */ ItemSource)
/* harmony export */ });
/* harmony import */ var _entity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./entity */ "./gameApp/src/domain/entity/entity.js");
/* harmony import */ var _enum_entityTypes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enum/entityTypes */ "./gameApp/src/domain/enum/entityTypes.js");
/* harmony import */ var _action_actionTypes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./action/actionTypes */ "./gameApp/src/domain/entity/action/actionTypes.js");




class ItemSource extends _entity__WEBPACK_IMPORTED_MODULE_0__.Entity {
    
    constructor(eventBus, id, position, angle, fromColony, hp, maxHp, itemType, isDamaged, accumulated, maxAccumulated, fertility) {
        super(eventBus, id, position, angle, _enum_entityTypes__WEBPACK_IMPORTED_MODULE_1__.EntityTypes.ITEM_SOURCE, fromColony, null, hp, maxHp);
        this._itemType = itemType;
        this._isDamaged = isDamaged;
        this._accumulated = accumulated;
        this._maxAccumulated = maxAccumulated;
        this._fertility = fertility;
    }

    get itemType() {
        return this._itemType;
    }

    get isDamaged() {
        return this._isDamaged;
    }

    get accumulated() {
        return this._accumulated;
    }

    get maxAccumulated() {
        return this._maxAccumulated;
    }

    get fertility() {
        return this._fertility;
    }

    playAction(action) {
        let isPlayed = super.playAction(action);
        if (isPlayed) {
            return true;
        }
        switch (action.type) {
            case _action_actionTypes__WEBPACK_IMPORTED_MODULE_2__.ACTION_TYPES.ITEM_SOURCE_IS_DAMAGED_CHANGED:
                this._playIsDamagedChangedAction(action);
                return true;
            case _action_actionTypes__WEBPACK_IMPORTED_MODULE_2__.ACTION_TYPES.ITEM_SOURCE_ACCUMULATED_CHANGED:
                this._playAccumulatedChangedAction(action);
                return true;
            default:
                throw 'unknown type of action';
        }
    }

    _playIsDamagedChangedAction(action) {
        this._isDamaged = action.isDamaged;
        this._requestActionAnimation(_action_actionTypes__WEBPACK_IMPORTED_MODULE_2__.ACTION_TYPES.ITEM_SOURCE_IS_DAMAGED_CHANGED, {
            isDamaged: this._isDamaged
        })
    }

    _playAccumulatedChangedAction(action) {
        this._accumulated = action.accumulated;
        this._requestActionAnimation(_action_actionTypes__WEBPACK_IMPORTED_MODULE_2__.ACTION_TYPES.ITEM_SOURCE_ACCUMULATED_CHANGED, {
            accumulated: this._accumulated
        })
    }
}



/***/ }),

/***/ "./gameApp/src/domain/entity/ladybug.js":
/*!**********************************************!*\
  !*** ./gameApp/src/domain/entity/ladybug.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Ladybug: () => (/* binding */ Ladybug)
/* harmony export */ });
/* harmony import */ var _enum_entityTypes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enum/entityTypes */ "./gameApp/src/domain/enum/entityTypes.js");
/* harmony import */ var _liveEntity__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./liveEntity */ "./gameApp/src/domain/entity/liveEntity.js");



class Ladybug extends _liveEntity__WEBPACK_IMPORTED_MODULE_1__.LiveEntity {

    constructor(eventBus, id, position, angle, fromColony, hp, maxHp, isInHibernation) {
        super(eventBus, id, position, angle, _enum_entityTypes__WEBPACK_IMPORTED_MODULE_0__.EntityTypes.LADYBUG, fromColony, null, hp, maxHp, isInHibernation);
    }

}



/***/ }),

/***/ "./gameApp/src/domain/entity/larva.js":
/*!********************************************!*\
  !*** ./gameApp/src/domain/entity/larva.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Larva: () => (/* binding */ Larva)
/* harmony export */ });
/* harmony import */ var _common_utils_eventEmitter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @common/utils/eventEmitter */ "./common/utils/eventEmitter.js");
/* harmony import */ var _genetic_genome__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./genetic/genome */ "./gameApp/src/domain/entity/genetic/genome.js");



class Larva {

    static buildFromJson(json) {
        let genome = _genetic_genome__WEBPACK_IMPORTED_MODULE_1__.Genome.buildFromJson(json.genome);
        return new Larva(json.id, json.name, json.antType, json.ateFood, json.requiredFood, genome);
    }

    constructor(id, name, antType, ateFood, requiredFood, genome) {
        this.events = new _common_utils_eventEmitter__WEBPACK_IMPORTED_MODULE_0__.EventEmitter();
        this.id = id;
        this.name = name;
        this.antType = antType;
        this._ateFood = ateFood;
        this.requiredFood = requiredFood;
        this.genome = genome;
    }

    get ateFood() {
        return this._ateFood;
    }

    set ateFood(value) {
        this._ateFood = value;
        this.events.emit('progressChanged');
    }

}



/***/ }),

/***/ "./gameApp/src/domain/entity/liveEntity.js":
/*!*************************************************!*\
  !*** ./gameApp/src/domain/entity/liveEntity.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LiveEntity: () => (/* binding */ LiveEntity)
/* harmony export */ });
/* harmony import */ var _entity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./entity */ "./gameApp/src/domain/entity/entity.js");
/* harmony import */ var _action_actionTypes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./action/actionTypes */ "./gameApp/src/domain/entity/action/actionTypes.js");



class LiveEntity extends _entity__WEBPACK_IMPORTED_MODULE_0__.Entity {

    constructor(eventBus, id, position, angle, entityType, fromColony, ownerId, hp, maxHp, isInHibernation) {
        super(eventBus, id, position, angle, entityType, fromColony, ownerId, hp, maxHp);
        this._isInHibernation = isInHibernation;
    }

    get isInHibernation() {
        return this._isInHibernation;
    }

    set isInHibernation(val) {
        this._isInHibernation = val;
    }

    get isVisible() {
        return super.isVisible && !this._isInHibernation;
    }

    playAction(action) {
        let isPlayed = super.playAction(action);
        if (isPlayed) {
            return true;
        }

        switch (action.type) {
            case _action_actionTypes__WEBPACK_IMPORTED_MODULE_1__.ACTION_TYPES.ENTITY_ROTATED:
                this._playEntityRotated(action);
                return true;
            case _action_actionTypes__WEBPACK_IMPORTED_MODULE_1__.ACTION_TYPES.ENTITY_WALK:
                this._playWalkAction(action);
                return true;
            case _action_actionTypes__WEBPACK_IMPORTED_MODULE_1__.ACTION_TYPES.ENTITY_HIBERNATION_STATUS_CHANGED:
                this._playHibernationStatusChanged(action);
                return true;
            default:
                return false;
        }
    }

    _playEntityRotated(action) {
        this._requestActionAnimation(_action_actionTypes__WEBPACK_IMPORTED_MODULE_1__.ACTION_TYPES.ENTITY_ROTATED, {
            startAngle: this.angle,
            newAngle: action.actionData.angle
        });
        this.angle = action.actionData.angle;
    }

    _playWalkAction(action) {
        this._requestActionAnimation(_action_actionTypes__WEBPACK_IMPORTED_MODULE_1__.ACTION_TYPES.ENTITY_WALK, {
            pointFrom: this.position,
            pointTo: action.position,
            userSpeed: action.userSpeed
        });
        this.setPosition(action.position.x, action.position.y);
    }

    _playHibernationStatusChanged(action) {
        this.isInHibernation = action.isInHibernation;
        this._requestActionAnimation(_action_actionTypes__WEBPACK_IMPORTED_MODULE_1__.ACTION_TYPES.ENTITY_HIBERNATION_STATUS_CHANGED, {
            isEntityVisibleAfter: this.isVisible
        });
    }

}



/***/ }),

/***/ "./gameApp/src/domain/entity/nest.js":
/*!*******************************************!*\
  !*** ./gameApp/src/domain/entity/nest.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Nest: () => (/* binding */ Nest)
/* harmony export */ });
/* harmony import */ var _entity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./entity */ "./gameApp/src/domain/entity/entity.js");
/* harmony import */ var _enum_entityTypes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enum/entityTypes */ "./gameApp/src/domain/enum/entityTypes.js");
/* harmony import */ var _action_actionTypes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./action/actionTypes */ "./gameApp/src/domain/entity/action/actionTypes.js");
/* harmony import */ var _larva__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./larva */ "./gameApp/src/domain/entity/larva.js");
/* harmony import */ var _egg__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./egg */ "./gameApp/src/domain/entity/egg.js");






class Nest extends _entity__WEBPACK_IMPORTED_MODULE_0__.Entity {

    constructor(eventBus, id, position, angle, fromColony, ownerId, storedCalories, larvae, eggs, isBuilt, hp, maxHp, fortification, maxFortification, name, isMain, area) {
        super(eventBus, id, position, angle, _enum_entityTypes__WEBPACK_IMPORTED_MODULE_1__.EntityTypes.NEST, fromColony, ownerId, hp, maxHp);
        this._storedCalories = storedCalories;
        this._larvae = larvae;
        this._eggs = eggs;
        this._fortification = fortification;
        this._maxFortification = maxFortification;
        this._name = name;
        this._isMain = isMain;
        this._area = area;
        this._isBuilt = isBuilt;
    }

    get storedCalories() {
        return this._storedCalories;
    }

    get larvae() {
        return this._larvae;
    }

    get eggs() {
        return this._eggs;
    }

    get fortification() {
        return this._fortification;
    }

    set fortification(value) {
        this._fortification = value;
    }

    get maxFortification() {
        return this._maxFortification;
    }

    get name() {
        return this._name;
    }

    get isMain() {
        return this._isMain;
    }

    get area() {
        return this._area;
    }

    get isBuilt() {
        return this._isBuilt;
    }

    changeCasteForEgg(eggId, antType) {
        let egg = this._findEggById(eggId);
        egg.antType = antType;
        this.events.emit('eggUpdated', egg.id, {
            antType: egg.antType,
        });
    }

    changeNameForEgg(eggId, name) {
        let egg = this._findEggById(eggId);
        egg.name = name;
        this.events.emit('eggUpdated', egg.id, {
            name: egg.name,
        });
    }

    _removeEggFromArray(eggId) {
        let index = this._eggs.findIndex(e => e.id == eggId);
        if (index != -1) {
            this._eggs.splice(index, 1);
        }
    }

    _removeLarvaFromArray(larvaId) {
        let index = this._larvae.findIndex(l => l.id == larvaId);
        if (index != -1) {
            this._larvae.splice(index, 1);
        }
    }

    _findEggById(id) {
        return this._eggs.find(egg => egg.id == id);
    }

    _findLarvaById(id) {
        return this._larvae.find(larva => larva.id == id);
    }

    playAction(action) {
        let isPlayed = super.playAction(action);
        if (isPlayed) {
            return true;
        }
        switch (action.type) {
            case _action_actionTypes__WEBPACK_IMPORTED_MODULE_2__.ACTION_TYPES.NEST_STORED_CALORIES_CHANGED:
                this._playStoredCaloriesChanged(action);
                return true;
            case _action_actionTypes__WEBPACK_IMPORTED_MODULE_2__.ACTION_TYPES.NEST_LARVA_FED:
                this._playLarvaFed(action);
                return true;
            case _action_actionTypes__WEBPACK_IMPORTED_MODULE_2__.ACTION_TYPES.NEST_LARVA_ADDED:
                this._playLarvaAdded(action);
                return true;
            case _action_actionTypes__WEBPACK_IMPORTED_MODULE_2__.ACTION_TYPES.NEST_LARVA_REMOVED:
                this._playLarvaRemoved(action);
                return true;
            case _action_actionTypes__WEBPACK_IMPORTED_MODULE_2__.ACTION_TYPES.NEST_BUILD_STATUS_CHANGED:
                this._playBuildStatusChanged(action);
                return true;
            case _action_actionTypes__WEBPACK_IMPORTED_MODULE_2__.ACTION_TYPES.NEST_EGG_ADDED:
                this._playEggAdded(action);
                return true;
            case _action_actionTypes__WEBPACK_IMPORTED_MODULE_2__.ACTION_TYPES.NEST_EGG_DEVELOP:
                this._playEggDevelop(action);
                return true;
            case _action_actionTypes__WEBPACK_IMPORTED_MODULE_2__.ACTION_TYPES.NEST_EGG_REMOVED:
                this._playEggRemoved(action);
                return true;
            case _action_actionTypes__WEBPACK_IMPORTED_MODULE_2__.ACTION_TYPES.NEST_FORTIFICATION_CHANGED:
                this._playFortificationChanged(action);
                return true;
            case _action_actionTypes__WEBPACK_IMPORTED_MODULE_2__.ACTION_TYPES.NEST_RENAMED:
                this._playRenamed(action);
                return true;
            default:
                throw 'unknown type of action';
        }
    }

    _playStoredCaloriesChanged(action) {
        this._storedCalories = action.storedCalories;
        this.events.emit('storedCaloriesChanged');
    }

    _playLarvaFed(action) {
        let larva = this._larvae.find(larva => larva.id == action.larvaId);
        larva.ateFood = action.ateFood;
        this.events.emit('larvaUpdated', larva.id, {
            ateFood: larva.ateFood
        });
    }

    _playLarvaAdded(action) {
        let larva = _larva__WEBPACK_IMPORTED_MODULE_3__.Larva.buildFromJson(action.larva);
        this._larvae.push(larva);
        this.events.emit('larvaAdded', larva);
    }

    _playLarvaRemoved(action) {
        this._removeLarvaFromArray(action.larvaId);
        this.events.emit('larvaRemoved', action.larvaId);
    }
    
    _playEggDevelop(action) {
        let egg = this._findEggById(action.eggId);
        egg.updateProgress(action.progress, action.state);
        this.events.emit('eggUpdated', egg.id, {
            state: egg.state,
            progress: egg.progress
        });
    }

    _playEggAdded(action) {
        let egg = _egg__WEBPACK_IMPORTED_MODULE_4__.Egg.buildFromJson(action.egg); 
        this._eggs.push(egg);
        this.events.emit('eggAdded', egg);
    }

    _playEggRemoved(action) {
        this._removeEggFromArray(action.eggId);
        this.events.emit('eggRemoved', action.eggId);
    }

    _playBuildStatusChanged(action) {
        this._isBuilt = action.isBuilt;
        this._requestActionAnimation(_action_actionTypes__WEBPACK_IMPORTED_MODULE_2__.ACTION_TYPES.NEST_BUILD_STATUS_CHANGED, {
            isBuilt: this._isBuilt
        });
    }

    _playFortificationChanged(action) {
        this.fortification = action.fortification;
        this._requestActionAnimation(_action_actionTypes__WEBPACK_IMPORTED_MODULE_2__.ACTION_TYPES.NEST_FORTIFICATION_CHANGED, {
            fortification: this.fortification
        });
    }

    _playRenamed(action) {
        this._name = action.name;
        this._requestActionAnimation(_action_actionTypes__WEBPACK_IMPORTED_MODULE_2__.ACTION_TYPES.NEST_RENAMED, {
            name: action.name
        });
        this.events.emit('nameChanged');
    }

}




/***/ }),

/***/ "./gameApp/src/domain/entity/nuptialEnvironment.js":
/*!*********************************************************!*\
  !*** ./gameApp/src/domain/entity/nuptialEnvironment.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NuptialEnvironment: () => (/* binding */ NuptialEnvironment)
/* harmony export */ });
/* harmony import */ var _common_utils_eventEmitter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @common/utils/eventEmitter */ "./common/utils/eventEmitter.js");


class NuptialEnvironment {

    static build() {
        return new NuptialEnvironment();
    }

    constructor() {
        this.events = new _common_utils_eventEmitter__WEBPACK_IMPORTED_MODULE_0__.EventEmitter();
        this._nuptialMales = [];
        this._specieData = null;
    }

    get nuptialMales() {
        return this._nuptialMales;
    }

    setNuptialMales(males) {
        this._nuptialMales = males;
    }

    get specieData() {
        return this._specieData;
    }

    setSpecieData(specieData) {
        this._specieData = specieData;
    }

}



/***/ }),

/***/ "./gameApp/src/domain/entity/tree.js":
/*!*******************************************!*\
  !*** ./gameApp/src/domain/entity/tree.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Tree: () => (/* binding */ Tree)
/* harmony export */ });
/* harmony import */ var _entity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./entity */ "./gameApp/src/domain/entity/entity.js");
/* harmony import */ var _domain_enum_entityTypes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @domain/enum/entityTypes */ "./gameApp/src/domain/enum/entityTypes.js");



class Tree extends _entity__WEBPACK_IMPORTED_MODULE_0__.Entity {

    constructor(eventBus, id, position, angle, fromColony, ownerId, hp, maxHp) {
        super(eventBus, id, position, angle, _domain_enum_entityTypes__WEBPACK_IMPORTED_MODULE_1__.EntityTypes.TREE, fromColony, ownerId, hp, maxHp);
    }
}



/***/ }),

/***/ "./gameApp/src/domain/entity/world.js":
/*!********************************************!*\
  !*** ./gameApp/src/domain/entity/world.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   World: () => (/* binding */ World)
/* harmony export */ });
/* harmony import */ var _enum_entityTypes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enum/entityTypes */ "./gameApp/src/domain/enum/entityTypes.js");
/* harmony import */ var _domain_consts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @domain/consts */ "./gameApp/src/domain/consts.js");
/* harmony import */ var _chunk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./chunk */ "./gameApp/src/domain/entity/chunk.js");
/* harmony import */ var _utils_distance__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @utils/distance */ "./gameApp/src/utils/distance.js");
/* harmony import */ var _domain_enum_season_types__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @domain/enum/season_types */ "./gameApp/src/domain/enum/season_types.js");






class World {
    constructor(mainEventBus, climate) {
        this._mainEventBus = mainEventBus;
        this._entities = [];
        this._colonies = [];
        this._climate = climate;
        this._currentStep = 0;
        this._currentSeason = null;
        this._size = null;
        this._chunks = {};

        this._mainEventBus.on('entityMoved', this._onEntityMoved.bind(this));
    }

    get currentStep() {
        return this._currentStep;
    }

    set currentStep(stepNumber) {
        this._currentStep = stepNumber;
        this._mainEventBus.emit('currentStepChanged', stepNumber);
    }

    get currentSeason() {
        return this._currentSeason
    }

    set currentSeason(season) {
        this._currentSeason = season;
    }

    get entities() {
        return [...this._entities];
    }

    get colonies() {
        return [...this._colonies];
    }

    get size() {
        return this._size;
    }

    get climate() {
        return this._climate;
    }

    get chunks() {
        return this._chunks;
    }

    initWorld(size, entities, colonies, climate, stepNumber, season) {
        this._size = size;
        this._entities = entities;
        this._entitiesByIds = {};
        this._colonies = colonies;
        this._climate.setTemperatureChange(climate.dailyTemperature, climate.directionOfChange);
        this._currentStep = stepNumber;
        this._currentSeason = season;

        this._splitOnChunks();
        this._addAllEntitiesToChunks();
        this._addAllEntitiesToIds();
    }

    getAnts() {
        return this.findEntityByType(_enum_entityTypes__WEBPACK_IMPORTED_MODULE_0__.EntityTypes.ANT);
    }

    getNests() {
        return this.findEntityByType(_enum_entityTypes__WEBPACK_IMPORTED_MODULE_0__.EntityTypes.NEST);
    }

    addEntity(entity) {
        this._entities.push(entity);
        this._addEntityToChunks(entity);
        this._addEntityToIds(entity);
    }

    deleteEntity(entity) {
        let index = this._entities.indexOf(entity);
        if (index != -1) {
            this._entities.splice(index, 1);
        }
        this._removeEntityFromChunks(entity);
        this._removeEntityFromIds(entity);
    }

    addColony(colony) {
        this._colonies.push(colony);
    }

    deleteColony(colony) {
        let index = this._colonies.indexOf(colony);
        if (index != -1) {
            this._colonies.splice(index, 1);
        }
    }

    findEntityByType(type) {
        return this._entities.filter(e => e.type == type);
    }

    findEntityById(id) {
        return this._entitiesByIds[id];
        return this._entities.find( entity => entity.id == id);
    }

    findColonyById(id) {
        return this._colonies.find( colony => colony.id == id);
    }

    isAnyColonyByOwnerId(ownerId) {
        return this._colonies.some(colony => colony.ownerId == ownerId);
    }

    isAnyAntByOwnerId(ownerId) {
        return this._entities.some(entity => entity.type == _enum_entityTypes__WEBPACK_IMPORTED_MODULE_0__.EntityTypes.ANT && entity.ownerId == ownerId);
    }

    findAntsByOwnerId(ownerId) {
        return this._entities.filter(entity => entity.type == _enum_entityTypes__WEBPACK_IMPORTED_MODULE_0__.EntityTypes.ANT && entity.ownerId == ownerId);
    }

    findAntsFromColony(colonyId) {
        return this._entities.filter(e => e.type == _enum_entityTypes__WEBPACK_IMPORTED_MODULE_0__.EntityTypes.ANT && e.fromColony == colonyId);
    }

    findColonyByOwnerId(ownerId) {
        return this._colonies.find(colony => colony.ownerId == ownerId);
    }

    findColoniesByOwnerId(ownerId) {
        return this._colonies.filter(colony => colony.ownerId == ownerId);
    }

    findNestsFromColony(colonyId) {
        return this._entities.filter(e => e.type == _enum_entityTypes__WEBPACK_IMPORTED_MODULE_0__.EntityTypes.NEST && e.fromColony == colonyId);
    }

    findNestsByOwner(ownerId) {
        return this._entities.filter(e => e.type == _enum_entityTypes__WEBPACK_IMPORTED_MODULE_0__.EntityTypes.NEST && e.ownerId == ownerId);
    }

    getQueenOfColony(colonyId) {
        let ants = this.findAntsFromColony(colonyId);
        for (let ant of ants) {
            if (ant.isQueenOfColony) {
                return ant;
            }
        }

        return null;
    }

    getMainNestOfColony(colonyId) {
        let nests = this.findNestsFromColony(colonyId);
        return nests.find(nest => nest.isMain);
    }

    getSubNestsOfColony(colonyId) {
        let nests = this.findNestsFromColony(colonyId);
        return nests.filter(nest => !nest.isMain);
    }

    getEntitiesFromChunks(chunkIds) {
        let entities = [];
        for (let chunkId of chunkIds) {
            entities = entities.concat(this._chunks[chunkId].entities);
        }

        return entities;
    }

    getEntitiesNear(position, radius) {
        let searchRect = { 
            x: position.x - radius, 
            y: position.y - radius, 
            width: 2*radius, 
            height: 2*radius 
        };
        let seacrhingChunkIds = [];
        for (let chunkId in this._chunks) {
            let chunk = this._chunks[chunkId];
            if (chunk.intersectsRect(searchRect.x, searchRect.y, searchRect.width, searchRect.height)) {
                seacrhingChunkIds.push(chunkId);
            }
        }

        let entities = this.getEntitiesFromChunks(seacrhingChunkIds);
        let foundEntities = [];
        for (let entity of entities) {
            if ((0,_utils_distance__WEBPACK_IMPORTED_MODULE_3__.distance_point)(entity.position, position) <= radius) {
                foundEntities.push(entity);
            }
        }

        return foundEntities;
    }

    _splitOnChunks() {
        let rowsCount = Math.ceil(this._size[1] / _domain_consts__WEBPACK_IMPORTED_MODULE_1__.CONSTS.VIEW_CHUNK_SIZE[1]);
        let colsCount = Math.ceil(this._size[0] / _domain_consts__WEBPACK_IMPORTED_MODULE_1__.CONSTS.VIEW_CHUNK_SIZE[0]);

        for (let chunkColIndex = 0; chunkColIndex < colsCount; chunkColIndex++) {
            for (let chunkRowIndex = 0; chunkRowIndex < rowsCount; chunkRowIndex++) {
                let chunkX = chunkColIndex * _domain_consts__WEBPACK_IMPORTED_MODULE_1__.CONSTS.VIEW_CHUNK_SIZE[0];
                let chunkY = chunkRowIndex * _domain_consts__WEBPACK_IMPORTED_MODULE_1__.CONSTS.VIEW_CHUNK_SIZE[1];
                let chunkId = `${chunkColIndex}_${chunkRowIndex}`;
                this._chunks[chunkId] = new _chunk__WEBPACK_IMPORTED_MODULE_2__.Chunk(chunkX, chunkY, _domain_consts__WEBPACK_IMPORTED_MODULE_1__.CONSTS.VIEW_CHUNK_SIZE[0], _domain_consts__WEBPACK_IMPORTED_MODULE_1__.CONSTS.VIEW_CHUNK_SIZE[1]);
            }
        }
    }

    _addAllEntitiesToChunks() {
        for (let entity of this._entities) {
            this._addEntityToChunks(entity);
        }
    }

    _addEntityToChunks(entity) {
        let chunkId = this._calcChunkIdForPosition(entity.position);
        let chunk = this._chunks[chunkId];
        chunk.addEntity(entity);
        entity.chunkId = chunkId;
    }

    _removeEntityFromChunks(entity) {
        let chunk = this._chunks[entity.chunkId];
        chunk.removeEntity(entity);
        entity.chunkId = null;
    }

    _addAllEntitiesToIds() {
        for (let entity of this._entities) {
            this._addEntityToIds(entity);
        }
    }

    _addEntityToIds(entity) {
        this._entitiesByIds[entity.id] = entity;
    }

    _removeEntityFromIds(entity) {
        delete this._entitiesByIds[entity.id];
    }

    _onEntityMoved(entity) {
        let newChunkId = this._calcChunkIdForPosition(entity.position);
        if (entity.chunkId != newChunkId) {
            let oldChunk = this._chunks[entity.chunkId];
            oldChunk.removeEntity(entity);
            let newChunk = this._chunks[newChunkId];
            newChunk.addEntity(entity);
            entity.chunkId = newChunkId;
        }
    }

    _calcChunkIdForPosition({x, y}) {
        let first = Math.floor(x / _domain_consts__WEBPACK_IMPORTED_MODULE_1__.CONSTS.VIEW_CHUNK_SIZE[0]);
        let second = Math.floor(y / _domain_consts__WEBPACK_IMPORTED_MODULE_1__.CONSTS.VIEW_CHUNK_SIZE[1]);
        return `${first}_${second}`;
    }
}



/***/ }),

/***/ "./gameApp/src/domain/enum/antTypes.js":
/*!*********************************************!*\
  !*** ./gameApp/src/domain/enum/antTypes.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AntTypes: () => (/* binding */ AntTypes)
/* harmony export */ });
const AntTypes = {
    WORKER: 'worker',
    WARRIOR: 'warrior',
    QUEEN: 'queen',
    MALE: 'male'
}



/***/ }),

/***/ "./gameApp/src/domain/enum/eggStates.js":
/*!**********************************************!*\
  !*** ./gameApp/src/domain/enum/eggStates.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EggStates: () => (/* binding */ EggStates)
/* harmony export */ });
const EggStates = {
    DEVELOPMENT: 'development',
    READY: 'ready',
    SPOILED: 'spoiled'
}



/***/ }),

/***/ "./gameApp/src/domain/enum/entityTypes.js":
/*!************************************************!*\
  !*** ./gameApp/src/domain/enum/entityTypes.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EntityTypes: () => (/* binding */ EntityTypes)
/* harmony export */ });
const EntityTypes = {
    ANT: 'ant',
    LADYBUG: 'ladybug',
    NEST: 'nest',
    ITEM: 'item',
    ITEM_SOURCE: 'item_source',
    ITEM_AREA: 'item_area',
    TREE: 'tree'
}



/***/ }),

/***/ "./gameApp/src/domain/enum/errorCodes.js":
/*!***********************************************!*\
  !*** ./gameApp/src/domain/enum/errorCodes.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ErrorCodes: () => (/* binding */ ErrorCodes)
/* harmony export */ });
const ErrorCodes = {
    CONFLICT: 'conflict',
    UNKNOWN_ERR: 'unknown_err'
}



/***/ }),

/***/ "./gameApp/src/domain/enum/itemTypes.js":
/*!**********************************************!*\
  !*** ./gameApp/src/domain/enum/itemTypes.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ItemTypes: () => (/* binding */ ItemTypes)
/* harmony export */ });
const ItemTypes = {
    LEAF: 'leaf',
    STICK: 'stick',
    FLOWER: 'flower',
    HONEYDEW: 'honeydew',
    NECTAR: 'nectar',
    BUG_CORPSE: 'bug_corpse',
    ANT_FOOD: 'ant_food'
}



/***/ }),

/***/ "./gameApp/src/domain/enum/season_types.js":
/*!*************************************************!*\
  !*** ./gameApp/src/domain/enum/season_types.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SEASON_TYPES: () => (/* binding */ SEASON_TYPES)
/* harmony export */ });
const SEASON_TYPES = {
    WINTER: 'winter',
    SPRING: 'spring',
    SUMMER: 'summer',
    AUTUMN: 'autumn'
}



/***/ }),

/***/ "./gameApp/src/domain/service/antService.js":
/*!**************************************************!*\
  !*** ./gameApp/src/domain/service/antService.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AntService: () => (/* binding */ AntService)
/* harmony export */ });
/* harmony import */ var _base_baseGameService__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base/baseGameService */ "./gameApp/src/domain/service/base/baseGameService.js");


class AntService extends _base_baseGameService__WEBPACK_IMPORTED_MODULE_0__.BaseGameService {

    constructor(mainEventBus, world, antApi) {
        super(mainEventBus, world);
        this._antApi = antApi;
    }

    async antFlyNuptialFlight(antId) {
        await this._requestHandler(() => this._antApi.flyNuptialFlight(antId));
    }

    async antChangeGuardianBehavior(antId, behaviorValue) {
        await this._requestHandler(() => this._antApi.changeGuardianBehavior(antId, behaviorValue));
        let ant = this._world.findEntityById(antId);
        ant.guardianBehavior = behaviorValue;
    }

    async antToggleCooperativeBehavior(antId, isCooperative) {
        await this._requestHandler(() => this._antApi.toggleCooperativeBehavior(antId, isCooperative));
        let ant = this._world.findEntityById(antId);
        ant.isCooperativeBehavior = isCooperative;
    }

    async antRelocate(antId, homeNestId) {
        await this._requestHandler(() => this._antApi.relocateToNest(antId, homeNestId));
        let ant = this._world.findEntityById(antId);
        ant.homeNestId = homeNestId;
    }

}



/***/ }),

/***/ "./gameApp/src/domain/service/base/baseGameService.js":
/*!************************************************************!*\
  !*** ./gameApp/src/domain/service/base/baseGameService.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BaseGameService: () => (/* binding */ BaseGameService)
/* harmony export */ });
/* harmony import */ var _common_domain_errors_conflictRequestError__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @common/domain/errors/conflictRequestError */ "./common/domain/errors/conflictRequestError.js");
/* harmony import */ var _common_domain_service_base_baseService__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @common/domain/service/base/baseService */ "./common/domain/service/base/baseService.js");
/* harmony import */ var _domain_enum_errorCodes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @domain/enum/errorCodes */ "./gameApp/src/domain/enum/errorCodes.js");




class BaseGameService extends _common_domain_service_base_baseService__WEBPACK_IMPORTED_MODULE_1__.BaseService {

    constructor(mainEventBus, world) {
        super();
        this._mainEventBus = mainEventBus;
        this._world = world;
    }

    async _requestHandler(apiCallFunc) {
        try {
            return await super._requestHandler(apiCallFunc);
        } catch (e) {
            if (e instanceof _common_domain_errors_conflictRequestError__WEBPACK_IMPORTED_MODULE_0__.ConflictRequestError) {
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

    _makeSuccessResult(mergIn = {}) {
        let result = { success: true };
        return Object.assign(result, mergIn);
    }

    _makeErrorResult(errCode) {
        return { success: false, errCode };
    }

    _makeErrorResultConflict() {
        return this._makeErrorResult(_domain_enum_errorCodes__WEBPACK_IMPORTED_MODULE_2__.ErrorCodes.CONFLICT);
    }

    _makeErrorResultUnknownErr() {
        return this._makeErrorResult(_domain_enum_errorCodes__WEBPACK_IMPORTED_MODULE_2__.ErrorCodes.UNKNOWN_ERR);
    }

}



/***/ }),

/***/ "./gameApp/src/domain/service/colonyService.js":
/*!*****************************************************!*\
  !*** ./gameApp/src/domain/service/colonyService.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ColonyService: () => (/* binding */ ColonyService)
/* harmony export */ });
/* harmony import */ var _domain_entity_action_actionTypes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @domain/entity/action/actionTypes */ "./gameApp/src/domain/entity/action/actionTypes.js");
/* harmony import */ var _base_baseGameService__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./base/baseGameService */ "./gameApp/src/domain/service/base/baseGameService.js");
/* harmony import */ var _domain_enum_entityTypes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @domain/enum/entityTypes */ "./gameApp/src/domain/enum/entityTypes.js");
/* harmony import */ var _domain_enum_itemTypes__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @domain/enum/itemTypes */ "./gameApp/src/domain/enum/itemTypes.js");
/* harmony import */ var _utils_distance__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @utils/distance */ "./gameApp/src/utils/distance.js");
/* harmony import */ var _messages_messageIds__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @messages/messageIds */ "./gameApp/src/messages/messageIds.js");
/* harmony import */ var _domain_consts__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @domain/consts */ "./gameApp/src/domain/consts.js");
/* harmony import */ var _common_domain_errors_conflictRequestError__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @common/domain/errors/conflictRequestError */ "./common/domain/errors/conflictRequestError.js");
/* harmony import */ var _common_domain_errors_genericRequestError__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @common/domain/errors/genericRequestError */ "./common/domain/errors/genericRequestError.js");










class ColonyService extends _base_baseGameService__WEBPACK_IMPORTED_MODULE_1__.BaseGameService {

    static SAFETY_MARGIN = 2;

    constructor(mainEventBus, world, colonyApi, worldFactory) {
        super(mainEventBus, world);
        this._mainEventBus = mainEventBus;
        this._colonyApi = colonyApi;
        this._world = world;
        this._worldFactory = worldFactory;

        this._mainEventBus.on('colonyDied', this._onColonyDied.bind(this));
    }

    playColonyAction(action) {
        switch(action.type) {
            case _domain_entity_action_actionTypes__WEBPACK_IMPORTED_MODULE_0__.ACTION_TYPES.COLONY_BORN:
                this.giveBirthToColony(action.actionData.colony);
                break;
            default:
                let colony = this._world.findColonyById(action.actorId);
                colony.playAction(action);
        }
    
    }

    giveBirthToColony(colonyJson) {
        let colony = this._worldFactory.buildAntColony(colonyJson);
        this._world.addColony(colony);
        this._mainEventBus.emit('colonyBorn', colony);
    }

    getEnemyColonyData(colonyId) {
        let colony = this._world.findColonyById(colonyId);
        let colonyNests = this._world.findNestsFromColony(colonyId);
        let xSum = 0;
        let ySum = 0;
        for (let nest of colonyNests) {
            xSum += nest.position.x;
            ySum += nest.position.y;
        }
        let averageX = Math.round(xSum / colonyNests.length);
        let averageY = Math.round(ySum / colonyNests.length);

        return {
            id: colonyId,
            name: colony.name,
            position: { x: averageX, y: averageY }
        }
    }

    stopOperation(colonyId, operationId) {
        this._colonyApi.stopOperation(colonyId, operationId);
    }

    async buildNewSubNestOperation(performingColonyId, buildingSite, workersCount, warriorsCount, nestName) {
        try {
            let result = await this._requestHandler(() => this._colonyApi.buildNewSubNestOperation(performingColonyId, buildingSite, workersCount, warriorsCount, nestName));
            return this._makeSuccessResult({ operationId: result.operationId });
        } catch (e) {
            if (e instanceof _common_domain_errors_conflictRequestError__WEBPACK_IMPORTED_MODULE_7__.ConflictRequestError) {
                return this._makeErrorResultConflict();
            } else if (e instanceof _common_domain_errors_genericRequestError__WEBPACK_IMPORTED_MODULE_8__.GenericRequestError) {
                return this._makeErrorResultUnknownErr();
            }
        }
}   

    async destroyNestOperation(performingColonyId, warriorsCount, workersCount, nestId) {
        try {
            let result = await this._requestHandler(() => this._colonyApi.destroyNestOperation(performingColonyId, warriorsCount, workersCount, nestId));
            return this._makeSuccessResult({ operationId: result.operationId });
        } catch (e) {
            if (e instanceof _common_domain_errors_conflictRequestError__WEBPACK_IMPORTED_MODULE_7__.ConflictRequestError) {
                return this._makeErrorResultConflict();
            } else if (e instanceof _common_domain_errors_genericRequestError__WEBPACK_IMPORTED_MODULE_8__.GenericRequestError) {
                return this._makeErrorResultUnknownErr();
            }
        }
    }

    async pillageNestOperation(performingColonyId, pillagingNestId, nestForLootId, warriorsCount, workersCount) {
        try {
            let result = await this._requestHandler(() => this._colonyApi.pillageNestOperation(performingColonyId, pillagingNestId, nestForLootId, warriorsCount, workersCount));
            return this._makeSuccessResult({ operationId: result.operationId });
        } catch (e) {
            if (e instanceof _common_domain_errors_conflictRequestError__WEBPACK_IMPORTED_MODULE_7__.ConflictRequestError) {
                return this._makeErrorResultConflict();
            } else if (e instanceof _common_domain_errors_genericRequestError__WEBPACK_IMPORTED_MODULE_8__.GenericRequestError) {
                return this._makeErrorResultUnknownErr();
            }
        }
    }

    async transportFoodOperation(performingColonyId, fromNestId, toNestId, workersCount, warriorsCount) {
        try {
            let result = await this._requestHandler(() => this._colonyApi.transportFoodOperation(performingColonyId, fromNestId, toNestId, workersCount, warriorsCount));
            return this._makeSuccessResult({ operationId: result.operationId });
        } catch (e) {
            if (e instanceof _common_domain_errors_conflictRequestError__WEBPACK_IMPORTED_MODULE_7__.ConflictRequestError) {
                return this._makeErrorResultConflict();
            } else if (e instanceof _common_domain_errors_genericRequestError__WEBPACK_IMPORTED_MODULE_8__.GenericRequestError) {
                return this._makeErrorResultUnknownErr();
            }
        }
    }

    async buildFortificationsOpearation(performingColonyId, nestId, workersCount) {
        try {
            let result = await this._requestHandler(() => this._colonyApi.buildFortificationsOpearation(performingColonyId, nestId, workersCount));
            return this._makeSuccessResult({ operationId: result.operationId });
        } catch (e) {
            if (e instanceof _common_domain_errors_conflictRequestError__WEBPACK_IMPORTED_MODULE_7__.ConflictRequestError) {
                return this._makeErrorResultConflict();
            } else if (e instanceof _common_domain_errors_genericRequestError__WEBPACK_IMPORTED_MODULE_8__.GenericRequestError) {
                return this._makeErrorResultUnknownErr();
            }
        }
    }

    async bringBugOpearation(performingColonyId, nestId) {
        try{
            let result = await this._requestHandler(() => this._colonyApi.bringBugOpearation(performingColonyId, nestId));
            return this._makeSuccessResult({ operationId: result.operationId });
        } catch (e) {
            if (e instanceof _common_domain_errors_conflictRequestError__WEBPACK_IMPORTED_MODULE_7__.ConflictRequestError) {
                return this._makeErrorResultConflict();
            } else if (e instanceof _common_domain_errors_genericRequestError__WEBPACK_IMPORTED_MODULE_8__.GenericRequestError) {
                return this._makeErrorResultUnknownErr();
            }
        }
    }

    buildMarker(type, point, params = {}) {
        return {
            type,
            point,
            params
        };
    }

    findClosestBugCorpseNearNest(nestId) {
        let nest = this._world.findEntityById(nestId);
        let items = this._world.findEntityByType(_domain_enum_entityTypes__WEBPACK_IMPORTED_MODULE_2__.EntityTypes.ITEM);
        let bugCorpsesInNestArea = items
            .filter(
                (i) =>
                    i.itemType === _domain_enum_itemTypes__WEBPACK_IMPORTED_MODULE_3__.ItemTypes.BUG_CORPSE &&
                    (0,_utils_distance__WEBPACK_IMPORTED_MODULE_4__.distance)(nest.position.x, nest.position.y, i.position.x, i.position.y) <= nest.area &&
                    !i.isBringing
            )
            .sort(
                (a, b) =>
                    (0,_utils_distance__WEBPACK_IMPORTED_MODULE_4__.distance)(nest.position.x, nest.position.y, a.position.x, a.position.y) - 
                    (0,_utils_distance__WEBPACK_IMPORTED_MODULE_4__.distance)(nest.position.x, nest.position.y, b.position.x, b.position.y)
            );
        
            return bugCorpsesInNestArea.length > 0 ? bugCorpsesInNestArea[0] : null;
    }

    getNestBuildableArea(mainNestPosition, chunkIds) {
        let area = null;
        if (mainNestPosition) {
            area = { center: mainNestPosition, radius: _domain_consts__WEBPACK_IMPORTED_MODULE_6__.CONSTS.MAX_DISTANCE_TO_SUB_NEST - ColonyService.SAFETY_MARGIN};
        }
        
        let entities = this._world.getEntitiesFromChunks(chunkIds);
        let itemSources = entities.filter(e => e.type == _domain_enum_entityTypes__WEBPACK_IMPORTED_MODULE_2__.EntityTypes.ITEM_SOURCE);
        let nests = entities.filter(e => e.type == _domain_enum_entityTypes__WEBPACK_IMPORTED_MODULE_2__.EntityTypes.NEST);
        if (mainNestPosition) {
            let maxBlockingDist = _domain_consts__WEBPACK_IMPORTED_MODULE_6__.CONSTS.MAX_DISTANCE_TO_SUB_NEST + _domain_consts__WEBPACK_IMPORTED_MODULE_6__.CONSTS.ITEM_SOURCE_BLOCKING_RADIUS;
            itemSources = itemSources.filter(is => (0,_utils_distance__WEBPACK_IMPORTED_MODULE_4__.distance_point)(is.position, mainNestPosition) <= maxBlockingDist);
            nests = nests.filter(nest => (0,_utils_distance__WEBPACK_IMPORTED_MODULE_4__.distance_point)(nest.position, mainNestPosition) <= maxBlockingDist);
        }
        
        let exclusions = [];
        for (let itemSource of itemSources) {
            exclusions.push({ center: itemSource.position, radius: _domain_consts__WEBPACK_IMPORTED_MODULE_6__.CONSTS.ITEM_SOURCE_BLOCKING_RADIUS + ColonyService.SAFETY_MARGIN });
        }

        for (let nest of nests) {
            exclusions.push({ center: nest.position, radius: _domain_consts__WEBPACK_IMPORTED_MODULE_6__.CONSTS.NEST_BLOCKING_RADIUS + ColonyService.SAFETY_MARGIN });
        }

        return {
            area,
            exclusions
        };
    }

    getRaidableArea(raidingColonyId, raidAreaCenter, chunkIds) {
        let entities = this._world.getEntitiesFromChunks(chunkIds);
        let nests = entities.filter(e => e.type == _domain_enum_entityTypes__WEBPACK_IMPORTED_MODULE_2__.EntityTypes.NEST);
        let area = { center: raidAreaCenter, radius: _domain_consts__WEBPACK_IMPORTED_MODULE_6__.CONSTS.MAX_DISTANCE_TO_OPERATION_TARGET - _domain_consts__WEBPACK_IMPORTED_MODULE_6__.CONSTS.NEST_BLOCKING_RADIUS - ColonyService.SAFETY_MARGIN};

        let nestPickers = [];
        let exclusions = [];

        for (let nest of nests) {
            if (nest.fromColony == raidingColonyId) {
                exclusions.push({ center: nest.position, radius: _domain_consts__WEBPACK_IMPORTED_MODULE_6__.CONSTS.NEST_BLOCKING_RADIUS });
            } else {
                nestPickers.push({ center: nest.position, radius: _domain_consts__WEBPACK_IMPORTED_MODULE_6__.CONSTS.NEST_BLOCKING_RADIUS, nestId: nest.id });
            }
        }

        return {
            area,
            nestPickers,
            exclusions
        }
    }

    validateNewNestOperationConditions(colonyId) {
        let queen = this._world.getQueenOfColony(colonyId);
        let mainNest = this._world.getMainNestOfColony(colonyId);
        if (!queen || !mainNest) {
            return _messages_messageIds__WEBPACK_IMPORTED_MODULE_5__.GAME_MESSAGE_IDS.NEW_SUB_NEST_OPER_CANT_BUILD_SUB_NEST_WITHOUT_QUEEN;
        }

        let subNests = this._world.getSubNestsOfColony(colonyId);
        if (subNests.length >= _domain_consts__WEBPACK_IMPORTED_MODULE_6__.CONSTS.MAX_SUB_NEST_COUNT) {
            return _messages_messageIds__WEBPACK_IMPORTED_MODULE_5__.GAME_MESSAGE_IDS.NEW_SUB_NEST_OPER_CANT_BUILD_MORE_SUB_NESTS;
        }

        return null;
    }

    validateBuildingSubNestPosition(position) {
        if (!position) {
            return _messages_messageIds__WEBPACK_IMPORTED_MODULE_5__.GAME_MESSAGE_IDS.NEW_SUB_NEST_OPER_BUILDING_POSITION_NEEDED;
        }

        if (!this._checkIsBuildPositionFreeFromNests(position)) {
            return _messages_messageIds__WEBPACK_IMPORTED_MODULE_5__.GAME_MESSAGE_IDS.NEW_SUB_NEST_OPER_BUILDING_POSITION_BLOCKED;
        }

        return null;
    }

    validateBuildingNewNestPosition(position) {
        if (!position) {
            return _messages_messageIds__WEBPACK_IMPORTED_MODULE_5__.GAME_MESSAGE_IDS.BREEDING_PLACE_TO_SETTLE_NEEDED;
        }

        if (!this._checkIsBuildPositionFreeFromNests(position)) {
            return _messages_messageIds__WEBPACK_IMPORTED_MODULE_5__.GAME_MESSAGE_IDS.BREEDING_PLACE_TO_SETTLE_BLOCKED;
        }

        return null;
    }

    validateBreedingQueen(queenId) {
        let queen = this._world.findEntityById(queenId);

        if (!queen) {
            return _messages_messageIds__WEBPACK_IMPORTED_MODULE_5__.GAME_MESSAGE_IDS.BREEDING_QUEEN_NEEDED;
        }

        if (queen.isDied) {
            return _messages_messageIds__WEBPACK_IMPORTED_MODULE_5__.GAME_MESSAGE_IDS.BREEDING_LIVE_QUEEN_NEEDED;
        }

        return null;
    }

    validateDestroyNestOperationConditions(colonyId) {
        let queen = this._world.getQueenOfColony(colonyId);
        if (!queen) {
            return _messages_messageIds__WEBPACK_IMPORTED_MODULE_5__.GAME_MESSAGE_IDS.DESTROY_NEST_OPER_CANT_ATTACK_WITHOUT_QUEEN;
        }

        return null;
    }

    validateNestToDestroy(nestId) {
        let nest = this._world.findEntityById(nestId);

        if (!nestId) {
            return _messages_messageIds__WEBPACK_IMPORTED_MODULE_5__.GAME_MESSAGE_IDS.DESTROY_NEST_OPER_NEST_NEEDED;
        }

        if (!nest || nest.isDied) {
            return _messages_messageIds__WEBPACK_IMPORTED_MODULE_5__.GAME_MESSAGE_IDS.DESTROY_NEST_OPER_NOT_DESTROYED_NEST_NEEDED;
        }
        
        return null;
    }

    validatePillageNestOperationConditions(colonyId) {
        let queen = this._world.getQueenOfColony(colonyId);
        if (!queen) {
            return _messages_messageIds__WEBPACK_IMPORTED_MODULE_5__.GAME_MESSAGE_IDS.PILLAGE_NEST_OPER_CANT_PILLAGE_WITHOUT_QUEEN;
        }

        return null;
    }

    validateNestToPillage(nestId) {
        let nest = this._world.findEntityById(nestId);

        if (!nestId) {
            return _messages_messageIds__WEBPACK_IMPORTED_MODULE_5__.GAME_MESSAGE_IDS.PILLAGE_NEST_OPER_NEST_TO_PILLAGE_NEEDED;
        }

        if (!nest || nest.isDied) {
            return _messages_messageIds__WEBPACK_IMPORTED_MODULE_5__.GAME_MESSAGE_IDS.PILLAGE_NEST_OPER_NOT_DESTROYED_NEST_TO_PILLAGE_NEEDED;
        }

        return null;
    }

    _checkIsBuildPositionFreeFromNests(position) {
        let nearEntities = this._world.getEntitiesNear(position, _domain_consts__WEBPACK_IMPORTED_MODULE_6__.CONSTS.NEST_BLOCKING_RADIUS + ColonyService.SAFETY_MARGIN);
        let nearNests = nearEntities.filter(e => e.type == _domain_enum_entityTypes__WEBPACK_IMPORTED_MODULE_2__.EntityTypes.NEST);
        return nearNests.length == 0;
    }

    _onColonyDied(colony) {
        this._world.deleteColony(colony);
    }

}



/***/ }),

/***/ "./gameApp/src/domain/service/messageHandlerService.js":
/*!*************************************************************!*\
  !*** ./gameApp/src/domain/service/messageHandlerService.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MessageHandlerService: () => (/* binding */ MessageHandlerService)
/* harmony export */ });
/* harmony import */ var _domain_consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @domain/consts */ "./gameApp/src/domain/consts.js");



class MessageHandlerService {

    constructor(mainEventBus, serverConnection, worldService, colonyService, userService, nuptialEnvironmentService) {
        this._mainEventBus = mainEventBus;
        this._serverConnection = serverConnection;
        this._worldService = worldService;
        this._colonyService = colonyService;
        this._userService = userService;
        this._nuptialEnvironmentService = nuptialEnvironmentService;
        this._serverConnection.events.on('message', this._onMessage.bind(this));
    }

    connect(socketURL) {
        return this._serverConnection.connect(socketURL);
    }

    disconnect() {
        this._serverConnection.disconnect();
    }

    _onMessage(msg) {
        switch(msg.type) {
            case 'init_step':
                this._handleInitStepMsg(msg);
                break;
            case 'step':
                this._handleStepMsg(msg);
                break;
            case 'email_verified':
                this._handleEmailVerifiedMsg(msg);
                break;
            default: 
                throw `unknown type of message "${ msg.type }"`
        }
    }

    _handleInitStepMsg(msg) {
        (0,_domain_consts__WEBPACK_IMPORTED_MODULE_0__.initConsts)(msg.consts);
        this._userService.initNotifications(msg.notifications)
        this._worldService.initWorld(msg.world, msg.step, msg.season);
        this._worldService.initRating(msg.rating);
        this._nuptialEnvironmentService.init(msg.specie, msg.nuptialMales);
        this._mainEventBus.emit('initStepDone');
    }

    _handleStepMsg(msg) {
        this._worldService.setCurrentStep(msg.step, msg.season);
        this._mainEventBus.emit('stepStart', msg.step);
        for (let action of msg.actions) {
            switch(action.actorType) {
                case 'entity':
                    this._worldService.playEntityAction(action)
                    break;
                case 'colony':
                    this._colonyService.playColonyAction(action);
                    break;
                case 'climate':
                    this._worldService.playClimateAction(action);
                    break;
                case 'user':
                    this._userService.playUserAction(action);
                    break;
                case 'rating':
                    this._worldService.playRatingAction(action);
                    break;
                case 'nuptial_environment':
                    this._nuptialEnvironmentService.playAction(action);
                    break;
            }
        }
        this._mainEventBus.emit(`stepSyncDone:${msg.step}`);
        this._mainEventBus.emit('stepDone', msg.step);
    }

    _handleEmailVerifiedMsg() {
        this._userService.verifyEmailForUser();
    }

}



/***/ }),

/***/ "./gameApp/src/domain/service/nestService.js":
/*!***************************************************!*\
  !*** ./gameApp/src/domain/service/nestService.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NestService: () => (/* binding */ NestService)
/* harmony export */ });
/* harmony import */ var _base_baseGameService__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base/baseGameService */ "./gameApp/src/domain/service/base/baseGameService.js");
/* harmony import */ var _domain_consts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @domain/consts */ "./gameApp/src/domain/consts.js");
/* harmony import */ var _utils_distance__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @utils/distance */ "./gameApp/src/utils/distance.js");
/* harmony import */ var _domain_entity_egg__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @domain/entity/egg */ "./gameApp/src/domain/entity/egg.js");
/* harmony import */ var _domain_entity_larva__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @domain/entity/larva */ "./gameApp/src/domain/entity/larva.js");
/* harmony import */ var _common_domain_errors_conflictRequestError__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @common/domain/errors/conflictRequestError */ "./common/domain/errors/conflictRequestError.js");
/* harmony import */ var _common_domain_errors_genericRequestError__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @common/domain/errors/genericRequestError */ "./common/domain/errors/genericRequestError.js");








class NestService extends _base_baseGameService__WEBPACK_IMPORTED_MODULE_0__.BaseGameService {

    constructor(mainEventBus, world, nestApi) {
        super(mainEventBus, world);
        this._nestApi = nestApi;
    }

    async layEggInNest(nestId, name, isFertilized) {
        try {
            let result = await this._requestHandler(() => this._nestApi.layEggInNest(nestId, name, isFertilized));
            return this._makeSuccessResult({ eggId: result.eggId });
        } catch (e) {
            if (e instanceof _common_domain_errors_conflictRequestError__WEBPACK_IMPORTED_MODULE_5__.ConflictRequestError) {
                return this._makeErrorResultConflict();
            } else if (e instanceof _common_domain_errors_genericRequestError__WEBPACK_IMPORTED_MODULE_6__.GenericRequestError) {
                return this._makeErrorResultUnknownErr();
            }
        }
    }

    async changeEggCasteInNest(nestId, eggId, antType) {
        await this._requestHandler(() => this._nestApi.changeEggCaste(nestId, eggId, antType));
        let nest = this._world.findEntityById(nestId);
        nest.changeCasteForEgg(eggId, antType);
    }

    async changeEggNameInNest(nestId, eggId, name) {
        await this._requestHandler(() => this._nestApi.changeEggName(nestId, eggId, name));
        let nest = this._world.findEntityById(nestId);
        nest.changeNameForEgg(eggId, name);
    }

    async moveEggToLarvaInNest(nestId, eggId) {
        try {
            let result = await this._requestHandler(() => this._nestApi.eggToLarvaChamber(nestId, eggId));
            return this._makeSuccessResult({ larvaId: result.larvaId });
        } catch (e) {
            if (e instanceof _common_domain_errors_conflictRequestError__WEBPACK_IMPORTED_MODULE_5__.ConflictRequestError) {
                return this._makeErrorResultConflict();
            } else if (e instanceof _common_domain_errors_genericRequestError__WEBPACK_IMPORTED_MODULE_6__.GenericRequestError) {
                return this._makeErrorResultUnknownErr();
            }
        }
    }

    async deleteEggInNest(nestId, eggId) {
        await this._requestHandler(() => this._nestApi.eggDelete(nestId, eggId));
    }

    async deleteLarvaInNest(nestId, larvaId) {
        await this._requestHandler(() => this._nestApi.larvaDelete(nestId, larvaId));
    }

    async renameNest(nestId, name) {
        await this._requestHandler(() => this._nestApi.renameNest(nestId, name));
    }

    validateLayingEggInNest(nestId) {
        let nest = this._world.findEntityById(nestId);

        let queen = this._world.getQueenOfColony(nest.fromColony);
        if (!queen || queen.locatedInNestId != nest.id) {
            return 'CANT_LAY_EGG_WITHOUT_QUEEN_IN_NEST';
        }

        if (nest.storedCalories < _domain_consts__WEBPACK_IMPORTED_MODULE_1__.CONSTS.NEW_EGG_FOOD_COST) {
            return'NOT_ENOUGHT_FOOD_IN_NEST_TO_LAY_EGG';
        }

        if (!_domain_consts__WEBPACK_IMPORTED_MODULE_1__.CONSTS.LAY_EGG_SEASONS.includes(this._world.currentSeason)) {
            return 'NOT_SUITABLE_SEASON_TO_LAY_EGG';
        }

        return null;
    }

    // findMyFirstNest(userId) {
    //     let myNests = this._world.findNestsByOwner(userId);
    //     for (let nest of myNests) {
    //         if (nest.isMain) {
    //             return nest;
    //         }
    //     }

    //     if (myNests.length > 0) {
    //         return myNests[0];
    //     } else {
    //         return null;
    //     }
    // }

    findNearestNest(point, excludeColonyId) {
        let nests = this._world.getNests();
        let nearestNest = null;
        let smallestDistance = null;
        let maxDist = 100;

        nests.forEach(nest => {
            let dist = (0,_utils_distance__WEBPACK_IMPORTED_MODULE_2__.distance)(point.x, point.y, nest.position.x, nest.position.y);
            if (!nest.isDied && (!excludeColonyId || nest.fromColony != excludeColonyId) && dist <= maxDist && (!smallestDistance || dist < smallestDistance)) {
                smallestDistance = dist;
                nearestNest = nest;
            }
        });

        return nearestNest;
    }

}



/***/ }),

/***/ "./gameApp/src/domain/service/nuptialEnvironmentService.js":
/*!*****************************************************************!*\
  !*** ./gameApp/src/domain/service/nuptialEnvironmentService.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NuptialEnvironmentService: () => (/* binding */ NuptialEnvironmentService)
/* harmony export */ });
/* harmony import */ var _base_baseGameService__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base/baseGameService */ "./gameApp/src/domain/service/base/baseGameService.js");
/* harmony import */ var _domain_entity_action_actionTypes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @domain/entity/action/actionTypes */ "./gameApp/src/domain/entity/action/actionTypes.js");



class NuptialEnvironmentService extends _base_baseGameService__WEBPACK_IMPORTED_MODULE_0__.BaseGameService {

    constructor(mainEventBus, world, nuptialEnv, nuptialEnvironmentApi) {
        super(mainEventBus, world);
        this._nuptialEnv = nuptialEnv;
        this._nuptialEnvironmentApi = nuptialEnvironmentApi;
    }

    init(specieData, nuptialMales) {
        this._nuptialEnv.setSpecieData(specieData);
        this._nuptialEnv.setNuptialMales(nuptialMales);
    }

    foundColony(queenId, nuptialMaleId, nestBuildingSite, colonyName) {
        try {
            this._requestHandler(() => this._nuptialEnvironmentApi.foundColony(queenId, nuptialMaleId, nestBuildingSite, colonyName));
            return this._makeSuccessResult();
        } catch (e) {
            if (e instanceof ConflictRequestError) {
                return this._makeErrorResultConflict();
            } else if (e instanceof GenericRequestError) {
                return this._makeErrorResultUnknownErr();
            }
        }
    }

    bornNewAntara() {
        this._nuptialEnvironmentApi.bornNewAntara();
    }

    saveSpecieSchema(schema) {
        this._nuptialEnvironmentApi.saveSpecieSchema(schema);
    }

    playAction(action) {
        switch(action.type) {
            case _domain_entity_action_actionTypes__WEBPACK_IMPORTED_MODULE_1__.ACTION_TYPES.NUPTIAL_ENVIRONMENT_MALES_CHANGED:
                this._playChangedMalesAction(action);
                break;
            case _domain_entity_action_actionTypes__WEBPACK_IMPORTED_MODULE_1__.ACTION_TYPES.NUPTIAL_ENVIRONMENT_SPECIE_GENES_CHANGED:
                this._playSpecieGenesChanged(action);
                break;
            default:
                throw 'unknown type of action';
        }
    }

    _playChangedMalesAction(action) {
        this._nuptialEnv.setNuptialMales(action.males);
        this._mainEventBus.emit('nuptialMalesChanged');
    }

    _playSpecieGenesChanged(action) {
        this._mainEventBus.emit('specieChromosomesGenesChanged', action.chromosomeSpecieGenes);
    }

}



/***/ }),

/***/ "./gameApp/src/domain/service/userService.js":
/*!***************************************************!*\
  !*** ./gameApp/src/domain/service/userService.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   UserService: () => (/* binding */ UserService)
/* harmony export */ });
/* harmony import */ var _base_baseGameService__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base/baseGameService */ "./gameApp/src/domain/service/base/baseGameService.js");


class UserService extends _base_baseGameService__WEBPACK_IMPORTED_MODULE_0__.BaseGameService {

    constructor(mainEventBus, world) {
        super(mainEventBus, world);
        this._notifications = [];
    }

    setUserData(userData) {
        this._userData = userData;
    }

    verifyEmailForUser() {
        this._mainEventBus.emit('emailVerified');
    }

    initNotifications(notifications) {
        this._notifications = notifications;
    }

    getNotifications() {
        return this._notifications;
    }

    playUserAction(action) {
        this._notifications.push(action.notification);
        this._mainEventBus.emit('newNotification', action.notification);
    }

}



/***/ }),

/***/ "./gameApp/src/domain/service/worldService.js":
/*!****************************************************!*\
  !*** ./gameApp/src/domain/service/worldService.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   WorldService: () => (/* binding */ WorldService)
/* harmony export */ });
/* harmony import */ var _domain_enum_entityTypes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @domain/enum/entityTypes */ "./gameApp/src/domain/enum/entityTypes.js");


class WorldService {

    constructor(world, worldFactory, mainEventBus) {
        this._world = world;
        this._worldFactory = worldFactory;
        this._mainEventBus = mainEventBus;
        this._worldSize = null;
        this._rating = null;

        this._mainEventBus.on('entityDied', this._onEntityDied.bind(this));
    }

    get world() {
        return this._world;
    }

    setCurrentStep(currentStep, currentSeason) {
        this._world.currentStep = currentStep;
        this._world.currentSeason = currentSeason;
    }

    initRating(rating) {
        this._rating = rating;
    }

    getRating() {
        return this._rating;
    }

    playRatingAction(ratingAction) {
        this._rating = ratingAction.ratingPlaces;
        this._mainEventBus.emit('ratingUpdated');
    }

    playEntityAction(action) {
        switch(action.type) {
            case 'entity_born':
                this.giveBirthToEntity(action.actionData.entity)
                break;
            default:
                let actor = this.world.findEntityById(action.actorId);
                actor.playAction(action);
        }
    }

    playClimateAction(action) {
        this._world.climate.playAction(action);
    }

    initWorld(worldJson, step, season) {
        let entities = [];
        worldJson.entities.forEach(entityJson => { 
            let entity = this._worldFactory.buildEntity(entityJson);
            entities.push(entity);
        });
        
        let colonies = [];
        worldJson.ant_colonies.forEach(colonyJson => {
            let colony = this._worldFactory.buildAntColony(colonyJson);
            colonies.push(colony);
        });
        
        this._world.initWorld(worldJson.size, entities, colonies, worldJson.climate, step, season);
    }

    getColoniesByIds(ids) {
        let foundColonies = [];
        for (let colony of this._world.colonies) {
            if (ids.includes(colony.id)) {
                foundColonies.push(colony);
            }
        }

        return foundColonies;
    }

    giveBirthToEntity(entityJson) {
        let entity = this._worldFactory.buildEntity(entityJson);
        this._world.addEntity(entity);
        this._mainEventBus.emit('entityBorn', entity);
        switch (entity.type) {
            case _domain_enum_entityTypes__WEBPACK_IMPORTED_MODULE_0__.EntityTypes.ANT:
                this._mainEventBus.emit('antBorn', entity);
                break;
            case _domain_enum_entityTypes__WEBPACK_IMPORTED_MODULE_0__.EntityTypes.NEST:
                this._mainEventBus.emit('nestBorn', entity);
                break;
        }
    }

    _onEntityDied(entity) {
        this._world.deleteEntity(entity);
        switch (entity.type) {
            case _domain_enum_entityTypes__WEBPACK_IMPORTED_MODULE_0__.EntityTypes.ANT:
                this._mainEventBus.emit('antDied', entity);
                break;
            case _domain_enum_entityTypes__WEBPACK_IMPORTED_MODULE_0__.EntityTypes.NEST:
                this._mainEventBus.emit('nestDied', entity);
                break;
        }
    }

}



/***/ }),

/***/ "./gameApp/src/domain/worker/domainWorker.js":
/*!***************************************************!*\
  !*** ./gameApp/src/domain/worker/domainWorker.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DomainWorker: () => (/* binding */ DomainWorker)
/* harmony export */ });
/* harmony import */ var _domain_consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @domain/consts */ "./gameApp/src/domain/consts.js");


class DomainWorker {

    constructor(eventBus, entitySerializer, viewPointManager, requester, myStateCollector, worldStepEventsCollector, services) {
        this._eventBus = eventBus;
        this._entitySerializer = entitySerializer;
        this._viewPointManager = viewPointManager;
        this._requester = requester;

        this._worldService = services.worldService;
        this._accountService = services.accountService;
        this._colonyService = services.colonyService;
        this._userService = services.userService;
        this._nuptialEnvironmentService = services.nuptialEnvironmentService;
        this._nestService = services.nestService;
        this._antService = services.antService;
        this._messageHandlerService = services.messageHandlerService;

        this._myStateCollector = myStateCollector;
        this._worldStepEventsCollector = worldStepEventsCollector;

        this._listenIncomeMessages();

        this._entityActionAnimRequests = [];
        this._chunkMigrations = [];
        
    }

    _sendStepPack() {
        let visibleChunkIds = this._viewPointManager.getVisibleChunkIds();

        let entityAnimations = [];
        for (let entityActionAR of this._entityActionAnimRequests) {
            if (visibleChunkIds.includes(entityActionAR.chunkId)) {
                entityAnimations.push(entityActionAR);
            }
        }
        this._entityActionAnimRequests = [];

        let viewRectMigrations = [];
        for (let chunkMigration of this._chunkMigrations) {
            let entity = chunkMigration.entity;
            let isVisibleBefore = visibleChunkIds.includes(chunkMigration.prevChunkId);
            let isVisibleAfter = visibleChunkIds.includes(entity.chunkId);
            if (isVisibleBefore && !isVisibleAfter) {
                viewRectMigrations.push({ isMigrationIntoViewRect: false, entityId: entity.id  });
            } else if (!isVisibleBefore && isVisibleAfter) {
                viewRectMigrations.push({ isMigrationIntoViewRect: true, entity: this._entitySerializer.serializeAnyEntity(entity) });
            }
        }
        this._chunkMigrations = [];

        let myStatePatch = this._myStateCollector.pullPatch();

        let stepPack = {
            step: this._worldService.world.currentStep,
            season: this._worldService.world.currentSeason,
            dailyTemperature: this._worldService.world.climate.dailyTemperature,
            entityAnimations,
            viewRectMigrations,
            myStatePatch,
            worldEvents: this._worldStepEventsCollector.pullStepEvents()
        }
        
        this._sendMessage('stepPack', stepPack);
    }

    _handleCommand(command) {
        switch (command.type) {
            case 'init':
                this._handleInitCommand(command)
                break;
            // case 'findMyFirstNest':
            //     this._handleFindMyFirstNestCommand(command)
            //     break;
            case 'changePlayerViewPoint':
                this._handleChangePlayerViewPointCommand(command)
                break;
            case 'getEntitiesInCurrentViewRect':
                this._handleGetEntitiesInCurrentViewRectCommand(command)
                break;
            case 'getChunkShapesDebug':
                this._handleGetChunkShapesDebugCommand(command)
                break;
            case 'getEntityDataById':
                this._handleGetEntityDataByIdCommand(command)
                break;
            case 'getEnemyColonyData':
                this._handleGetEnemyColonyDataCommand(command)
                break;
            case 'buildMarker':
                this._handleBuildMarkerCommand(command)
                break;
            case 'saveSpecieSchema':
                this._handleSaveSpecieSchemaCommand(command)
                break;
            case 'bornNewAntara':
                this._handleBornNewAntaraCommand(command)
                break;
            case 'layEggInNest':
                this._handleLayEggInNestCommand(command)
                break;
            case 'changeEggNameInNest':
                this._handleChangeEggNameInNestCommand(command)
                break;
            case 'changeEggCasteInNest':
                this._handleChangeEggCasteInNestCommand(command)
                break;
            case 'moveEggToLarvaInNest':
                this._handleMoveEggToLarvaInNestCommand(command)
                break;
            case 'deleteEggInNest':
                this._handleDeleteEggInNestCommand(command)
                break;
            case 'deleteLarvaInNest':
                this._handleDeleteLarvaInNestCommand(command)
                break;
            case 'renameNest':
                this._handleRenameNestCommand(command)
                break;
            case 'findClosestBugCorpseNearNest':
                this._handleFindClosestBugCorpseNearNestCommand(command)
                break;
            case 'antRelocate':
                this._handleAntRelocateCommand(command)
                break;
            case 'antChangeGuardianBehavior':
                this._handleAntChangeGuardianBehaviorCommand(command)
                break;
            case 'antToggleCooperativeBehavior':
                this._handleAntToggleCooperativeBehaviorCommand(command)
                break;
            case 'antFlyNuptialFlight':
                this._handleAntFlyNuptialFlightCommand(command)
                break;
            case 'getRaidableArea':
                this._handleGetRaidableAreaCommand(command)
                break;
            case 'getNestBuildableArea':
                this._handleGetNestBuildableAreaCommand(command)
                break;
            case 'validateBuildingNewNestPosition':
                this._handleValidateBuildingNewNestPositionCommand(command)
                break;
            case 'validateBreedingQueen':
                this._handleValidateBreedingQueenCommand(command)
                break;
            case 'validateNewNestOperationConditions':
                this._handleValidateNewNestOperationConditionsCommand(command)
                break;
            case 'validateBuildingSubNestPosition':
                this._handleValidateBuildingSubNestPositionCommand(command)
                break;
            case 'validateDestroyNestOperationConditions':
                this._handleValidateDestroyNestOperationConditionsCommand(command)
                break;
            case 'validateNestToDestroy':
                this._handleValidateNestToDestroyCommand(command)
                break;
            case 'validatePillageNestOperationConditions':
                this._handleValidatePillageNestOperationConditionsCommand(command)
                break;
            case 'validateNestToPillage':
                this._handleValidateNestToPillageCommand(command)
                break;
            case 'validateLayingEggInNest':
                this._handleValidateLayingEggInNestCommand(command)
                break;
            case 'foundColony':
                this._handleFoundColonyCommand(command)
                break;
            case 'stopOperation':
                this._handleStopOperationCommand(command)
                break;
            case 'buildNewSubNestOperation':
                this._handleBuildNewSubNestOperationCommand(command)
                break;
            case 'destroyNestOperation':
                this._handleDestroyNestOperationCommand(command)
                break;
            case 'pillageNestOperation':
                this._handlePillageNestOperationCommand(command)
                break;
            case 'transportFoodOperation':
                this._handleTransportFoodOperationCommand(command)
                break;
            case 'buildFortificationsOpearation':
                this._handleBuildFortificationsOpearationCommand(command)
                break;
            case 'bringBugOpearation':
                this._handleBringBugOpearationCommand(command)
                break;
            case 'logout':
                this._handleLogoutCommand(command)
                break;
            case 'changeUsername':
                this._handleChangeUsernameCommand(command)
                break;
            case 'changeEmail':
                this._handleChangeEmailCommand(command)
                break;
            case 'verifyEmailRequest':
                this._handleVerifyEmailRequestCommand(command)
                break;
            case 'validatePassword':
                this._handleValidatePasswordCommand(command)
                break;
            case 'changePassword':
                this._handleChangePasswordCommand(command)
                break;
            default:
                throw 'unknown type of command';
        }
    }

    _handleInitCommand(command) {
        let data = command.data;
        let userData = data.userData;
        let mainSocketURL = data.mainSocketURL;
        let csrftoken = data.csrftoken;

        this._userService.setUserData(userData);
        this._entitySerializer.setUserData(userData);
        this._requester.setCsrfToken(csrftoken);
        this._myStateCollector.setUserData(userData);

        this._eventBus.once('initStepDone', () => {
            this._viewPointManager.setChunks(this._worldService.world.chunks);
            this._listenWorldActivity();

            let initPack = {
                currentStep: this._worldService.world.currentStep,
                currentSeason: this._worldService.world.currentSeason,
                dailyTemperature: this._worldService.world.climate.dailyTemperature,
                worldSize: this._worldService.world.size,
                consts: _domain_consts__WEBPACK_IMPORTED_MODULE_0__.CONSTS,
                myState: this._myStateCollector.getMyState(),
                rating: this._worldService.getRating()
            };
            this._sendCommandResult(command.id, initPack);
        });

        this._messageHandlerService.connect(mainSocketURL);
    }

    _listenWorldActivity() {
        this._eventBus.on('entityActionAnimationRequest', this._onEntityActionAnimationRequest.bind(this));
        this._eventBus.on('entityChunkMigration', this._onEntityChunkMigration.bind(this));
        this._eventBus.on('entityAddedToChunks', this._onEntityAddedToChunks.bind(this));
        this._eventBus.on('stepDone', this._onStepDone.bind(this));

        this._eventBus.on('emailVerified', this._onEmailVerified.bind(this));
        this._eventBus.on('ratingUpdated', this._onRatingUpdated.bind(this));
    }

    _handleChangePlayerViewPointCommand(command) {
        let data = command.data;
        let isSomeChunkVisibilityChanged = this._viewPointManager.updateChunksVisibleStateForViewRect(data.viewRect);
        let visibleEntities = [];
        if (isSomeChunkVisibilityChanged) {
            visibleEntities = this._viewPointManager.getEntitiesFromVisibleChunks();
            let serializedEntities = [];
            for (let entity of visibleEntities) {
                serializedEntities.push(this._entitySerializer.serializeAnyEntity(entity));
            }
            this._sendCommandResult(command.id, { isSomeChunkVisibilityChanged: true, entities: serializedEntities });
        } else {
            this._sendCommandResult(command.id, { isSomeChunkVisibilityChanged: false, entities: [] });
        }   
    }

    _handleGetEntitiesInCurrentViewRectCommand(command) {
        let visibleEntities = this._viewPointManager.getEntitiesFromVisibleChunks();
        let serializedEntities = this._entitySerializer.serializeAnyEntities(visibleEntities);
        this._sendCommandResult(command.id, serializedEntities);
    }

    _handleGetChunkShapesDebugCommand(command) {
        let chunkShapes = [];
        for (let chunk of Object.values(this._viewPointManager.chunks)) {
            chunkShapes.push(chunk.shape);
        }
        
        this._sendCommandResult(command.id, chunkShapes);
    }

    _handleGetEntityDataByIdCommand(command) {
        let data = command.data;
        let entityId = data.id;
        let entity = this._worldService.world.findEntityById(entityId);
        let entityData = entity ? this._entitySerializer.serializeAnyEntity(entity) : null;
        this._sendCommandResult(command.id, entityData);
    }

    _handleGetEnemyColonyDataCommand(command) {
        let data = command.data;
        let colonyId = data.colonyId;
        let result = this._colonyService.getEnemyColonyData(colonyId);
        this._sendCommandResult(command.id, result);
    }

    _handleBuildMarkerCommand(command) {
        let data = command.data;
        let type = data.type;
        let point = data.point;
        let params = data.params;
        let marker = this._colonyService.buildMarker(type, point, params);
        this._sendCommandResult(command.id, marker);
    }

    _handleSaveSpecieSchemaCommand(command) {
        let data = command.data;
        let specieSchema = data.specieSchema;
        this._nuptialEnvironmentService.saveSpecieSchema(specieSchema);
        this._sendCommandResult(command.id, true);
    }

    async _handleBornNewAntaraCommand(command) {
        let data = command.data;
        await this._nuptialEnvironmentService.bornNewAntara();
        this._sendCommandResult(command.id, true);
    }

    async _handleLayEggInNestCommand(command) {
        let data = command.data;
        let nestId = data.nestId;
        let name = data.name;
        let isFertilized = data.isFertilized;
        let result = await this._nestService.layEggInNest(nestId, name, isFertilized);
        this._sendCommandResult(command.id, result);
    }

    async _handleChangeEggNameInNestCommand(command) {
        let data = command.data;
        let nestId = data.nestId;
        let eggId = data.eggId;
        let name = data.name;
        await this._nestService.changeEggNameInNest(nestId, eggId, name);
        this._sendCommandResult(command.id, true);
    }

    async _handleChangeEggCasteInNestCommand(command) {
        let data = command.data;
        let nestId = data.nestId;
        let eggId = data.eggId;
        let antType = data.antType;
        await this._nestService.changeEggCasteInNest(nestId, eggId, antType);
        this._sendCommandResult(command.id, true);
    }

    async _handleMoveEggToLarvaInNestCommand(command) {
        let data = command.data;
        let nestId = data.nestId;
        let eggId = data.eggId;
        let result = await this._nestService.moveEggToLarvaInNest(nestId, eggId);
        this._sendCommandResult(command.id, result);
    }

    async _handleDeleteEggInNestCommand(command) {
        let data = command.data;
        let nestId = data.nestId;
        let eggId = data.eggId;
        await this._nestService.deleteEggInNest(nestId, eggId);
        this._sendCommandResult(command.id, true);
    }

    async _handleDeleteLarvaInNestCommand(command) {
        let data = command.data;
        let nestId = data.nestId;
        let larvaId = data.larvaId;
        await this._nestService.deleteLarvaInNest(nestId, larvaId);
        this._sendCommandResult(command.id, true);
    }

    async _handleRenameNestCommand(command) {
        let data = command.data;
        let nestId = data.nestId;
        let name = data.name;
        await this._nestService.renameNest(nestId, name);
        this._sendCommandResult(command.id, true);
    }

    async _handleFindClosestBugCorpseNearNestCommand(command) {
        let data = command.data;
        let nestId = data.nestId;
        let bugcorpseData = await this._colonyService.findClosestBugCorpseNearNest(nestId);
        let serializedBugCorpse = bugcorpseData ? this._entitySerializer.serializeAnyEntity(bugcorpseData) : null;
        this._sendCommandResult(command.id, serializedBugCorpse);
    }

    async _handleAntRelocateCommand(command) {
        let data = command.data;
        let antId = data.antId;
        let homeNestId = data.homeNestId;
        await this._antService.antRelocate(antId, homeNestId);
        this._sendCommandResult(command.id, true);
    }

    async _handleAntChangeGuardianBehaviorCommand(command) {
        let data = command.data;
        let antId = data.antId;
        let behaviorValue = data.behaviorValue;
        await this._antService.antChangeGuardianBehavior(antId, behaviorValue);
        this._sendCommandResult(command.id, true);
    }

    async _handleAntToggleCooperativeBehaviorCommand(command) {
        let data = command.data;
        let antId = data.antId;
        let isCooperative = data.isCooperative;
        await this._antService.antToggleCooperativeBehavior(antId, isCooperative);
        this._sendCommandResult(command.id, true);
    }

    async _handleAntFlyNuptialFlightCommand(command) {
        let data = command.data;
        let antId = data.antId;
        await this._antService.antFlyNuptialFlight(antId);
        this._sendCommandResult(command.id, true);
    }

    _handleGetRaidableAreaCommand(command) {
        let data = command.data;
        let raidingColonyId = data.raidingColonyId;
        let raidAreaCenter = data.raidAreaCenter;
        let chunkIds = this._viewPointManager.getVisibleChunkIds();
        let result = this._colonyService.getRaidableArea(raidingColonyId, raidAreaCenter, chunkIds);
        this._sendCommandResult(command.id, result);
    }

    _handleGetNestBuildableAreaCommand(command) {
        let data = command.data;
        let mainNestPosition = data.mainNestPosition;
        let chunkIds = this._viewPointManager.getVisibleChunkIds();
        let result = this._colonyService.getNestBuildableArea(mainNestPosition, chunkIds);
        this._sendCommandResult(command.id, result);
    }

    _handleValidateBuildingNewNestPositionCommand(command) {
        let data = command.data;
        let position = data.position;
        let errId = this._colonyService.validateBuildingNewNestPosition(position);
        this._sendCommandResult(command.id, errId);
    }

    _handleValidateBreedingQueenCommand(command) {
        let data = command.data;
        let queenId = data.queenId;
        let errId = this._colonyService.validateBreedingQueen(queenId);
        this._sendCommandResult(command.id, errId);
    }

    _handleValidateNewNestOperationConditionsCommand(command) {
        let data = command.data;
        let err = this._colonyService.validateNewNestOperationConditions(data.colonyId);
        this._sendCommandResult(command.id, err);
    }

    _handleValidateBuildingSubNestPositionCommand(command) {
        let data = command.data;
        let position = data.position;
        let err = this._colonyService.validateBuildingSubNestPosition(position);
        this._sendCommandResult(command.id, err);
    }

    _handleValidateDestroyNestOperationConditionsCommand(command) {
        let data = command.data;
        let err = this._colonyService.validateDestroyNestOperationConditions(data.colonyId);
        this._sendCommandResult(command.id, err);
    }

    _handleValidateNestToDestroyCommand(command) {
        let data = command.data;
        let nestId = data.nestId;
        let err = this._colonyService.validateNestToDestroy(nestId);
        this._sendCommandResult(command.id, err);
    }

    _handleValidatePillageNestOperationConditionsCommand(command) {
        let data = command.data;
        let colonyId = data.colonyId;
        let err = this._colonyService.validatePillageNestOperationConditions(colonyId);
        this._sendCommandResult(command.id, err);
    }

    _handleValidateNestToPillageCommand(command) {
        let data = command.data;
        let nestId = data.nestId;
        let err = this._colonyService.validateNestToPillage(nestId);
        this._sendCommandResult(command.id, err);
    }

    _handleValidateLayingEggInNestCommand(command) {
        let data = command.data;
        let nestId = data.nestId;
        let err = this._nestService.validateLayingEggInNest(nestId);
        this._sendCommandResult(command.id, err);
    }

    async _handleFoundColonyCommand(command) {
        let data = command.data;
        let queenId = data.queenId;
        let nuptialMaleId = data.nuptialMaleId;
        let nestBuildingSite = data.nestBuildingSite;
        let colonyName = data.colonyName;
        let result = await this._nuptialEnvironmentService.foundColony(queenId, nuptialMaleId, nestBuildingSite, colonyName);
        this._sendCommandResult(command.id, result);
    }

    async _handleStopOperationCommand(command) {
        let data = command.data;
        let colonyId = data.colonyId;
        let operationId = data.operationId;
        await this._colonyService.stopOperation(colonyId, operationId);
        this._sendCommandResult(command.id, true);
    }

    async _handleBuildNewSubNestOperationCommand(command) {
        let data = command.data;
        let performingColonyId = data.performingColonyId;
        let buildingSite = data.buildingSite;
        let workersCount = data.workersCount;
        let warriorsCount = data.warriorsCount;
        let nestName = data.nestName;
        let result = await this._colonyService.buildNewSubNestOperation(performingColonyId, buildingSite, workersCount, warriorsCount, nestName);
        this._sendCommandResult(command.id, result);
    }

    async _handleDestroyNestOperationCommand(command) {
        let data = command.data;
        let performingColonyId = data.performingColonyId;
        let nestId = data.nestId;
        let workersCount = data.workersCount;
        let warriorsCount = data.warriorsCount;
        let result = await this._colonyService.destroyNestOperation(performingColonyId, warriorsCount, workersCount, nestId);
        this._sendCommandResult(command.id, result);
    }

    async _handlePillageNestOperationCommand(command) {
        let data = command.data;
        let performingColonyId = data.performingColonyId;
        let pillagingNestId = data.pillagingNestId;
        let nestForLootId = data.nestForLootId;
        let workersCount = data.workersCount;
        let warriorsCount = data.warriorsCount;
        let result = await this._colonyService.pillageNestOperation(performingColonyId, pillagingNestId, nestForLootId, warriorsCount, workersCount);
        this._sendCommandResult(command.id, result);
    }

    async _handleTransportFoodOperationCommand(command) {
        let data = command.data;
        let performingColonyId = data.performingColonyId;
        let fromNestId = data.fromNestId;
        let toNestId = data.toNestId;
        let workersCount = data.workersCount;
        let warriorsCount = data.warriorsCount;
        let result = await this._colonyService.transportFoodOperation(performingColonyId, fromNestId, toNestId, workersCount, warriorsCount);
        this._sendCommandResult(command.id, result);
    }

    async _handleBuildFortificationsOpearationCommand(command) {
        let data = command.data;
        let performingColonyId = data.performingColonyId;
        let nestId = data.nestId;
        let workersCount = data.workersCount;
        let result = await this._colonyService.buildFortificationsOpearation(performingColonyId, nestId, workersCount);
        this._sendCommandResult(command.id, result);
    }

    async _handleBringBugOpearationCommand(command) {
        let data = command.data;
        let performingColonyId = data.performingColonyId;
        let nestId = data.nestId;
        let result = await this._colonyService.bringBugOpearation(performingColonyId, nestId);
        this._sendCommandResult(command.id, result);
    }

    async _handleLogoutCommand(command) {
        let data = command.data;
        let redirectUrl = await this._accountService.logout();
        this._sendCommandResult(command.id, redirectUrl);
    }

    async _handleChangeUsernameCommand(command) {
        let data = command.data;
        let newUsername = data.newUsername;
        let result = await this._accountService.changeUsername(newUsername);
        this._sendCommandResult(command.id, result);
    }

    async _handleChangeEmailCommand(command) {
        let data = command.data;
        let newEmail = data.newEmail;
        let password = data.password;
        let result = await this._accountService.changeEmail(newEmail, password);
        this._sendCommandResult(command.id, result);
    }

    async _handleVerifyEmailRequestCommand(command) {
        this._accountService.verifyEmailRequest();
    }

    async _handleValidatePasswordCommand(command) {
        let data = command.data;
        let password = data.password;
        let result = this._accountService.validatePassword(password);
        this._sendCommandResult(command.id, result);
    }

    async _handleChangePasswordCommand(command) {
        let data = command.data;
        let newPassword = data.newPassword;
        let oldPassword = data.oldPassword;
        let result = await this._accountService.changePassword(newPassword, oldPassword);
        this._sendCommandResult(command.id, result);
    }

    _sendCommandResult(id, result) {
        this._sendMessage('commandResult', {
            id,
            result
        });
    }

    _sendEvent(type, data) {
        this._sendMessage('event', {
            type,
            data
        });
    }

    _sendMessage(type, data) {
        postMessage({
            type,
            data
        });
    }

    _listenIncomeMessages() {
        onmessage = (e) => {
            let msg = e.data;
            switch (msg.type) {
                case 'command':
                    this._handleCommand(msg.data);
                    break;
                default:
                    throw 'unknown type of message';
            }
        }
    }

    _onStepDone() {
        this._sendStepPack();
    }

    _onEntityActionAnimationRequest(chunkId, entityId, actionType, animationParams) {
        this._entityActionAnimRequests.push({
            chunkId, entityId, actionType, animationParams
        });
    }

    _onEntityChunkMigration(entity, prevChunkId) {
        this._chunkMigrations.push({
            entity, prevChunkId
        });
    }

    _onEntityAddedToChunks(entity) {
        this._chunkMigrations.push({
            entity, 
            prevChunkId: null
        });
    }

    _onEmailVerified() {
        this._sendEvent('emailVerified');
    }

    _onRatingUpdated() {
        this._sendEvent('ratingUpdated', { 
            rating: this._worldService.getRating() 
        });
    }

}



/***/ }),

/***/ "./gameApp/src/domain/worker/myStateCollector.js":
/*!*******************************************************!*\
  !*** ./gameApp/src/domain/worker/myStateCollector.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MyStateCollector: () => (/* binding */ MyStateCollector)
/* harmony export */ });
class MyStateCollector {

    constructor(eventBus, world, nuptialEnv, userService, entitySerializer, colonySerializer) {
        this._eventBus = eventBus;
        this._world = world;
        this._nuptialEnv = nuptialEnv;
        this._userService = userService;
        this._entitySerializer = entitySerializer;
        this._colonySerializer = colonySerializer;

        this._resetMyStatePatch();

        this._eventBus.once('initStepDone', this._onInitStepDone.bind(this));
        this._eventBus.on('nestBorn', this._onNestBorn.bind(this));
        this._eventBus.on('nestDied', this._onNestDied.bind(this));
        this._eventBus.on('antBorn', this._onAntBorn.bind(this));
        this._eventBus.on('antDied', this._onAntDied.bind(this));
        this._eventBus.on('colonyBorn', this._onColonyBorn.bind(this));
        this._eventBus.on('colonyDied', this._onColonyDied.bind(this));
        this._eventBus.on('specieChromosomesGenesChanged', this._onSpecieChromosomesSpecieGenesChanged.bind(this));
        this._eventBus.on('nuptialMalesChanged', this._onNuptialMalesChanged.bind(this));
        this._eventBus.on('newNotification', this._onNewNotification.bind(this));
    }

    setUserData(userData) {
        this._userData = userData;
    }

    getMyState() {
        let colonies = this._world.findColoniesByOwnerId(this._userData.id);
        let nests = this._world.findNestsByOwner(this._userData.id);
        let ants = this._world.findAntsByOwnerId(this._userData.id);
        let queenInNuptialFlightIds = ants.filter(a => a.isInNuptialFlight).map(a => a.id);

        return {
            colonies: this._colonySerializer.serializeColonies(colonies),
            nests: this._entitySerializer.serializeNests(nests),
            ants: this._entitySerializer.serializeAnts(ants),
            nuptialEnvironment: {
                queens: queenInNuptialFlightIds,
                males: this._nuptialEnv.nuptialMales,
                specie: this._nuptialEnv.specieData
            },
            notificationsContainer: {
                notifications: this._userService.getNotifications()
            }
        }
    }

    pullPatch() {
        let patch = this._myStatePatch;
        this._resetMyStatePatch();
        return patch;
    }

    _resetMyStatePatch() {
        this._myStatePatch = {
            nests: {
                add: [],
                update: [],
                remove: []
            },
            ants: {
                add: [],
                update: [],
                remove: []
            },
            colonies: {
                add: [],
                update: [],
                remove: []
            },
            nuptialEnvironment: {
                props: {},
                queens: {
                    add: [],
                    remove: []
                },
                specie: {
                    specieChromosomes: {
                        update: []
                    }
                }
            },
            notificationsContainer: {
                add: []
            }
        };
    }

    _onInitStepDone() {
        this._listenMyNests();
        this._listenAnts();
        this._listenColonies();
    }

    _listenColonies() {
        let colonies = this._world.findColoniesByOwnerId(this._userData.id);
        for (let colony of colonies) {
            this._listenColony(colony);
        }
    }

    _listenColony(colony) {
        colony.events.on('addedOperation', (newOperation) => {
            this._pushOperationAddToColonyUpdatePatch(colony.id, newOperation);
        });
        colony.events.on('operationChanged', (operation) => {
            this._pushOperationPropsToOperationUpdatePatch(colony.id, operation.id, {
                status: operation.status,
                hiredWarriorsCount: operation.hiredWarriorsCount,
                hiredWorkersCount: operation.hiredWorkersCount
            });
        });
        colony.events.on('operationDeleted', (operationId) => {
            this._pushOperationRemoveToColonyUpdatePatch(colony.id, operationId);
        });
        colony.events.on('enemiesChanged', () => {
            this._pushEnemiesToColonyUpdatePatch(colony.id, colony.enemies);
        });
    }

    _pushEnemiesToColonyUpdatePatch(colonyId, enemies) {
        let patch = this._getColonyUpdatePatch(colonyId);
        patch.props.enemies = enemies;
    }

    _pushOperationAddToColonyUpdatePatch(colonyId, newOperation) {
        let patch = this._getColonyUpdatePatch(colonyId);
        let serializedOperation = this._colonySerializer.serializeOperation(newOperation);
        patch.operations.add.push(serializedOperation);
    }

    _pushOperationPropsToOperationUpdatePatch(colonyId, operationId, props) {
        let operationUpdatePatch = this._getOperationUpdatePatch(colonyId, operationId);
        Object.assign(operationUpdatePatch.props, props);
    }

    _pushOperationRemoveToColonyUpdatePatch(colonyId, operationId) {
        let patch = this._getColonyUpdatePatch(colonyId);
        patch.operations.remove.push(operationId);
    }

    _getColonyUpdatePatch(colonyId) {
        for (let colonyUpdatePatch of this._myStatePatch.colonies.update) {
            if (colonyUpdatePatch.id == colonyId) {
                return colonyUpdatePatch;
            }
        }

        let colonyUpdatePatch = { 
            id: colonyId, 
            props: {}, 
            operations: {
                add: [],
                update: [],
                remove: []
            }
        };
        this._myStatePatch.colonies.update.push(colonyUpdatePatch);
        return colonyUpdatePatch;
    }

    _getOperationUpdatePatch(colonyId, operationId) {
        let colonyUpdatePatch = this._getColonyUpdatePatch(colonyId);
        for (let operationUpdatePatch of colonyUpdatePatch.operations.update) {
            if (operationUpdatePatch.id == operationId) {
                return operationUpdatePatch;
            }
        }

        let operationUpdatePatch = {
            id: operationId,
            props: {}
        }
        colonyUpdatePatch.operations.update.push(operationUpdatePatch);
        return operationUpdatePatch;
    }

    _listenAnts() {
        let ants = this._world.findAntsByOwnerId(this._userData.id);
        for (let ant of ants) {
            this._listenAnt(ant);
        }
    }

    _listenAnt(ant) {
        ant.events.on('homeNestChanged', () => {
            this._pushAntPropsToAntUpdatePatch(ant.id, {
                homeNestId: ant.homeNestId
            });
        });
        ant.events.on('currentActivityChanged', () => {
            this._pushAntPropsToAntUpdatePatch(ant.id, {
                currentActivity: ant.currentActivity
            });
        });
        ant.events.on('isHungryChanged', () => {
            this._pushAntPropsToAntUpdatePatch(ant.id, {
                isHungry: ant.isHungry
            });
        });
        ant.events.on('guardianBehaviorChanged', () => {
            this._pushAntPropsToAntUpdatePatch(ant.id, {
                guardianBehavior: ant.guardianBehavior
            });
        });
        ant.events.on('isCooperativeBehaviorChanged', () => {
            this._pushAntPropsToAntUpdatePatch(ant.id, {
                isCooperativeBehavior: ant.isCooperativeBehavior
            });
        });
        ant.events.on('isInNuptialFlightChanged', () => {
            if (ant.isInNuptialFlight) {
                this._pushQueenAntToNuptialEnvironment(ant.id);
            } else {
                this._pullQueenAntFromNuptialEnvironment(ant.id);
            }
        });
        ant.events.on('fromColonyChanged', () => {
            this._pushAntPropsToAntUpdatePatch(ant.id, {
                fromColony: ant.fromColony
            });
        });
        ant.events.on('gotFertilized', () => {
            this._pushAntPropsToAntUpdatePatch(ant.id, {
                canFlyNuptialFlight: ant.canFlyNuptialFlight,
                isQueenOfColony: ant.isQueenOfColony,
                breedingMaleGenome: this._entitySerializer.serializeGenome(ant.breedingMaleGenome),
            });
        });
    }

    _pushQueenAntToNuptialEnvironment(antId) {
        this._myStatePatch.nuptialEnvironment.queens.add.push(antId);
    }

    _pullQueenAntFromNuptialEnvironment(antId) {
        this._myStatePatch.nuptialEnvironment.queens.remove.push(antId);
    }

    _pushAntPropsToAntUpdatePatch(antId, props) {
        let antUpdatePatch = this._getAntUpdatePatch(antId);
        Object.assign(antUpdatePatch.props, props);
    }

    _getAntUpdatePatch(antId) {
        for (let antPatch of this._myStatePatch.ants.update) {
            if (antPatch.id == antId) {
                return antPatch;
            }
        }

        let antUpdatePatch = { 
            id: antId, 
            props: {}, 
        };
        this._myStatePatch.ants.update.push(antUpdatePatch);
        return antUpdatePatch;
    }

    _listenMyNests() {
        let nests = this._world.findNestsByOwner(this._userData.id);
        for (let nest of nests) {
            this._listenNest(nest);
        }
    }

    _listenNest(nest) {
        nest.events.on('storedCaloriesChanged', () => {
            this._pushNestPropsToNestUpdatePatch(nest.id, { storedCalories: nest.storedCalories });
        });
        nest.events.on('nameChanged', () => {
            this._pushNestPropsToNestUpdatePatch(nest.id, { name: nest.name });
        });
        nest.events.on('eggAdded', (egg) => {
            this._pushEggAddToNestUpdatePatch(nest.id, egg);
        });
        nest.events.on('eggUpdated', (eggId, props) => {
            this._pushEggPropsToEggUpdatePatch(nest.id, eggId, props);
        });
        nest.events.on('eggRemoved', (eggId) => {
            this._pushEggRemoveToNestUpdatePatch(nest.id, eggId);
        });
        nest.events.on('larvaAdded', (larva) => {
            this._pushLarvaAddToNestUpdatePatch(nest.id, larva);
        });
        nest.events.on('larvaUpdated', (larvaId, props) => {
            this._pushLarvaPropsToLarvaUpdatePatch(nest.id, larvaId, props);
        });
        nest.events.on('larvaRemoved', (larvaId) => {
            this._pushLarvaRemoveToNestUpdatePatch(nest.id, larvaId);
        });

    }

    _pushLarvaAddToNestUpdatePatch(nestId, newLarva) {
        let patch = this._getNestUpdatePatch(nestId);
        let serializedLarva = this._entitySerializer.serializeLarva(newLarva);
        patch.larvae.add.push(serializedLarva);
    }

    _pushLarvaPropsToLarvaUpdatePatch(nestId, larvaId, props) {
        let larvaPatch = this._getLarvaUpdatePatch(nestId, larvaId);
        Object.assign(larvaPatch.props, props);
    }

    _pushLarvaRemoveToNestUpdatePatch(nestId, larvaId) {
        let nestPatch = this._getNestUpdatePatch(nestId);
        nestPatch.larvae.remove.push(larvaId);
    }

    _pushEggAddToNestUpdatePatch(nestId, newEgg) {
        let patch = this._getNestUpdatePatch(nestId);
        let serializedEgg = this._entitySerializer.serializeEgg(newEgg);
        patch.eggs.add.push(serializedEgg);
    }

    _pushEggPropsToEggUpdatePatch(nestId, eggId, props) {
        let eggPatch = this._getEggUpdatePatch(nestId, eggId);
        Object.assign(eggPatch.props, props);
    }

    _pushEggRemoveToNestUpdatePatch(nestId, eggId) {
        let nestPatch = this._getNestUpdatePatch(nestId);
        nestPatch.eggs.remove.push(eggId);
    }

    _pushNestPropsToNestUpdatePatch(nestId, props) {
        let patch = this._getNestUpdatePatch(nestId);
        Object.assign(patch.props, props);
    }

    _getNestUpdatePatch(nestId) {
        for (let nestPatch of this._myStatePatch.nests.update) {
            if (nestPatch.id == nestId) {
                return nestPatch;
            }
        }

        let nestUpdatePatch = { 
            id: nestId, 
            props: {}, 
            eggs: {
                add: [],
                update: [],
                remove: []
            },
            larvae: {
                add: [],
                update: [],
                remove: []
            }
        };
        this._myStatePatch.nests.update.push(nestUpdatePatch);
        return nestUpdatePatch;
    }

    _getEggUpdatePatch(nestId, eggId) {
        let nestUpdatePatch = this._getNestUpdatePatch(nestId);
        for (let eggUpdatePatch of nestUpdatePatch.eggs.update) {
            if (eggUpdatePatch.id == eggId) {
                return eggUpdatePatch;
            }
        }

        let eggUpdatePatch = {
            id: eggId,
            props: {}
        }
        nestUpdatePatch.eggs.update.push(eggUpdatePatch);
        return eggUpdatePatch;
    }

    _getLarvaUpdatePatch(nestId, larvaId) {
        let nestUpdatePatch = this._getNestUpdatePatch(nestId);
        for (let larvaUpdatePatch of nestUpdatePatch.larvae.update) {
            if (larvaUpdatePatch.id == larvaId) {
                return larvaUpdatePatch;
            }
        }

        let larvaUpdatePatch = {
            id: larvaId,
            props: {}
        }
        nestUpdatePatch.larvae.update.push(larvaUpdatePatch);
        return larvaUpdatePatch;
    }

    _isEntityMy(entity) {
        return entity.ownerId == this._userData.id;
    }

    _isColonyMy(colony) {
        return colony.ownerId == this._userData.id;
    }

    _onColonyBorn(colony) {
        if (this._isColonyMy(colony)) {
            let serializedColony = this._colonySerializer.serializeColony(colony);
            this._myStatePatch.colonies.add.push(serializedColony);
            this._listenColony(colony);
        }
    }

    _onColonyDied(colony) {
        if (this._isColonyMy(colony)) {
            this._myStatePatch.colonies.remove.push(colony.id);
        }
    }

    _onAntBorn(ant) {
        if (this._isEntityMy(ant)) {
            let serializedAnt = this._entitySerializer.serializeAnt(ant);
            this._myStatePatch.ants.add.push(serializedAnt);
            this._listenAnt(ant);
        }
    }

    _onAntDied(ant) {
        if (this._isEntityMy(ant)) {
            this._myStatePatch.ants.remove.push(ant.id);
            if (ant.isInNuptialFlight) {
                this._pullQueenAntFromNuptialEnvironment(ant.id);
            }
        }
    }

    _onNestBorn(nest) {
        if (this._isEntityMy(nest)) {
            let serializedNest = this._entitySerializer.serializeNest(nest);
            this._myStatePatch.nests.add.push(serializedNest);
            this._listenNest(nest);
        }
    }

    _onNestDied(nest) {
        if (this._isEntityMy(nest)) {
            this._myStatePatch.nests.remove.push(nest.id);
        }
    }

    _onNuptialMalesChanged() {
        this._myStatePatch.nuptialEnvironment.props.males = this._nuptialEnv.nuptialMales;
    }

    _onSpecieChromosomesSpecieGenesChanged(specieChromosomeSpecieGenesChange) {
        let specieUpdatePatch = this._myStatePatch.nuptialEnvironment.specie;
        for (let specieChromosomeType in specieChromosomeSpecieGenesChange) {
            let specieGenes = specieChromosomeSpecieGenesChange[specieChromosomeType]
            let specieChromosomeUpdatePatch = {
                type: specieChromosomeType,
                props: {
                    specieGenes 
                }
            };
            specieUpdatePatch.specieChromosomes.update.push(specieChromosomeUpdatePatch);
        }
    }

    _onNewNotification(notification) {
        this._myStatePatch.notificationsContainer.add.push(notification);
    }

}



/***/ }),

/***/ "./gameApp/src/domain/worker/serializers/colonySerializer.js":
/*!*******************************************************************!*\
  !*** ./gameApp/src/domain/worker/serializers/colonySerializer.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ColonySerializer: () => (/* binding */ ColonySerializer)
/* harmony export */ });
class ColonySerializer {

    serializeColonies(colonies) {
        let serializedColonies = [];
        for (let colony of colonies) {
            serializedColonies.push(this.serializeColony(colony));
        }
        return serializedColonies;
    }

    serializeColony(colony) {
        let serializedOperations = [];
        for (let operation of colony.operations) {
            serializedOperations.push(this.serializeOperation(operation));
        }
        return {
            'id': colony.id,
            'name': colony.name,
            'operations': serializedOperations,
            'enemies': colony.enemies
        };
    }

    serializeMarker(marker) {
        return {
            'type': marker.type,
            'point': marker.point,
            'params': marker.params
        }
    }

    serializeOperations(operations) {
        let serializedOperations = [];
        for (let operation of operations) {
            serializedOperations.push(this.serializeOperation(operation));
        }

        return serializedOperations;
    }

    serializeOperation(operation) {
        let serializedMarkers = [];
        for (let marker of operation.markers) {
            serializedMarkers.push(this.serializeMarker(marker));
        }
        return {
            'id': operation.id,
            'type': operation.type,
            'status': operation.status,
            'markers': serializedMarkers,
            'workerVacanciesCount': operation.workerVacanciesCount,
            'warriorVacanciesCount': operation.warriorVacanciesCount,
            'hiredWorkersCount': operation.hiredWorkersCount,
            'hiredWarriorsCount': operation.hiredWarriorsCount
        }
    }
}



/***/ }),

/***/ "./gameApp/src/domain/worker/serializers/entitySerializer.js":
/*!*******************************************************************!*\
  !*** ./gameApp/src/domain/worker/serializers/entitySerializer.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EntitySerializer: () => (/* binding */ EntitySerializer)
/* harmony export */ });
/* harmony import */ var _domain_enum_entityTypes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @domain/enum/entityTypes */ "./gameApp/src/domain/enum/entityTypes.js");
/* harmony import */ var _domain_enum_antTypes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @domain/enum/antTypes */ "./gameApp/src/domain/enum/antTypes.js");



class EntitySerializer {

    setUserData(userData) {
        this._userData = userData;
    }

    serializeAnyEntities(entities) {
        let serializedEntities = [];
        for (let entity of entities) {
            serializedEntities.push(this.serializeAnyEntity(entity));
        }
        return serializedEntities;
    }

    serializeAnyEntity(entity) {
        switch (entity.type) {
            case _domain_enum_entityTypes__WEBPACK_IMPORTED_MODULE_0__.EntityTypes.ANT:
                return this.serializeAnt(entity);
            case _domain_enum_entityTypes__WEBPACK_IMPORTED_MODULE_0__.EntityTypes.ITEM:
                return this.serializeItem(entity);
            case _domain_enum_entityTypes__WEBPACK_IMPORTED_MODULE_0__.EntityTypes.ITEM_AREA:
                return this.serializeItemArea(entity);
            case _domain_enum_entityTypes__WEBPACK_IMPORTED_MODULE_0__.EntityTypes.ITEM_SOURCE:
                return this.serializeItemSource(entity);
            case _domain_enum_entityTypes__WEBPACK_IMPORTED_MODULE_0__.EntityTypes.LADYBUG:
                return this.serializeLadybug(entity);
            case _domain_enum_entityTypes__WEBPACK_IMPORTED_MODULE_0__.EntityTypes.NEST:
                return this.serializeNest(entity);
            case _domain_enum_entityTypes__WEBPACK_IMPORTED_MODULE_0__.EntityTypes.TREE:
                return this.serializeTree(entity);
        }
    }

    serializeItemArea(itemArea) {
        let json = this._serializeBaseEntity(itemArea);
        return json;
    }

    serializeTree(tree) {
        let json = this._serializeBaseEntity(tree);
        return json;
    }

    serializeLadybug(ladybug) {
        let json = this._serializeLiveEntity(ladybug);
        json = Object.assign(json, {
        });
        return json;
    }

    serializeItemSource(itemSource) {
        let json = this._serializeBaseEntity(itemSource);
        json = Object.assign(json, {
            itemType: itemSource.itemType,
            isDamaged: itemSource.isDamaged,
            accumulated: itemSource.accumulated,
            maxAccumulated: itemSource.maxAccumulated,
            fertility: itemSource.fertility
        });
        return json;
    }

    serializeItem(item) {
        let json = this._serializeBaseEntity(item);
        json = Object.assign(json, {
            itemType: item.itemType,
            itemVariety: item.itemVariety,
            isPicked: item.isPicked,
            isBringing: item.isBringing
        });
        return json;
    }

    serializeAnt(ant) {
        switch (ant.antType) {
            case _domain_enum_antTypes__WEBPACK_IMPORTED_MODULE_1__.AntTypes.MALE:
                return this._serializeMaleAnt(ant);
            case _domain_enum_antTypes__WEBPACK_IMPORTED_MODULE_1__.AntTypes.QUEEN:
                return this._serializeQueenAnt(ant);
            case _domain_enum_antTypes__WEBPACK_IMPORTED_MODULE_1__.AntTypes.WARRIOR:
                return this._serializeWarriorAnt(ant);
            case _domain_enum_antTypes__WEBPACK_IMPORTED_MODULE_1__.AntTypes.WORKER:
                return this._serializeWorkerAnt(ant);
            default:
                throw 'unknown type of ant';
        }
    }

    serializeAnts(ants) {
        let serializedAnts = [];
        for (let ant of ants) {
            serializedAnts.push(this.serializeAnt(ant));
        }
        return serializedAnts;
    }

    _serializeMaleAnt(ant) {
        let json = this._serializeBaseAnt(ant);
        return json;
    }

    _serializeQueenAnt(ant) {
        let json = this._serializeBaseAnt(ant);
        json = Object.assign(json, {
            isFertilized: ant.isFertilized,
            breedingMaleGenome: ant.breedingMaleGenome ? this.serializeGenome(ant.breedingMaleGenome) : null,
        });
        return json;
    }

    _serializeWarriorAnt(ant) {
        let json = this._serializeBaseAnt(ant);
        return json;
    }

    _serializeWorkerAnt(ant) {
        let json = this._serializeBaseAnt(ant);
        return json;
    }

    _serializeBaseAnt(ant) {
        let json = this._serializeLiveEntity(ant);
        json = Object.assign(json, {
            name: ant.name,
            antType: ant.antType,
            stats: ant.stats,
            genome: this.serializeGenome(ant.genome),
            birthStep: ant.birthStep,
            currentActivity: ant.currentActivity,
            isHungry: ant.isHungry,
            pickedItemId: ant.pickedItemId,
            homeNestId: ant.homeNestId,
            guardianBehavior: ant.guardianBehavior,
            isCooperativeBehavior: ant.isCooperativeBehavior,
            isQueenOfColony: ant.isQueenOfColony,
            canFlyNuptialFlight: ant.canFlyNuptialFlight,
            canBeCooperative: ant.canBeCooperative,
            canBeGuardian: ant.canBeGuardian,
        });
        return json;
    }

    serializeNests(nests) {
        let serializedNests = [];
        for (let nest of nests) {
            serializedNests.push(this.serializeNest(nest));
        }
        return serializedNests;
    }

    serializeNest(nest) {
        let json = this._serializeBaseEntity(nest);
        json = Object.assign(json, {
            storedCalories: nest.storedCalories,
            fortification: nest.fortification,
            maxFortification: nest.maxFortification,
            name: nest.name,
            isMain: nest.isMain,
            area: nest.area,
            isBuilt: nest.isBuilt,
            larvae: this.serializeLarvae(nest.larvae),
            eggs: this.serializeEggs(nest.eggs)
        });
        return json;
    }

    serializeEggs(eggs) {
        let serializedEggs = [];
        for (let egg of eggs) {
            serializedEggs.push(this.serializeEgg(egg));
        }
        return serializedEggs;
    }

    serializeEgg(egg) {
        return {
            id: egg.id,
            name: egg.name,
            genome: this.serializeGenome(egg.genome),
            progress: egg.progress,
            state: egg.state,
            antType: egg.antType,
            isFertilized: egg.isFertilized,
            avaliableAntTypes: egg.avaliableAntTypes,
        }
    }
    
    serializeLarvae(larvae) {
        let serialized = []
        for (let larva of larvae) {
            serialized.push(this.serializeLarva(larva));
        }
        return serialized;
    }

    serializeLarva(larva) {
        return {
            id: larva.id,
            name: larva.name,
            antType: larva.antType,
            ateFood: larva.ateFood,
            requiredFood: larva.requiredFood,
            genome: this.serializeGenome(larva.genome)
        };
    }

    serializeGenome(genome) {
        return {
            maternal: this.serializeChromosomesSet(genome.maternal),
            paternal: genome.paternal ? this.serializeChromosomesSet(genome.paternal) : null,
        };
    }

    serializeChromosomesSet(chromosomesSet) {
        return chromosomesSet.chromosomes;
    }

    _serializeBaseEntity(entity) {
        return {
            id: entity.id,
            position: entity.position,
            type: entity.type,
            fromColony: entity.fromColony,
            isMine: this._userData.id == entity.ownerId,
            hp: entity.hp,
            maxHp: entity.maxHp,
            isDied: entity.isDied,
            isVisible: entity.isVisible,
            angle: entity.angle
        }
    }

    _serializeLiveEntity(entity) {
        let json = this._serializeBaseEntity(entity);
        json = Object.assign(json, {
            isInHibernation: entity.isInHibernation
        });
        return json;
    }
}



/***/ }),

/***/ "./gameApp/src/domain/worker/viewPointManager.js":
/*!*******************************************************!*\
  !*** ./gameApp/src/domain/worker/viewPointManager.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ViewPointManager: () => (/* binding */ ViewPointManager)
/* harmony export */ });
class ViewPointManager {

    constructor() {
        this._chunksVisibilityState = {};
    }

    get chunks() {
        return this._chunks;
    }

    setChunks(chunks) {
        this._chunks = chunks;

        for (let chunkId in chunks) {
            this._chunksVisibilityState[chunkId] = false;
        }
    }

    isChunkVisible(chunkId) {
        return this._chunksVisibilityState[chunkId];
    }

    getVisibleChunkIds() {
        let visibleChunkIds = [];
        for (let chunkId in this._chunksVisibilityState) {
            if (this._chunksVisibilityState[chunkId]) {
                visibleChunkIds.push(chunkId);
            }
        }

        return visibleChunkIds;
    }

    updateChunksVisibleStateForViewRect(viewRect) {
        let isSomeChunkVisibilityChanged = false;
        for (let chunkId in this._chunks) {
            let chunk = this._chunks[chunkId];
            let isVisibleChunk = chunk.intersectsRect(viewRect.x, viewRect.y, viewRect.width, viewRect.height);
            let isStateChanged = this._chunksVisibilityState[chunkId] != isVisibleChunk
            this._chunksVisibilityState[chunkId] = isVisibleChunk;
            if (isStateChanged) {
                isSomeChunkVisibilityChanged = true;
            }
        }

        return isSomeChunkVisibilityChanged;
    }

    getEntitiesFromVisibleChunks() {
        let entities = [];
        for (let chunkId in this._chunks) {
            if (this.isChunkVisible(chunkId)) {
                let chunk = this._chunks[chunkId];
                entities = entities.concat(chunk.entities);
            }
        }

        return entities;
    }
}



/***/ }),

/***/ "./gameApp/src/domain/worker/worldStepEventsCollector.js":
/*!***************************************************************!*\
  !*** ./gameApp/src/domain/worker/worldStepEventsCollector.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   WorldStepEventsCollector: () => (/* binding */ WorldStepEventsCollector)
/* harmony export */ });
class WorldStepEventsCollector {

    constructor(eventBus) {
        this._eventBus = eventBus;
        this._stepEvents = [];

        this._eventBus.on('nestDied', this._onNestDied.bind(this));
    }

    pullStepEvents() {
        let evetns = this._stepEvents;
        this._stepEvents = [];
        return evetns;
    }

    _onNestDied(nest) {
        this._stepEvents.push(this._buildEventRecord('nestDied', {nestId: nest.id}));
    }

    _buildEventRecord(type, data) {
        return {
            type,
            data
        };
    }
}



/***/ }),

/***/ "./gameApp/src/domain/worldFactory.js":
/*!********************************************!*\
  !*** ./gameApp/src/domain/worldFactory.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   WorldFactory: () => (/* binding */ WorldFactory)
/* harmony export */ });
/* harmony import */ var _enum_entityTypes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./enum/entityTypes */ "./gameApp/src/domain/enum/entityTypes.js");
/* harmony import */ var _entity_world__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./entity/world */ "./gameApp/src/domain/entity/world.js");
/* harmony import */ var _entity_nest__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./entity/nest */ "./gameApp/src/domain/entity/nest.js");
/* harmony import */ var _entity_larva__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./entity/larva */ "./gameApp/src/domain/entity/larva.js");
/* harmony import */ var _entity_antColony__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./entity/antColony */ "./gameApp/src/domain/entity/antColony.js");
/* harmony import */ var _entity_item__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./entity/item */ "./gameApp/src/domain/entity/item.js");
/* harmony import */ var _entity_itemSource__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./entity/itemSource */ "./gameApp/src/domain/entity/itemSource.js");
/* harmony import */ var _entity_itemArea__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./entity/itemArea */ "./gameApp/src/domain/entity/itemArea.js");
/* harmony import */ var _enum_antTypes__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./enum/antTypes */ "./gameApp/src/domain/enum/antTypes.js");
/* harmony import */ var _entity_ant__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./entity/ant */ "./gameApp/src/domain/entity/ant/index.js");
/* harmony import */ var _entity_egg__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./entity/egg */ "./gameApp/src/domain/entity/egg.js");
/* harmony import */ var _entity_climate__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./entity/climate */ "./gameApp/src/domain/entity/climate.js");
/* harmony import */ var _entity_tree__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./entity/tree */ "./gameApp/src/domain/entity/tree.js");
/* harmony import */ var _entity_ladybug__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./entity/ladybug */ "./gameApp/src/domain/entity/ladybug.js");
/* harmony import */ var _entity_genetic_genome__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./entity/genetic/genome */ "./gameApp/src/domain/entity/genetic/genome.js");
















class WorldFactory {

    constructor(mainEventBus) {
        this._mainEventBus = mainEventBus;
    }

    buildEntity(entityJson) {
        switch(entityJson.type) {
            case _enum_entityTypes__WEBPACK_IMPORTED_MODULE_0__.EntityTypes.ANT: 
                return this.buildAnt(entityJson)
            case _enum_entityTypes__WEBPACK_IMPORTED_MODULE_0__.EntityTypes.LADYBUG:
                return this.buildLadybug(entityJson);
            case _enum_entityTypes__WEBPACK_IMPORTED_MODULE_0__.EntityTypes.NEST:
                return this.buildNest(entityJson);
            case _enum_entityTypes__WEBPACK_IMPORTED_MODULE_0__.EntityTypes.ITEM:
                return this.buildItem(entityJson);
            case _enum_entityTypes__WEBPACK_IMPORTED_MODULE_0__.EntityTypes.ITEM_SOURCE:
                return this.buildItemSource(entityJson);
            case _enum_entityTypes__WEBPACK_IMPORTED_MODULE_0__.EntityTypes.ITEM_AREA:
                return this.buildItemArea(entityJson.id, entityJson.position, entityJson.angle, entityJson.hp, entityJson.max_hp);
            case _enum_entityTypes__WEBPACK_IMPORTED_MODULE_0__.EntityTypes.TREE:
                return this.buildTree(entityJson);
            default:
                throw 'unknown type of entity';
        }
    }

    buildItemArea(id, position, angle, hp, maxHp) {
        return new _entity_itemArea__WEBPACK_IMPORTED_MODULE_7__.ItemArea(this._mainEventBus, id, position, angle, hp, maxHp);
    }

    buildItemSource(entityJson) {
        let id = entityJson.id;
        let position = entityJson.position;
        let angle = entityJson.angle;
        let fromColonyId = entityJson.from_colony_id;
        let hp = entityJson.hp;
        let maxHp = entityJson.max_hp;
        let itemType = entityJson.itemType;
        let isDamaged = entityJson.isDamaged;
        let accumulated = entityJson.accumulated;
        let maxAccumulated = entityJson.maxAccumulated;
        let fertility = entityJson.fertility;
        return new _entity_itemSource__WEBPACK_IMPORTED_MODULE_6__.ItemSource(this._mainEventBus, id, position, angle, fromColonyId, hp, maxHp, itemType, isDamaged, accumulated, maxAccumulated, fertility);
    }

    buildItem(entityJson) {
        let id = entityJson.id; 
        let position = entityJson.position;
        let angle = entityJson.angle;
        let fromColony = entityJson.from_colony_id;
        let hp = entityJson.hp;
        let maxHp = entityJson.max_hp
        let itemType = entityJson.itemType;
        let itemVariety = entityJson.variety;
        let isPicked = entityJson.isPicked;
        let isBringing = entityJson.isBringing;
        return new _entity_item__WEBPACK_IMPORTED_MODULE_5__.Item(this._mainEventBus, id, position, angle, fromColony, hp, maxHp, itemType, itemVariety, isPicked, isBringing);
    }

    buildWorld() {
        let climate = new _entity_climate__WEBPACK_IMPORTED_MODULE_11__.Climate();
        return new _entity_world__WEBPACK_IMPORTED_MODULE_1__.World(this._mainEventBus, climate);
    }

    buildLadybug(json) {
        return new _entity_ladybug__WEBPACK_IMPORTED_MODULE_13__.Ladybug(this._mainEventBus, json.id, json.position, json.angle, json.from_colony_id, json.hp, json.max_hp, json.isInHibernation);
    }

    buildNest(nestJson) {
        let eggs = [];
        for (let eggJson of nestJson.eggs) {
            let egg = _entity_egg__WEBPACK_IMPORTED_MODULE_10__.Egg.buildFromJson(eggJson);
            eggs.push(egg);
        }

        let larvae = [];
        for (let larvaJson of nestJson.larvae) {
            let larva = _entity_larva__WEBPACK_IMPORTED_MODULE_3__.Larva.buildFromJson(larvaJson);
            larvae.push(larva);
        }

        let id = nestJson.id;
        let position = nestJson.position;
        let angle = nestJson.angle;
        let fromColonyId = nestJson.from_colony_id;
        let ownerId = nestJson.owner_id;
        let storedCalories = nestJson.storedCalories;
        let isBuilt = nestJson.isBuilt;
        let hp = nestJson.hp;
        let maxHp = nestJson.max_hp;
        let maxFortification = nestJson.maxFortification;
        let fortification = nestJson.fortification;
        let name = nestJson.name;
        let isMain = nestJson.isMain;
        let area = nestJson.area;
        return new _entity_nest__WEBPACK_IMPORTED_MODULE_2__.Nest(this._mainEventBus, id, position, angle, fromColonyId, ownerId, storedCalories, larvae, eggs, isBuilt, 
            hp, maxHp, fortification, maxFortification, name, isMain, area);
    }

    buildAnt(antJson) {
        let id = antJson.id;
        let name = antJson.name;
        let position = antJson.position;
        let angle = antJson.angle;
        let fromColony = antJson.from_colony_id;
        let ownerId = antJson.owner_id;
        let hp = antJson.hp;
        let maxHp = antJson.max_hp;
        let isInHibernation = antJson.isInHibernation;
        let pickedItemId = antJson.pickedItemId;
        let locatedInNestId = antJson.locatedInNestId;
        let homeNestId = antJson.homeNestId;
        let stats = antJson.stats;
        let behavior = antJson.behavior;
        let genome = _entity_genetic_genome__WEBPACK_IMPORTED_MODULE_14__.Genome.buildFromJson(antJson.genome);
        let birthStep = antJson.birthStep;
        let currentActivity = antJson.currentActivity;
        let isHungry = antJson.isHungry

        switch (antJson.antType) {
            case _enum_antTypes__WEBPACK_IMPORTED_MODULE_8__.AntTypes.QUEEN:
                let isFertilized = antJson.isFertilized;
                let isInNuptialFlight = antJson.isInNuptialFlight;
                let breedingMaleGenome = antJson.breedingMaleGenome ? _entity_genetic_genome__WEBPACK_IMPORTED_MODULE_14__.Genome.buildFromJson(antJson.breedingMaleGenome) : null;
                return new _entity_ant__WEBPACK_IMPORTED_MODULE_9__.QueenAnt(this._mainEventBus, id, name, position, angle, fromColony, ownerId, hp, maxHp, isInHibernation, pickedItemId, locatedInNestId, 
                    homeNestId, stats, behavior, genome, birthStep, currentActivity, isFertilized, isInNuptialFlight, breedingMaleGenome, isHungry);
            case _enum_antTypes__WEBPACK_IMPORTED_MODULE_8__.AntTypes.WARRIOR:
                return new _entity_ant__WEBPACK_IMPORTED_MODULE_9__.WarriorAnt(this._mainEventBus, id, name, position, angle, fromColony, ownerId, hp, maxHp, isInHibernation, pickedItemId, locatedInNestId, 
                    homeNestId, stats, behavior, genome, birthStep, currentActivity, isHungry);
            case _enum_antTypes__WEBPACK_IMPORTED_MODULE_8__.AntTypes.WORKER:
                return new _entity_ant__WEBPACK_IMPORTED_MODULE_9__.WorkerAnt(this._mainEventBus, id, name, position, angle, fromColony, ownerId, hp, maxHp, isInHibernation, pickedItemId, locatedInNestId, 
                    homeNestId, stats, behavior, genome, birthStep, currentActivity, isHungry);
            case _enum_antTypes__WEBPACK_IMPORTED_MODULE_8__.AntTypes.MALE:
                return new _entity_ant__WEBPACK_IMPORTED_MODULE_9__.MaleAnt(this._mainEventBus, id, name, position, angle, fromColony, ownerId, hp, maxHp, isInHibernation, pickedItemId, locatedInNestId, 
                    homeNestId, stats, behavior, genome, birthStep, currentActivity, isHungry);
            default:
                throw 'unknown type of ant';
        }
    }

    buildTree(treeJson) {
        let id = treeJson.id;
        let position = treeJson.position;
        let angle = treeJson.angle;
        let fromColony = treeJson.fromColony;
        let ownerId = treeJson.ownerId;
        let hp = treeJson.hp;
        let maxHp = treeJson.maxHp;
        return new _entity_tree__WEBPACK_IMPORTED_MODULE_12__.Tree(this._mainEventBus, id, position, angle, fromColony, ownerId, hp, maxHp);
    }

    buildAntColony(colonyJson) {
        let id = colonyJson.id;
        let ownerId = colonyJson.owner_id;
        let name = colonyJson.name;
        let operations = colonyJson.operations;
        let enemies = colonyJson.enemies;
        return new _entity_antColony__WEBPACK_IMPORTED_MODULE_4__.AntColony(this._mainEventBus, id, ownerId, name, operations, enemies);
    }

}



/***/ }),

/***/ "./gameApp/src/messages/messageIds.js":
/*!********************************************!*\
  !*** ./gameApp/src/messages/messageIds.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GAME_MESSAGE_IDS: () => (/* binding */ GAME_MESSAGE_IDS)
/* harmony export */ });
/* harmony import */ var _common_messages_messageIds__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @common/messages/messageIds */ "./common/messages/messageIds.js");


const GAME_MESSAGE_IDS = {
    ..._common_messages_messageIds__WEBPACK_IMPORTED_MODULE_0__.COMMON_MESSAGE_IDS,
    OLD_PASSWORD_NEEDED: 'OLD_PASSWORD_NEEDED',
    TAB_BREEDING: 'TAB_BREEDING',
    TAB_COLONIES: 'TAB_COLONIES',
    TAB_SPECIE: 'TAB_SPECIE',
    TAB_NOTIFICATIONS: 'TAB_NOTIFICATIONS',
    TAB_RATING: 'TAB_RATING',
    TAB_ACCOUNT: 'TAB_ACCOUNT',
    TAB_HELP: 'TAB_HELP',

    BREEDING_PLACE_TO_SETTLE_NEEDED: 'BREEDING_PLACE_TO_SETTLE_NEEDED',
    BREEDING_PLACE_TO_SETTLE_BLOCKED: 'BREEDING_PLACE_TO_SETTLE_BLOCKED',
    BREEDING_QUEEN_NEEDED: 'BREEDING_QUEEN_NEEDED',
    BREEDING_LIVE_QUEEN_NEEDED: 'BREEDING_LIVE_QUEEN_NEEDED',
    BREEDING_MALE_NEEDED: 'BREEDING_MALE_NEEDED',
    BREEDING_LABEL_FEMALE: 'BREEDING_LABEL_FEMALE',
    BREEDING_LABEL_MALE: 'BREEDING_LABEL_MALE',
    BREEDING_LABEL_NEW_COLONY_NAME: 'BREEDING_LABEL_NEW_COLONY_NAME',
    BREEDING_LABEL_NEST_POSITION: 'BREEDING_LABEL_NEST_POSITION',
    BREEDING_LABEL_CHOOSE_NEST_POSITION: 'BREEDING_LABEL_CHOOSE_NEST_POSITION',
    BREEDING_LABEL_START: 'BREEDING_LABEL_START',
    NUPTIAL_TAB_TIME_FULL: 'NUPTIAL_TAB_TIME_FULL',
    NUPTIAL_TAB_TIME_SHORT: 'NUPTIAL_TAB_TIME_SHORT',
    NUPTIAL_FLIGHT_TAB_LABEL_NAME: 'NUPTIAL_FLIGHT_TAB_LABEL_NAME',
    NUPTIAL_FLIGHT_TAB_LABEL_NUPT_SEASON_START_AFTER: 'NUPTIAL_FLIGHT_TAB_LABEL_NUPT_SEASON_START_AFTER',
    QUEEN_SELECTOR_LABEL_NO_QUEENS: 'QUEEN_SELECTOR_LABEL_NO_QUEENS',
    QUEEN_SELECTOR_LABEL_BORN_ANTARA: 'QUEEN_SELECTOR_LABEL_BORN_ANTARA',
    QUEEN_SELECTOR_LABEL_NEXT_QUEEN: 'QUEEN_SELECTOR_LABEL_NEXT_QUEEN',
    QUEEN_SELECTOR_LABEL_PREV_QUEEN: 'QUEEN_SELECTOR_LABEL_PREV_QUEEN',
    MALE_SELECTOR_LABEL_NO_MALES: 'MALE_SELECTOR_LABEL_NO_MALES',
    MALE_SELECTOR_LABEL_NEXT_MALE: 'MALE_SELECTOR_LABEL_NEXT_MALE',
    MALE_SELECTOR_LABEL_PREV_MALE: 'MALE_SELECTOR_LABEL_PREV_MALE',

    NEW_SUB_NEST_OPER_CANT_BUILD_SUB_NEST_WITHOUT_QUEEN: 'NEW_SUB_NEST_OPER_CANT_BUILD_SUB_NEST_WITHOUT_QUEEN',
    NEW_SUB_NEST_OPER_BUILDING_POSITION_NEEDED: 'NEW_SUB_NEST_OPER_BUILDING_POSITION_NEEDED',
    NEW_SUB_NEST_OPER_BUILDING_POSITION_BLOCKED: 'NEW_SUB_NEST_OPER_BUILDING_POSITION_BLOCKED',
    NEW_SUB_NEST_OPER_CANT_BUILD_MORE_SUB_NESTS: 'NEW_SUB_NEST_OPER_CANT_BUILD_MORE_SUB_NESTS',

    DESTROY_NEST_OPER_CANT_ATTACK_WITHOUT_QUEEN: 'DESTROY_NEST_OPER_CANT_ATTACK_WITHOUT_QUEEN',
    DESTROY_NEST_OPER_NEST_NEEDED: 'DESTROY_NEST_OPER_NEST_NEEDED',
    DESTROY_NEST_OPER_NOT_DESTROYED_NEST_NEEDED: 'DESTROY_NEST_OPER_NOT_DESTROYED_NEST_NEEDED',
    DESTROY_NEST_OPER_TOO_FEW_ANTS: 'DESTROY_NEST_OPER_TOO_FEW_ANTS',

    PILLAGE_NEST_OPER_CANT_PILLAGE_WITHOUT_QUEEN: 'PILLAGE_NEST_OPER_CANT_PILLAGE_WITHOUT_QUEEN',
    PILLAGE_NEST_OPER_NEST_TO_PILLAGE_NEEDED: 'PILLAGE_NEST_OPER_NEST_TO_PILLAGE_NEEDED',
    PILLAGE_NEST_OPER_NOT_DESTROYED_NEST_TO_PILLAGE_NEEDED: 'PILLAGE_NEST_OPER_NOT_DESTROYED_NEST_TO_PILLAGE_NEEDED',
    PILLAGE_NEST_OPER_NEST_FOR_LOOT_NEEDED: 'PILLAGE_NEST_OPER_NEST_FOR_LOOT_NEEDED',

    TRANSPORT_FOOD_OPER_NEST_FROM_NEEDED: 'TRANSPORT_FOOD_OPER_NEST_FROM_NEEDED',
    TRANSPORT_FOOD_OPER_NEST_TO_NEEDED: 'TRANSPORT_FOOD_OPER_NEST_TO_NEEDED',
    TRANSPORT_FOOD_OPER_DIFFERENT_NESTS_NEEDED: 'TRANSPORT_FOOD_OPER_DIFFERENT_NESTS_NEEDED',

    BUILD_FORTIFICATION_OPER_NEST_NEEDED: 'BUILD_FORTIFICATION_OPER_NEST_NEEDED',

    BRING_BUG_OPER_NEST_NEEDED: 'BRING_BUG_OPER_NEST_NEEDED',
    BRING_BUG_OPER_NO_BUG_FOUND: 'BRING_BUG_OPER_NO_BUG_FOUND',

    NEST_INLINE_NOT_SPECIFIED: 'NEST_INLINE_NOT_SPECIFIED',
    NEST_INLINE_DESTROYED: 'NEST_INLINE_DESTROYED',

    NEST_SELECTOR_NOT_SELECTED: 'NEST_SELECTOR_NOT_SELECTED',

    INT_INPUT_MIN_MAX: 'INT_FIELD_MIN_MAX',
    INT_INPUT_MIN: 'INT_FIELD_MIN',
    INT_INPUT_MAX: 'INT_FIELD_MAX',

    TEXT_INPUT_MIN_STR_LENGTH: 'TEXT_INPUT_MIN_STR_LENGTH',
    TEXT_INPUT_MAX_STR_LENGTH: 'TEXT_INPUT_MAX_STR_LENGTH',
    TEXT_INPUT_INVALID_CHAR: 'TEXT_INPUT_INVALID_CHAR',

    POSITION_NOT_SPECIFIED: 'POSITION_NOT_SPECIFIED',

    NOTIFICATION_ANT_DEATH_PLACE: 'NOTIFICATION_ANT_DEATH_PLACE',
    NOTIFICATION_NEST_DEATH_PLACE: 'NOTIFICATION_NEST_DEATH_PLACE',

    CLIMATE_LABEL_YEAR: 'CLIMATE_LABEL_YEAR',
    SEASON_LABEL_SPRING: 'SEASON_LABEL_SPRING',
    SEASON_LABEL_SUMMER: 'SEASON_LABEL_SUMMER',
    SEASON_LABEL_AUTUMN: 'SEASON_LABEL_AUTUMN',
    SEASON_LABEL_WINTER: 'SEASON_LABEL_WINTER',

    STATS_LABEL_MAX_HP: 'STATS_LABEL_MAX_HP',
    STATS_LABEL_HP_REGEN_RATE: 'STATS_LABEL_HP_REGEN_RATE',
    STATS_LABEL_SPEED: 'STATS_LABEL_SPEED',
    STATS_LABEL_SIGHT_DISTANCE: 'STATS_LABEL_SIGHT_DISTANCE',
    STATS_LABEL_STRENGTH: 'STATS_LABEL_STRENGTH',
    STATS_LABEL_DEFENSE: 'STATS_LABEL_DEFENSE',
    STATS_LABEL_APPETITE: 'STATS_LABEL_APPETITE',
    STATS_LABEL_MIN_TEMP: 'STATS_LABEL_MIN_TEMP',
    STATS_LABEL_LIFE_SPAN: 'STATS_LABEL_LIFE_SPAN',

    GENOME_LABEL_ANALIZE_GENOME: 'GENOME_LABEL_ANALIZE_GENOME',
    GENE_LABEL_DOMINATION_CODE: 'GENE_LABEL_DOMINATION_CODE',
    GENE_LABEL_BODY_STRENGTH: 'GENE_LABEL_BODY_STRENGTH',
    GENE_LABEL_BODY_DEFENSE: 'GENE_LABEL_BODY_DEFENSE',
    GENE_LABEL_BODY_MAX_HP: 'GENE_LABEL_BODY_MAX_HP',
    GENE_LABEL_BODY_HP_REGEN_RATE: 'GENE_LABEL_BODY_HP_REGEN_RATE',
    GENE_LABEL_BODY_SIGHT_DISTANCE: 'GENE_LABEL_BODY_SIGHT_DISTANCE',
    GENE_LABEL_BODY_SPEED: 'GENE_LABEL_BODY_SPEED',
    GENE_LABEL_BODY_LIFE_SPAN: 'GENE_LABEL_BODY_LIFE_SPAN',
    GENE_LABEL_SPECIALIZATION_BUILDING_SUBNEST: 'GENE_LABEL_SPECIALIZATION_BUILDING_SUBNEST',
    GENE_LABEL_ADAPTATION_APPETITE: 'GENE_LABEL_ADAPTATION_APPETITE',
    GENE_LABEL_ADAPTATION_DEVELOPMENT_APPETITE: 'GENE_LABEL_ADAPTATION_DEVELOPMENT_APPETITE',
    GENE_LABEL_ADAPTATION_COLD: 'GENE_LABEL_ADAPTATION_COLD',
    GENE_LABEL_DEVELOPMENT_WORKER_CASTE: 'GENE_LABEL_DEVELOPMENT_WORKER_CASTE',
    GENE_LABEL_DEVELOPMENT_WARRIOR_CASTE: 'GENE_LABEL_DEVELOPMENT_WARRIOR_CASTE',
    GENE_LABEL_DEVELOPMENT_QUEEN_CASTE: 'GENE_LABEL_DEVELOPMENT_QUEEN_CASTE',
    GENE_LABEL_DEVELOPMENT_MALE_CASTE: 'GENE_LABEL_DEVELOPMENT_MALE_CASTE',
    GENE_LABEL_DEVELOPMENT_STRENGTH: 'GENE_LABEL_DEVELOPMENT_STRENGTH',
    GENE_LABEL_DEVELOPMENT_DEFENSE: 'GENE_LABEL_DEVELOPMENT_DEFENSE',
    GENE_LABEL_DEVELOPMENT_MAX_HP: 'GENE_LABEL_DEVELOPMENT_MAX_HP',
    GENE_LABEL_DEVELOPMENT_HP_REGEN_RATE: 'GENE_LABEL_DEVELOPMENT_HP_REGEN_RATE',
    GENE_LABEL_DEVELOPMENT_SPEED: 'GENE_LABEL_DEVELOPMENT_SPEED',
    GENE_LABEL_DEVELOPMENT_LIFE_SPAN: 'GENE_LABEL_DEVELOPMENT_LIFE_SPAN',
    CHROMOSOME_LABEL_BODY: 'CHROMOSOME_LABEL_BODY',
    CHROMOSOME_LABEL_DEVELOPMENT: 'CHROMOSOME_LABEL_DEVELOPMENT',
    CHROMOSOME_LABEL_ADAPTATION: 'CHROMOSOME_LABEL_ADAPTATION',
    CHROMOSOME_LABEL_SPECIALIZATION: 'CHROMOSOME_LABEL_SPECIALIZATION',
    CHROMOSOMESET_LABEL_MATERNAL: 'CHROMOSOMESET_LABEL_MATERNAL',
    CHROMOSOMESET_LABEL_PATERNAL: 'CHROMOSOMESET_LABEL_PATERNAL',

    COLONIES_TAB_TITLE: 'COLONIES_TAB_TITLE',
    COLONIES_TAB_LABEL_NO_COLONIES: 'COLONIES_TAB_LABEL_NO_COLONIES',
    COLONIES_TAB_LABEL_COLONY_SELECTOR: 'COLONIES_TAB_LABEL_COLONY_SELECTOR',
    COLONY_MANAGER_TAB_NAME_ANTS: 'COLONY_MANAGER_TAB_NAME_ANTS',
    COLONY_MANAGER_TAB_NAME_OPERATIONS: 'COLONY_MANAGER_TAB_NAME_OPERATIONS',
    COLONY_MANAGER_TAB_NAME_NESTS: 'COLONY_MANAGER_TAB_NAME_NESTS',
    COLONY_MANAGER_TAB_NAME_ENEMIES: 'COLONY_MANAGER_TAB_NAME_ENEMIES',
    ANTS_LIST_COL_NAME_NAME: 'ANTS_LIST_COL_NAME_NAME',
    ANTS_LIST_COL_NAME_TYPE: 'ANTS_LIST_COL_NAME_TYPE',
    ANTS_LIST_COL_NAME_NEST: 'ANTS_LIST_COL_NAME_NEST',
    ANTS_LIST_COL_NAME_MORE: 'ANTS_LIST_COL_NAME_MORE',
    ANTS_LIST_LABEL_NO_ANTS: 'ANTS_LIST_LABEL_NO_ANTS',
    ANT_VIEW_SHOW_PROFILE_BTN: 'ANT_VIEW_SHOW_PROFILE_BTN',
    ANT_VIEW_HIDE_PROFILE_BTN: 'ANT_VIEW_HIDE_PROFILE_BTN',
    
    ANT_TYPE_QUEEN: 'ANT_TYPE_QUEEN',
    ANT_TYPE_FEMALE: 'ANT_TYPE_FEMALE',
    ANT_TYPE_MALE: 'ANT_TYPE_MALE',
    ANT_TYPE_WORKER: 'ANT_TYPE_WORKER',
    ANT_TYPE_WARRIOR: 'ANT_TYPE_WARRIOR',
    ANT_GUARDIAN_BEHAVIOR_LABEL: 'ANT_GUARDIAN_BEHAVIOR_LABEL',
    ANT_GUARDIAN_BEHAVIOR_TYPE_NONE: 'ANT_GUARDIAN_BEHAVIOR_TYPE_NONE',
    ANT_GUARDIAN_BEHAVIOR_TYPE_NEST: 'ANT_GUARDIAN_BEHAVIOR_TYPE_NEST',
    ANT_GUARDIAN_BEHAVIOR_TYPE_COLONY: 'ANT_GUARDIAN_BEHAVIOR_TYPE_COLONY',
    ANT_COOPERATIVE_BEHAVIOR_LABEL: 'ANT_COOPERATIVE_BEHAVIOR_LABEL',
    ANT_NUPTIAL_MALE_GENOME_LABEL: 'ANT_NUPTIAL_MALE_GENOME_LABEL',
    ANT_AGE_LABEL: 'ANT_AGE_LABEL',
    ANT_CURRENT_ACTIVITY_LABEL: 'ANT_CURRENT_ACTIVITY_LABEL',
    ANT_ACTIVITY_NOTHING: 'ANT_ACTIVITY_NOTHING',
    ANT_ACTIVITY_PREPARING_FOR_HIBERNATION: 'ANT_ACTIVITY_PREPARING_FOR_HIBERNATION',
    ANT_ACTIVITY_HIBERNATION: 'ANT_ACTIVITY_HIBERNATION',
    ANT_ACTIVITY_PATROLING_NEST_TERRITORY: 'ANT_ACTIVITY_PATROLING_NEST_TERRITORY',
    ANT_ACTIVITY_COLLECTING_FOOD: 'ANT_ACTIVITY_COLLECTING_FOOD',
    ANT_ACTIVITY_FEEDING_MYSELF: 'ANT_ACTIVITY_FEEDING_MYSELF',
    ANT_ACTIVITY_DEFENDING_HOME_NEST: 'ANT_ACTIVITY_DEFENDING_HOME_NEST',
    ANT_ACTIVITY_DEFENDING_MYSELF: 'ANT_ACTIVITY_DEFENDING_MYSELF',
    ANT_ACTIVITY_DEFENDING_COLONY: 'ANT_ACTIVITY_DEFENDING_COLONY',
    ANT_ACTIVITY_SHELTERING_IN_NEST: 'ANT_ACTIVITY_SHELTERING_IN_NEST',
    ANT_ACTIVITY_IN_OPERATION: 'ANT_ACTIVITY_IN_OPERATION',
    ANT_ACTIVITY_GOING_HOME: 'ANT_ACTIVITY_GOING_HOME',
    ANT_ACTIVITY_WATCHING_NEST: 'ANT_ACTIVITY_WATCHING_NEST',
    ANT_ACTIVITY_BUILDING_MAIN_NEST: 'ANT_ACTIVITY_BUILDING_MAIN_NEST',
    ANT_IS_HUNGRY_LABEL: 'ANT_IS_HUNGRY_LABEL',
    ANT_IS_HUNGRY_STATE_HUNGRY: 'ANT_IS_HUNGRY_STATE_HUNGRY',
    ANT_IS_HUNGRY_STATE_NOT_HUNGRY: 'ANT_IS_HUNGRY_STATE_NOT_HUNGRY',
    ANT_NUPTIAL_FLIGHT_BTN_LABEL: 'ANT_NUPTIAL_FLIGHT_BTN_LABEL',
    ANT_SHOW_BTN_LABEL: 'ANT_SHOW_BTN_LABEL',
    ANT_NAME_ADJECTIVES: 'ANT_NAME_ADJECTIVES',
    ANT_NAME_NOUNS: 'ANT_NAME_NOUNS',

    OPERATIONS_LIST_COL_LABEL_NAME: 'OPERATIONS_LIST_COLONY_LABEL_NAME',
    OPERATIONS_LIST_COL_LABEL_STATUS: 'OPERATIONS_LIST_COLONY_LABEL_STATUS',
    OPERATIONS_LIST_COL_LABEL_HIRING: 'OPERATIONS_LIST_COLONY_LABEL_HIRING',
    OPERATIONS_LIST_COL_LABEL_ACTIONS: 'OPERATIONS_LIST_COLONY_LABEL_ACTIONS',
    OPERATIONS_CREATOR_NEW_SUB_NEST_BTN_LABEL: 'OPERATIONS_CREATOR_NEW_SUB_NEST_BTN_LABEL',
    OPERATIONS_CREATOR_DESTROY_NEST_BTN_LABEL: 'OPERATIONS_CREATOR_DESTROY_NEST_BTN_LABEL',
    OPERATIONS_CREATOR_PILLAGE_NEST_BTN_LABEL: 'OPERATIONS_CREATOR_PILLAGE_NEST_BTN_LABEL',
    OPERATIONS_CREATOR_TRANSPORT_FOOD_BTN_LABEL: 'OPERATIONS_CREATOR_TRANSPORT_FOOD_BTN_LABEL',
    OPERATIONS_CREATOR_BUILD_FORTIFICATIONS_BTN_LABEL: 'OPERATIONS_CREATOR_BUILD_FORTIFICATIONS_BTN_LABEL',
    OPERATIONS_CREATOR_BRING_BUG_CORPSE_BTN_LABEL: 'OPERATIONS_CREATOR_BRING_BUG_CORPSE_BTN_LABEL',
    OPERATIONS_CREATOR_CANCEL_OPERATION_CREATING_BTN_LABEL: 'OPERATIONS_CREATOR_CANCEL_OPERATION_CREATING_BTN_LABEL',

    OPERATION_CREATOR_WORKERS_COUNT: 'OPERATION_CREATOR_WORKERS_COUNT',
    OPERATION_CREATOR_WARRIORS_COUNT: 'OPERATION_CREATOR_WARRIORS_COUNT',
    OPERATION_CREATOR_START_BTN_LABEL: 'OPERATION_CREATOR_START_BTN_LABEL',

    OPERATION_STATUS_IN_PROGRESS_LABEL: 'OPERATION_STATUS_IN_PROGRESS_LABEL',
    OPERATION_STATUS_HIRING_LABEL: 'OPERATION_STATUS_HIRING_LABEL',
    OPERATION_STATUS_DONE_LABEL: 'OPERATION_STATUS_DONE_LABEL',
    OPERATION_ACTIVATE_BTN_LABEL: 'OPERATION_ACTIVATE_BTN_LABEL',
    OPERATION_DEACTIVATE_BTN_LABEL: 'OPERATION_DEACTIVATE_BTN_LABEL',
    OPERATION_HIRING_WORKERS_STATUS_LABEL: 'OPERATION_HIRING_WORKERS_STATUS_LABEL',
    OPERATION_HIRING_WARRIORS_STATUS_LABEL: 'OPERATION_HIRING_WARRIORS_STATUS_LABEL',
    OPERATION_TYPE_LABEL_NEW_SUBNEST: 'OPERATION_TYPE_LABEL_NEW_SUBNEST',
    OPERATION_TYPE_LABEL_DESTROY_NEST: 'OPERATION_TYPE_LABEL_DESTROY_NEST',
    OPERATION_TYPE_LABEL_PILLAGE_NEST: 'OPERATION_TYPE_LABEL_PILLAGE_NEST',
    OPERATION_TYPE_LABEL_TRANSPORT_FOOD: 'OPERATION_TYPE_LABEL_TRANSPORT_FOOD',
    OPERATION_TYPE_LABEL_BUILD_FORTIFICATION: 'OPERATION_TYPE_LABEL_BUILD_FORTIFICATION',
    OPERATION_TYPE_LABEL_BRING_BUG: 'OPERATION_TYPE_LABEL_BRING_BUG',

    NEW_SUB_NEST_OP_CR_TITLE: 'NEW_SUB_NEST_OP_CR_TITLE',
    NEW_SUB_NEST_OP_CR_NEST_POSITION_LABEL: 'NEW_SUB_NEST_OP_CR_NEST_POSITION_LABEL',
    NEW_SUB_NEST_OP_CR_NEST_POSITION_LABEL: 'NEW_SUB_NEST_OP_CR_NEST_POSITION_LABEL',
    NEW_SUB_NEST_OP_CR_CHOOSE_NEST_POSITION_BTN_LABEL: 'NEW_SUB_NEST_OP_CR_CHOOSE_NEST_POSITION_BTN_LABEL',
    NEW_SUB_NEST_OP_CR_WORKER_REQUIREMENTS_LABEL: 'NEW_SUB_NEST_OP_CR_WORKER_REQUIREMENTS_LABEL',
    NEW_SUB_NEST_OP_CR_NEST_NAME_LABEL: 'NEW_SUB_NEST_OP_CR_NEST_NAME_LABEL',

    DESTROY_NEST_OP_CR_TITLE: 'DESTROY_NEST_OP_CR_TITLE',
    DESTROY_NEST_OP_CR_NEST_TO_DESTROY_LABEL: 'DESTROY_NEST_OP_CR_NEST_TO_DESTROY_LABEL',
    DESTROY_NEST_OP_CR_CHOOSE_NEST_BTN_LABEL: 'DESTROY_NEST_OP_CR_CHOOSE_NEST_BTN_LABEL',

    PILLAGE_NEST_OP_CR_TITLE: 'PILLAGE_NEST_OP_CR_TITLE',
    PILLAGE_NEST_OP_CR_NEST_TO_PILLAGE_LABEL: 'PILLAGE_NEST_OP_CR_NEST_TO_PILLAGE_LABEL',
    PILLAGE_NEST_OP_CR_CHOOSE_NEST_TO_PILLAGE_BTN_LABEL: 'PILLAGE_NEST_OP_CR_CHOOSE_NEST_TO_PILLAGE_BTN_LABEL',
    PILLAGE_NEST_OP_CR_NEST_FOR_LOOT_LABEL: 'PILLAGE_NEST_OP_CR_NEST_FOR_LOOT_LABEL',

    TRANSPORT_FOOD_OP_CR_TITLE: 'TRANSPORT_FOOD_OP_CR_TITLE',
    TRANSPORT_FOOD_OP_CR_FROM_NEST_LABEL: 'TRANSPORT_FOOD_OP_CR_FROM_NEST_LABEL',
    TRANSPORT_FOOD_OP_CR_TO_NEST_LABEL: 'TRANSPORT_FOOD_OP_CR_TO_NEST_LABEL',

    BUILD_FORTIFICATION_OP_CR_TITLE: 'BUILD_FORTIFICATION_OP_CR_TITLE',
    BUILD_FORTIFICATION_OP_CR_NEST_LABEL: 'BUILD_FORTIFICATION_OP_CR_NEST_LABEL',

    BRING_BUG_OP_CR_TITLE: 'BRING_BUG_OP_CR_TITLE',
    BRING_BUG_OP_CR_NEST_LABEL: 'BRING_BUG_OP_CR_NEST_LABEL',

    NESTS_TAB_NEST_LABEL: 'NESTS_TAB_NEST_LABEL',

    NEST_MANAGER_MAIN_TAB_NAME_LABEL: 'NEST_MANAGER_MAIN_TAB_NAME_LABEL',
    NEST_MANAGER_MAIN_TAB_FOOD_COUNT_LABEL: 'NEST_MANAGER_MAIN_TAB_FOOD_COUNT_LABEL',
    NEST_MANAGER_MAIN_TAB_IS_NEST_MAIN_LABEL: 'NEST_MANAGER_MAIN_TAB_IS_NEST_MAIN_LABEL',
    NEST_MANAGER_MAIN_TAB_SHOW_NEST_BTN_LABEL: 'NEST_MANAGER_MAIN_TAB_SHOW_NEST_BTN_LABEL',

    NEST_MANAGER_EGG_TAB_TITLE: 'NEST_MANAGER_EGG_TAB_TITLE',
    NEST_MANAGER_EGG_TAB_FERTILIZE_LABEL: 'NEST_MANAGER_EGG_TAB_FERTILIZE_LABEL',
    NEST_MANAGER_EGG_TAB_LAY_EGG_BTN_LABEL: 'NEST_MANAGER_EGG_TAB_LAY_EGG_BTN_LABEL',
    NEST_MANAGER_EGG_TAB_COL_TITLE_NAME: 'NEST_MANAGER_EGG_TAB_COL_TITLE_NAME',
    NEST_MANAGER_EGG_TAB_COL_TITLE_GENOME: 'NEST_MANAGER_EGG_TAB_COL_TITLE_GENOME',
    NEST_MANAGER_EGG_TAB_COL_TITLE_FERTILIZED: 'NEST_MANAGER_EGG_TAB_COL_TITLE_FERTILIZED',
    NEST_MANAGER_EGG_TAB_COL_TITLE_PROGRESS: 'NEST_MANAGER_EGG_TAB_COL_TITLE_PROGRESS',
    NEST_MANAGER_EGG_TAB_COL_TITLE_STATE: 'NEST_MANAGER_EGG_TAB_COL_TITLE_STATE',
    NEST_MANAGER_EGG_TAB_COL_TITLE_CASTE: 'NEST_MANAGER_EGG_TAB_COL_TITLE_CASTE',
    NEST_MANAGER_EGG_TAB_COL_TITLE_ACTIONS: 'NEST_MANAGER_EGG_TAB_COL_TITLE_ACTIONS',
    NEST_MANAGER_EGG_TAB_EGG_TO_LARVA_BTN_LABEL: 'NEST_MANAGER_EGG_TAB_EGG_TO_LARVA_BTN_LABEL',
    NEST_MANAGER_LARVA_TAB_TITLE: 'NEST_MANAGER_LARVA_TAB_TITLE',
    NEST_MANAGER_LARVA_TAB_COL_TITLE_NAME: 'NEST_MANAGER_LARVA_TAB_COL_TITLE_NAME',
    NEST_MANAGER_LARVA_TAB_COL_TITLE_GENOME: 'NEST_MANAGER_LARVA_TAB_COL_TITLE_GENOME',
    NEST_MANAGER_LARVA_TAB_COL_TITLE_PROGRESS: 'NEST_MANAGER_LARVA_TAB_COL_TITLE_PROGRESS',
    NEST_MANAGER_LARVA_TAB_COL_TITLE_CASTE: 'NEST_MANAGER_LARVA_TAB_COL_TITLE_CASTE',
    NEST_MANAGER_LARVA_TAB_COL_TITLE_ACTIONS: 'NEST_MANAGER_LARVA_TAB_COL_TITLE_ACTIONS',

    EGG_STATE_DEVELOPMENT: 'EGG_STATE_DEVELOPMENT',
    EGG_STATE_READY: 'EGG_STATE_READY',
    EGG_STATE_SPOILED: 'EGG_STATE_SPOILED',

    ENEMIES_TAB_NO_ENEMY_LABEL: 'ENEMIES_TAB_NO_ENEMY_LABEL',
    ENEMIES_TAB_SHOW_ENEMY_BTN_LABEL: 'ENEMIES_TAB_SHOW_ENEMY_BTN_LABEL',

}



/***/ }),

/***/ "./gameApp/src/sync/antApi.js":
/*!************************************!*\
  !*** ./gameApp/src/sync/antApi.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AntApi: () => (/* binding */ AntApi)
/* harmony export */ });
class AntApi {

    constructor(requester) {
        this._requester = requester;
    }

    flyNuptialFlight(antId) {
        return this._requester.post(`/api/world/ants/${ antId }/fly_nuptial_flight`);
    }

    changeGuardianBehavior(antId, behaviorValue) {
        return this._requester.post(`/api/world/ants/${ antId }/guardian_behavior`, {
            guaridan_behavior: behaviorValue
        });
    }

    toggleCooperativeBehavior(antId, isEnabled) {
        return this._requester.post(`/api/world/ants/${ antId }/cooperative_behavior`, {
            is_enabled: isEnabled
        });
    }

    relocateToNest(antId, nestId) {
        return this._requester.post(`/api/world/ants/${ antId }/relocate`, {
            nest_id: nestId
        });
    }
}



/***/ }),

/***/ "./gameApp/src/sync/colonyApi.js":
/*!***************************************!*\
  !*** ./gameApp/src/sync/colonyApi.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ColonyApi: () => (/* binding */ ColonyApi)
/* harmony export */ });
class ColonyApi {

    constructor(requester) {
        this._requester = requester;
    }

    stopOperation(colonyId, operationId) {
        return this._requester.post(`/api/world/colonies/${ colonyId }/operations/${ operationId }/stop_operation`)
    }

    buildNewSubNestOperation(colonyId, buildingSite, workersCount, warriorsCount, nestName) {
        return this._requester.post(`/api/world/colonies/${ colonyId }/operations/build_new_sub_nest`, {
            building_site: [buildingSite.x, buildingSite.y],
            workers_count: workersCount,
            warriors_count: warriorsCount,
            nest_name: nestName
        });
    }

    destroyNestOperation(colonyId, warriorsCount, workersCount, nestId) {
        return this._requester.post(`/api/world/colonies/${ colonyId }/operations/destroy_nest`, {
            warriors_count: warriorsCount,
            workers_count: workersCount,
            nest_id: nestId
        });
    }

    pillageNestOperation(colonyId, pillagingNestId, nestForLootId, warriorsCount, workersCount) {
        return this._requester.post(`/api/world/colonies/${ colonyId }/operations/pillage_nest`, {
            nest_to_pillage_id: pillagingNestId,
            nest_for_loot_id: nestForLootId,
            warriors_count: warriorsCount,
            workers_count: workersCount
        });
        
    }

    transportFoodOperation(colonyId, fromNestId, toNestId, workersCount, warriorsCount) {
        return this._requester.post(`/api/world/colonies/${ colonyId }/operations/transport_food`, {
            from_nest_id: fromNestId,
            to_nest_id: toNestId,
            workers_count: workersCount,
            warriors_count: warriorsCount,
        });
    }

    buildFortificationsOpearation(colonyId, nestId, workersCount) {
        return this._requester.post(`/api/world/colonies/${ colonyId }/operations/build_fortification`, {
            nest_id: nestId,
            workers_count: workersCount
        });
    }

    bringBugOpearation(colonyId, nestId) {
        return this._requester.post(`/api/world/colonies/${ colonyId }/operations/bring_bug`, {
            nest_id: nestId
        });
    }
}



/***/ }),

/***/ "./gameApp/src/sync/nestApi.js":
/*!*************************************!*\
  !*** ./gameApp/src/sync/nestApi.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NestApi: () => (/* binding */ NestApi)
/* harmony export */ });
class NestApi {

    constructor(requester) {
        this._requester = requester;
    }

    layEggInNest(nestId, name, isFertilized) {
        return this._requester.post(`/api/world/nests/${nestId}/lay_egg`, {
            name,
            is_fertilized: isFertilized
        })
    }

    changeEggCaste(nestId, eggId, antType) {
        return this._requester.post(`/api/world/nests/${nestId}/eggs/${eggId}/change_caste`, {
            ant_type: antType
        });
    }

    changeEggName(nestId, eggId, name) {
        return this._requester.post(`/api/world/nests/${nestId}/eggs/${eggId}/change_name`, {
            name: name
        });
    }

    eggToLarvaChamber(nestId, eggId) {
        return this._requester.post(`/api/world/nests/${nestId}/eggs/${eggId}/move_to_larva_chamber`);
    }

    eggDelete(nestId, eggId) {
        return this._requester.post(`/api/world/nests/${nestId}/eggs/${eggId}/delete`);
    }

    larvaDelete(nestId, larvaId) {
        return this._requester.post(`/api/world/nests/${nestId}/larvae/${larvaId}/delete`);
    }

    renameNest(nestId, name) {
        return this._requester.post(`/api/world/nests/${nestId}/rename`, {
            name: name
        });
    }

}



/***/ }),

/***/ "./gameApp/src/sync/nuptialEnvironmentApi.js":
/*!***************************************************!*\
  !*** ./gameApp/src/sync/nuptialEnvironmentApi.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NuptialEnvironmentApi: () => (/* binding */ NuptialEnvironmentApi)
/* harmony export */ });
class NuptialEnvironmentApi {

    constructor(requester) {
        this._requester = requester;
    }

    saveSpecieSchema(specieSchema) {
        this._requester.post('/api/world/nuptial_environment/specie/specie_schema', {
            specie_schema: specieSchema
        });
    }

    foundColony(queenId, nuptialMaleId, nestBuildingSite, colonyName) {
        return this._requester.post('/api/world/nuptial_environment/found_colony', {
            queen_id: queenId,
            nuptial_male_id: nuptialMaleId,
            nest_building_site: [nestBuildingSite.x, nestBuildingSite.y],
            colony_name: colonyName
        });
    }

    bornNewAntara() {
        return this._requester.post(`/api/world/nuptial_environment/born_new_antara`);
    }
    
}



/***/ }),

/***/ "./gameApp/src/sync/serverConnection.js":
/*!**********************************************!*\
  !*** ./gameApp/src/sync/serverConnection.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ServerConnection: () => (/* binding */ ServerConnection)
/* harmony export */ });
/* harmony import */ var _common_utils_eventEmitter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @common/utils/eventEmitter */ "./common/utils/eventEmitter.js");


class ServerConnection {

    constructor() {
        this.events = new _common_utils_eventEmitter__WEBPACK_IMPORTED_MODULE_0__.EventEmitter();
    }

    connect(socketURL) {
        return new Promise((res) => {
            this._socket = new WebSocket(socketURL);
            this._socket.onmessage = this._emitMessage.bind(this);
            this._socket.onopen = () => {
                res();
            }
        });
    }

    disconnect() {
        this._socket.close();
    }

    send(msg) {
        this._socket.send(JSON.stringify(msg));
    }

    _emitMessage(event) {
        this.events.emit('message', JSON.parse(event.data));
    }
}



/***/ }),

/***/ "./gameApp/src/utils/distance.js":
/*!***************************************!*\
  !*** ./gameApp/src/utils/distance.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   distance: () => (/* binding */ distance),
/* harmony export */   distance_point: () => (/* binding */ distance_point)
/* harmony export */ });
function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow((x1  -x2), 2) + Math.pow((y1 - y2), 2));
}

function distance_point(point1, point2) {
    return distance(point1.x, point1.y, point2.x, point2.y)
}



/***/ }),

/***/ "./node_modules/axios/lib/adapters/adapters.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/adapters/adapters.js ***!
  \*****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _http_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./http.js */ "./node_modules/axios/lib/helpers/null.js");
/* harmony import */ var _xhr_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./xhr.js */ "./node_modules/axios/lib/adapters/xhr.js");
/* harmony import */ var _fetch_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./fetch.js */ "./node_modules/axios/lib/adapters/fetch.js");
/* harmony import */ var _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../core/AxiosError.js */ "./node_modules/axios/lib/core/AxiosError.js");






const knownAdapters = {
  http: _http_js__WEBPACK_IMPORTED_MODULE_0__["default"],
  xhr: _xhr_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  fetch: _fetch_js__WEBPACK_IMPORTED_MODULE_2__["default"]
}

_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].forEach(knownAdapters, (fn, value) => {
  if (fn) {
    try {
      Object.defineProperty(fn, 'name', {value});
    } catch (e) {
      // eslint-disable-next-line no-empty
    }
    Object.defineProperty(fn, 'adapterName', {value});
  }
});

const renderReason = (reason) => `- ${reason}`;

const isResolvedHandle = (adapter) => _utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].isFunction(adapter) || adapter === null || adapter === false;

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  getAdapter: (adapters) => {
    adapters = _utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].isArray(adapters) ? adapters : [adapters];

    const {length} = adapters;
    let nameOrAdapter;
    let adapter;

    const rejectedReasons = {};

    for (let i = 0; i < length; i++) {
      nameOrAdapter = adapters[i];
      let id;

      adapter = nameOrAdapter;

      if (!isResolvedHandle(nameOrAdapter)) {
        adapter = knownAdapters[(id = String(nameOrAdapter)).toLowerCase()];

        if (adapter === undefined) {
          throw new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_4__["default"](`Unknown adapter '${id}'`);
        }
      }

      if (adapter) {
        break;
      }

      rejectedReasons[id || '#' + i] = adapter;
    }

    if (!adapter) {

      const reasons = Object.entries(rejectedReasons)
        .map(([id, state]) => `adapter ${id} ` +
          (state === false ? 'is not supported by the environment' : 'is not available in the build')
        );

      let s = length ?
        (reasons.length > 1 ? 'since :\n' + reasons.map(renderReason).join('\n') : ' ' + renderReason(reasons[0])) :
        'as no adapter specified';

      throw new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_4__["default"](
        `There is no suitable adapter to dispatch the request ` + s,
        'ERR_NOT_SUPPORT'
      );
    }

    return adapter;
  },
  adapters: knownAdapters
});


/***/ }),

/***/ "./node_modules/axios/lib/adapters/fetch.js":
/*!**************************************************!*\
  !*** ./node_modules/axios/lib/adapters/fetch.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _platform_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../platform/index.js */ "./node_modules/axios/lib/platform/index.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../core/AxiosError.js */ "./node_modules/axios/lib/core/AxiosError.js");
/* harmony import */ var _helpers_composeSignals_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../helpers/composeSignals.js */ "./node_modules/axios/lib/helpers/composeSignals.js");
/* harmony import */ var _helpers_trackStream_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../helpers/trackStream.js */ "./node_modules/axios/lib/helpers/trackStream.js");
/* harmony import */ var _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../core/AxiosHeaders.js */ "./node_modules/axios/lib/core/AxiosHeaders.js");
/* harmony import */ var _helpers_progressEventReducer_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../helpers/progressEventReducer.js */ "./node_modules/axios/lib/helpers/progressEventReducer.js");
/* harmony import */ var _helpers_resolveConfig_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../helpers/resolveConfig.js */ "./node_modules/axios/lib/helpers/resolveConfig.js");
/* harmony import */ var _core_settle_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../core/settle.js */ "./node_modules/axios/lib/core/settle.js");










const isFetchSupported = typeof fetch === 'function' && typeof Request === 'function' && typeof Response === 'function';
const isReadableStreamSupported = isFetchSupported && typeof ReadableStream === 'function';

// used only inside the fetch adapter
const encodeText = isFetchSupported && (typeof TextEncoder === 'function' ?
    ((encoder) => (str) => encoder.encode(str))(new TextEncoder()) :
    async (str) => new Uint8Array(await new Response(str).arrayBuffer())
);

const test = (fn, ...args) => {
  try {
    return !!fn(...args);
  } catch (e) {
    return false
  }
}

const supportsRequestStream = isReadableStreamSupported && test(() => {
  let duplexAccessed = false;

  const hasContentType = new Request(_platform_index_js__WEBPACK_IMPORTED_MODULE_0__["default"].origin, {
    body: new ReadableStream(),
    method: 'POST',
    get duplex() {
      duplexAccessed = true;
      return 'half';
    },
  }).headers.has('Content-Type');

  return duplexAccessed && !hasContentType;
});

const DEFAULT_CHUNK_SIZE = 64 * 1024;

const supportsResponseStream = isReadableStreamSupported &&
  test(() => _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isReadableStream(new Response('').body));


const resolvers = {
  stream: supportsResponseStream && ((res) => res.body)
};

isFetchSupported && (((res) => {
  ['text', 'arrayBuffer', 'blob', 'formData', 'stream'].forEach(type => {
    !resolvers[type] && (resolvers[type] = _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isFunction(res[type]) ? (res) => res[type]() :
      (_, config) => {
        throw new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_2__["default"](`Response type '${type}' is not supported`, _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_2__["default"].ERR_NOT_SUPPORT, config);
      })
  });
})(new Response));

const getBodyLength = async (body) => {
  if (body == null) {
    return 0;
  }

  if(_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isBlob(body)) {
    return body.size;
  }

  if(_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isSpecCompliantForm(body)) {
    const _request = new Request(_platform_index_js__WEBPACK_IMPORTED_MODULE_0__["default"].origin, {
      method: 'POST',
      body,
    });
    return (await _request.arrayBuffer()).byteLength;
  }

  if(_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isArrayBufferView(body) || _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isArrayBuffer(body)) {
    return body.byteLength;
  }

  if(_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isURLSearchParams(body)) {
    body = body + '';
  }

  if(_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isString(body)) {
    return (await encodeText(body)).byteLength;
  }
}

const resolveBodyLength = async (headers, body) => {
  const length = _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].toFiniteNumber(headers.getContentLength());

  return length == null ? getBodyLength(body) : length;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isFetchSupported && (async (config) => {
  let {
    url,
    method,
    data,
    signal,
    cancelToken,
    timeout,
    onDownloadProgress,
    onUploadProgress,
    responseType,
    headers,
    withCredentials = 'same-origin',
    fetchOptions
  } = (0,_helpers_resolveConfig_js__WEBPACK_IMPORTED_MODULE_3__["default"])(config);

  responseType = responseType ? (responseType + '').toLowerCase() : 'text';

  let composedSignal = (0,_helpers_composeSignals_js__WEBPACK_IMPORTED_MODULE_4__["default"])([signal, cancelToken && cancelToken.toAbortSignal()], timeout);

  let request;

  const unsubscribe = composedSignal && composedSignal.unsubscribe && (() => {
      composedSignal.unsubscribe();
  });

  let requestContentLength;

  try {
    if (
      onUploadProgress && supportsRequestStream && method !== 'get' && method !== 'head' &&
      (requestContentLength = await resolveBodyLength(headers, data)) !== 0
    ) {
      let _request = new Request(url, {
        method: 'POST',
        body: data,
        duplex: "half"
      });

      let contentTypeHeader;

      if (_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isFormData(data) && (contentTypeHeader = _request.headers.get('content-type'))) {
        headers.setContentType(contentTypeHeader)
      }

      if (_request.body) {
        const [onProgress, flush] = (0,_helpers_progressEventReducer_js__WEBPACK_IMPORTED_MODULE_5__.progressEventDecorator)(
          requestContentLength,
          (0,_helpers_progressEventReducer_js__WEBPACK_IMPORTED_MODULE_5__.progressEventReducer)((0,_helpers_progressEventReducer_js__WEBPACK_IMPORTED_MODULE_5__.asyncDecorator)(onUploadProgress))
        );

        data = (0,_helpers_trackStream_js__WEBPACK_IMPORTED_MODULE_6__.trackStream)(_request.body, DEFAULT_CHUNK_SIZE, onProgress, flush);
      }
    }

    if (!_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isString(withCredentials)) {
      withCredentials = withCredentials ? 'include' : 'omit';
    }

    // Cloudflare Workers throws when credentials are defined
    // see https://github.com/cloudflare/workerd/issues/902
    const isCredentialsSupported = "credentials" in Request.prototype;
    request = new Request(url, {
      ...fetchOptions,
      signal: composedSignal,
      method: method.toUpperCase(),
      headers: headers.normalize().toJSON(),
      body: data,
      duplex: "half",
      credentials: isCredentialsSupported ? withCredentials : undefined
    });

    let response = await fetch(request);

    const isStreamResponse = supportsResponseStream && (responseType === 'stream' || responseType === 'response');

    if (supportsResponseStream && (onDownloadProgress || (isStreamResponse && unsubscribe))) {
      const options = {};

      ['status', 'statusText', 'headers'].forEach(prop => {
        options[prop] = response[prop];
      });

      const responseContentLength = _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].toFiniteNumber(response.headers.get('content-length'));

      const [onProgress, flush] = onDownloadProgress && (0,_helpers_progressEventReducer_js__WEBPACK_IMPORTED_MODULE_5__.progressEventDecorator)(
        responseContentLength,
        (0,_helpers_progressEventReducer_js__WEBPACK_IMPORTED_MODULE_5__.progressEventReducer)((0,_helpers_progressEventReducer_js__WEBPACK_IMPORTED_MODULE_5__.asyncDecorator)(onDownloadProgress), true)
      ) || [];

      response = new Response(
        (0,_helpers_trackStream_js__WEBPACK_IMPORTED_MODULE_6__.trackStream)(response.body, DEFAULT_CHUNK_SIZE, onProgress, () => {
          flush && flush();
          unsubscribe && unsubscribe();
        }),
        options
      );
    }

    responseType = responseType || 'text';

    let responseData = await resolvers[_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].findKey(resolvers, responseType) || 'text'](response, config);

    !isStreamResponse && unsubscribe && unsubscribe();

    return await new Promise((resolve, reject) => {
      (0,_core_settle_js__WEBPACK_IMPORTED_MODULE_7__["default"])(resolve, reject, {
        data: responseData,
        headers: _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_8__["default"].from(response.headers),
        status: response.status,
        statusText: response.statusText,
        config,
        request
      })
    })
  } catch (err) {
    unsubscribe && unsubscribe();

    if (err && err.name === 'TypeError' && /fetch/i.test(err.message)) {
      throw Object.assign(
        new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_2__["default"]('Network Error', _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_2__["default"].ERR_NETWORK, config, request),
        {
          cause: err.cause || err
        }
      )
    }

    throw _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_2__["default"].from(err, err && err.code, config, request);
  }
}));




/***/ }),

/***/ "./node_modules/axios/lib/adapters/xhr.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/adapters/xhr.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./../utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _core_settle_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./../core/settle.js */ "./node_modules/axios/lib/core/settle.js");
/* harmony import */ var _defaults_transitional_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../defaults/transitional.js */ "./node_modules/axios/lib/defaults/transitional.js");
/* harmony import */ var _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../core/AxiosError.js */ "./node_modules/axios/lib/core/AxiosError.js");
/* harmony import */ var _cancel_CanceledError_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../cancel/CanceledError.js */ "./node_modules/axios/lib/cancel/CanceledError.js");
/* harmony import */ var _helpers_parseProtocol_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../helpers/parseProtocol.js */ "./node_modules/axios/lib/helpers/parseProtocol.js");
/* harmony import */ var _platform_index_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../platform/index.js */ "./node_modules/axios/lib/platform/index.js");
/* harmony import */ var _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/AxiosHeaders.js */ "./node_modules/axios/lib/core/AxiosHeaders.js");
/* harmony import */ var _helpers_progressEventReducer_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../helpers/progressEventReducer.js */ "./node_modules/axios/lib/helpers/progressEventReducer.js");
/* harmony import */ var _helpers_resolveConfig_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers/resolveConfig.js */ "./node_modules/axios/lib/helpers/resolveConfig.js");











const isXHRAdapterSupported = typeof XMLHttpRequest !== 'undefined';

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isXHRAdapterSupported && function (config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    const _config = (0,_helpers_resolveConfig_js__WEBPACK_IMPORTED_MODULE_0__["default"])(config);
    let requestData = _config.data;
    const requestHeaders = _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__["default"].from(_config.headers).normalize();
    let {responseType, onUploadProgress, onDownloadProgress} = _config;
    let onCanceled;
    let uploadThrottled, downloadThrottled;
    let flushUpload, flushDownload;

    function done() {
      flushUpload && flushUpload(); // flush events
      flushDownload && flushDownload(); // flush events

      _config.cancelToken && _config.cancelToken.unsubscribe(onCanceled);

      _config.signal && _config.signal.removeEventListener('abort', onCanceled);
    }

    let request = new XMLHttpRequest();

    request.open(_config.method.toUpperCase(), _config.url, true);

    // Set the request timeout in MS
    request.timeout = _config.timeout;

    function onloadend() {
      if (!request) {
        return;
      }
      // Prepare the response
      const responseHeaders = _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__["default"].from(
        'getAllResponseHeaders' in request && request.getAllResponseHeaders()
      );
      const responseData = !responseType || responseType === 'text' || responseType === 'json' ?
        request.responseText : request.response;
      const response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      };

      (0,_core_settle_js__WEBPACK_IMPORTED_MODULE_2__["default"])(function _resolve(value) {
        resolve(value);
        done();
      }, function _reject(err) {
        reject(err);
        done();
      }, response);

      // Clean up request
      request = null;
    }

    if ('onloadend' in request) {
      // Use onloadend if available
      request.onloadend = onloadend;
    } else {
      // Listen for ready state to emulate onloadend
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }

        // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        }
        // readystate handler is calling before onerror or ontimeout handlers,
        // so we should call onloadend on the next 'tick'
        setTimeout(onloadend);
      };
    }

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_3__["default"]('Request aborted', _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_3__["default"].ECONNABORTED, config, request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_3__["default"]('Network Error', _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_3__["default"].ERR_NETWORK, config, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      let timeoutErrorMessage = _config.timeout ? 'timeout of ' + _config.timeout + 'ms exceeded' : 'timeout exceeded';
      const transitional = _config.transitional || _defaults_transitional_js__WEBPACK_IMPORTED_MODULE_4__["default"];
      if (_config.timeoutErrorMessage) {
        timeoutErrorMessage = _config.timeoutErrorMessage;
      }
      reject(new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_3__["default"](
        timeoutErrorMessage,
        transitional.clarifyTimeoutError ? _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_3__["default"].ETIMEDOUT : _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_3__["default"].ECONNABORTED,
        config,
        request));

      // Clean up request
      request = null;
    };

    // Remove Content-Type if data is undefined
    requestData === undefined && requestHeaders.setContentType(null);

    // Add headers to the request
    if ('setRequestHeader' in request) {
      _utils_js__WEBPACK_IMPORTED_MODULE_5__["default"].forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
        request.setRequestHeader(key, val);
      });
    }

    // Add withCredentials to request if needed
    if (!_utils_js__WEBPACK_IMPORTED_MODULE_5__["default"].isUndefined(_config.withCredentials)) {
      request.withCredentials = !!_config.withCredentials;
    }

    // Add responseType to request if needed
    if (responseType && responseType !== 'json') {
      request.responseType = _config.responseType;
    }

    // Handle progress if needed
    if (onDownloadProgress) {
      ([downloadThrottled, flushDownload] = (0,_helpers_progressEventReducer_js__WEBPACK_IMPORTED_MODULE_6__.progressEventReducer)(onDownloadProgress, true));
      request.addEventListener('progress', downloadThrottled);
    }

    // Not all browsers support upload events
    if (onUploadProgress && request.upload) {
      ([uploadThrottled, flushUpload] = (0,_helpers_progressEventReducer_js__WEBPACK_IMPORTED_MODULE_6__.progressEventReducer)(onUploadProgress));

      request.upload.addEventListener('progress', uploadThrottled);

      request.upload.addEventListener('loadend', flushUpload);
    }

    if (_config.cancelToken || _config.signal) {
      // Handle cancellation
      // eslint-disable-next-line func-names
      onCanceled = cancel => {
        if (!request) {
          return;
        }
        reject(!cancel || cancel.type ? new _cancel_CanceledError_js__WEBPACK_IMPORTED_MODULE_7__["default"](null, config, request) : cancel);
        request.abort();
        request = null;
      };

      _config.cancelToken && _config.cancelToken.subscribe(onCanceled);
      if (_config.signal) {
        _config.signal.aborted ? onCanceled() : _config.signal.addEventListener('abort', onCanceled);
      }
    }

    const protocol = (0,_helpers_parseProtocol_js__WEBPACK_IMPORTED_MODULE_8__["default"])(_config.url);

    if (protocol && _platform_index_js__WEBPACK_IMPORTED_MODULE_9__["default"].protocols.indexOf(protocol) === -1) {
      reject(new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_3__["default"]('Unsupported protocol ' + protocol + ':', _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_3__["default"].ERR_BAD_REQUEST, config));
      return;
    }


    // Send the request
    request.send(requestData || null);
  });
});


/***/ }),

/***/ "./node_modules/axios/lib/axios.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/axios.js ***!
  \*****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _helpers_bind_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./helpers/bind.js */ "./node_modules/axios/lib/helpers/bind.js");
/* harmony import */ var _core_Axios_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./core/Axios.js */ "./node_modules/axios/lib/core/Axios.js");
/* harmony import */ var _core_mergeConfig_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./core/mergeConfig.js */ "./node_modules/axios/lib/core/mergeConfig.js");
/* harmony import */ var _defaults_index_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./defaults/index.js */ "./node_modules/axios/lib/defaults/index.js");
/* harmony import */ var _helpers_formDataToJSON_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./helpers/formDataToJSON.js */ "./node_modules/axios/lib/helpers/formDataToJSON.js");
/* harmony import */ var _cancel_CanceledError_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./cancel/CanceledError.js */ "./node_modules/axios/lib/cancel/CanceledError.js");
/* harmony import */ var _cancel_CancelToken_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./cancel/CancelToken.js */ "./node_modules/axios/lib/cancel/CancelToken.js");
/* harmony import */ var _cancel_isCancel_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./cancel/isCancel.js */ "./node_modules/axios/lib/cancel/isCancel.js");
/* harmony import */ var _env_data_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./env/data.js */ "./node_modules/axios/lib/env/data.js");
/* harmony import */ var _helpers_toFormData_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./helpers/toFormData.js */ "./node_modules/axios/lib/helpers/toFormData.js");
/* harmony import */ var _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./core/AxiosError.js */ "./node_modules/axios/lib/core/AxiosError.js");
/* harmony import */ var _helpers_spread_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./helpers/spread.js */ "./node_modules/axios/lib/helpers/spread.js");
/* harmony import */ var _helpers_isAxiosError_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./helpers/isAxiosError.js */ "./node_modules/axios/lib/helpers/isAxiosError.js");
/* harmony import */ var _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./core/AxiosHeaders.js */ "./node_modules/axios/lib/core/AxiosHeaders.js");
/* harmony import */ var _adapters_adapters_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./adapters/adapters.js */ "./node_modules/axios/lib/adapters/adapters.js");
/* harmony import */ var _helpers_HttpStatusCode_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./helpers/HttpStatusCode.js */ "./node_modules/axios/lib/helpers/HttpStatusCode.js");




















/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 *
 * @returns {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  const context = new _core_Axios_js__WEBPACK_IMPORTED_MODULE_0__["default"](defaultConfig);
  const instance = (0,_helpers_bind_js__WEBPACK_IMPORTED_MODULE_1__["default"])(_core_Axios_js__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.request, context);

  // Copy axios.prototype to instance
  _utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].extend(instance, _core_Axios_js__WEBPACK_IMPORTED_MODULE_0__["default"].prototype, context, {allOwnKeys: true});

  // Copy context to instance
  _utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].extend(instance, context, null, {allOwnKeys: true});

  // Factory for creating new instances
  instance.create = function create(instanceConfig) {
    return createInstance((0,_core_mergeConfig_js__WEBPACK_IMPORTED_MODULE_3__["default"])(defaultConfig, instanceConfig));
  };

  return instance;
}

// Create the default instance to be exported
const axios = createInstance(_defaults_index_js__WEBPACK_IMPORTED_MODULE_4__["default"]);

// Expose Axios class to allow class inheritance
axios.Axios = _core_Axios_js__WEBPACK_IMPORTED_MODULE_0__["default"];

// Expose Cancel & CancelToken
axios.CanceledError = _cancel_CanceledError_js__WEBPACK_IMPORTED_MODULE_5__["default"];
axios.CancelToken = _cancel_CancelToken_js__WEBPACK_IMPORTED_MODULE_6__["default"];
axios.isCancel = _cancel_isCancel_js__WEBPACK_IMPORTED_MODULE_7__["default"];
axios.VERSION = _env_data_js__WEBPACK_IMPORTED_MODULE_8__.VERSION;
axios.toFormData = _helpers_toFormData_js__WEBPACK_IMPORTED_MODULE_9__["default"];

// Expose AxiosError class
axios.AxiosError = _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_10__["default"];

// alias for CanceledError for backward compatibility
axios.Cancel = axios.CanceledError;

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};

axios.spread = _helpers_spread_js__WEBPACK_IMPORTED_MODULE_11__["default"];

// Expose isAxiosError
axios.isAxiosError = _helpers_isAxiosError_js__WEBPACK_IMPORTED_MODULE_12__["default"];

// Expose mergeConfig
axios.mergeConfig = _core_mergeConfig_js__WEBPACK_IMPORTED_MODULE_3__["default"];

axios.AxiosHeaders = _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_13__["default"];

axios.formToJSON = thing => (0,_helpers_formDataToJSON_js__WEBPACK_IMPORTED_MODULE_14__["default"])(_utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].isHTMLForm(thing) ? new FormData(thing) : thing);

axios.getAdapter = _adapters_adapters_js__WEBPACK_IMPORTED_MODULE_15__["default"].getAdapter;

axios.HttpStatusCode = _helpers_HttpStatusCode_js__WEBPACK_IMPORTED_MODULE_16__["default"];

axios.default = axios;

// this module should only have a default export
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (axios);


/***/ }),

/***/ "./node_modules/axios/lib/cancel/CancelToken.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/cancel/CancelToken.js ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _CanceledError_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CanceledError.js */ "./node_modules/axios/lib/cancel/CanceledError.js");




/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @param {Function} executor The executor function.
 *
 * @returns {CancelToken}
 */
class CancelToken {
  constructor(executor) {
    if (typeof executor !== 'function') {
      throw new TypeError('executor must be a function.');
    }

    let resolvePromise;

    this.promise = new Promise(function promiseExecutor(resolve) {
      resolvePromise = resolve;
    });

    const token = this;

    // eslint-disable-next-line func-names
    this.promise.then(cancel => {
      if (!token._listeners) return;

      let i = token._listeners.length;

      while (i-- > 0) {
        token._listeners[i](cancel);
      }
      token._listeners = null;
    });

    // eslint-disable-next-line func-names
    this.promise.then = onfulfilled => {
      let _resolve;
      // eslint-disable-next-line func-names
      const promise = new Promise(resolve => {
        token.subscribe(resolve);
        _resolve = resolve;
      }).then(onfulfilled);

      promise.cancel = function reject() {
        token.unsubscribe(_resolve);
      };

      return promise;
    };

    executor(function cancel(message, config, request) {
      if (token.reason) {
        // Cancellation has already been requested
        return;
      }

      token.reason = new _CanceledError_js__WEBPACK_IMPORTED_MODULE_0__["default"](message, config, request);
      resolvePromise(token.reason);
    });
  }

  /**
   * Throws a `CanceledError` if cancellation has been requested.
   */
  throwIfRequested() {
    if (this.reason) {
      throw this.reason;
    }
  }

  /**
   * Subscribe to the cancel signal
   */

  subscribe(listener) {
    if (this.reason) {
      listener(this.reason);
      return;
    }

    if (this._listeners) {
      this._listeners.push(listener);
    } else {
      this._listeners = [listener];
    }
  }

  /**
   * Unsubscribe from the cancel signal
   */

  unsubscribe(listener) {
    if (!this._listeners) {
      return;
    }
    const index = this._listeners.indexOf(listener);
    if (index !== -1) {
      this._listeners.splice(index, 1);
    }
  }

  toAbortSignal() {
    const controller = new AbortController();

    const abort = (err) => {
      controller.abort(err);
    };

    this.subscribe(abort);

    controller.signal.unsubscribe = () => this.unsubscribe(abort);

    return controller.signal;
  }

  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  static source() {
    let cancel;
    const token = new CancelToken(function executor(c) {
      cancel = c;
    });
    return {
      token,
      cancel
    };
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CancelToken);


/***/ }),

/***/ "./node_modules/axios/lib/cancel/CanceledError.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/cancel/CanceledError.js ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/AxiosError.js */ "./node_modules/axios/lib/core/AxiosError.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils.js */ "./node_modules/axios/lib/utils.js");





/**
 * A `CanceledError` is an object that is thrown when an operation is canceled.
 *
 * @param {string=} message The message.
 * @param {Object=} config The config.
 * @param {Object=} request The request.
 *
 * @returns {CanceledError} The created error.
 */
function CanceledError(message, config, request) {
  // eslint-disable-next-line no-eq-null,eqeqeq
  _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_0__["default"].call(this, message == null ? 'canceled' : message, _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_0__["default"].ERR_CANCELED, config, request);
  this.name = 'CanceledError';
}

_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].inherits(CanceledError, _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_0__["default"], {
  __CANCEL__: true
});

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CanceledError);


/***/ }),

/***/ "./node_modules/axios/lib/cancel/isCancel.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/cancel/isCancel.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isCancel)
/* harmony export */ });


function isCancel(value) {
  return !!(value && value.__CANCEL__);
}


/***/ }),

/***/ "./node_modules/axios/lib/core/Axios.js":
/*!**********************************************!*\
  !*** ./node_modules/axios/lib/core/Axios.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./../utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _helpers_buildURL_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../helpers/buildURL.js */ "./node_modules/axios/lib/helpers/buildURL.js");
/* harmony import */ var _InterceptorManager_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./InterceptorManager.js */ "./node_modules/axios/lib/core/InterceptorManager.js");
/* harmony import */ var _dispatchRequest_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./dispatchRequest.js */ "./node_modules/axios/lib/core/dispatchRequest.js");
/* harmony import */ var _mergeConfig_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./mergeConfig.js */ "./node_modules/axios/lib/core/mergeConfig.js");
/* harmony import */ var _buildFullPath_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./buildFullPath.js */ "./node_modules/axios/lib/core/buildFullPath.js");
/* harmony import */ var _helpers_validator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers/validator.js */ "./node_modules/axios/lib/helpers/validator.js");
/* harmony import */ var _AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./AxiosHeaders.js */ "./node_modules/axios/lib/core/AxiosHeaders.js");











const validators = _helpers_validator_js__WEBPACK_IMPORTED_MODULE_0__["default"].validators;

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 *
 * @return {Axios} A new instance of Axios
 */
class Axios {
  constructor(instanceConfig) {
    this.defaults = instanceConfig;
    this.interceptors = {
      request: new _InterceptorManager_js__WEBPACK_IMPORTED_MODULE_1__["default"](),
      response: new _InterceptorManager_js__WEBPACK_IMPORTED_MODULE_1__["default"]()
    };
  }

  /**
   * Dispatch a request
   *
   * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
   * @param {?Object} config
   *
   * @returns {Promise} The Promise to be fulfilled
   */
  async request(configOrUrl, config) {
    try {
      return await this._request(configOrUrl, config);
    } catch (err) {
      if (err instanceof Error) {
        let dummy = {};

        Error.captureStackTrace ? Error.captureStackTrace(dummy) : (dummy = new Error());

        // slice off the Error: ... line
        const stack = dummy.stack ? dummy.stack.replace(/^.+\n/, '') : '';
        try {
          if (!err.stack) {
            err.stack = stack;
            // match without the 2 top stack lines
          } else if (stack && !String(err.stack).endsWith(stack.replace(/^.+\n.+\n/, ''))) {
            err.stack += '\n' + stack
          }
        } catch (e) {
          // ignore the case where "stack" is an un-writable property
        }
      }

      throw err;
    }
  }

  _request(configOrUrl, config) {
    /*eslint no-param-reassign:0*/
    // Allow for axios('example/url'[, config]) a la fetch API
    if (typeof configOrUrl === 'string') {
      config = config || {};
      config.url = configOrUrl;
    } else {
      config = configOrUrl || {};
    }

    config = (0,_mergeConfig_js__WEBPACK_IMPORTED_MODULE_2__["default"])(this.defaults, config);

    const {transitional, paramsSerializer, headers} = config;

    if (transitional !== undefined) {
      _helpers_validator_js__WEBPACK_IMPORTED_MODULE_0__["default"].assertOptions(transitional, {
        silentJSONParsing: validators.transitional(validators.boolean),
        forcedJSONParsing: validators.transitional(validators.boolean),
        clarifyTimeoutError: validators.transitional(validators.boolean)
      }, false);
    }

    if (paramsSerializer != null) {
      if (_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].isFunction(paramsSerializer)) {
        config.paramsSerializer = {
          serialize: paramsSerializer
        }
      } else {
        _helpers_validator_js__WEBPACK_IMPORTED_MODULE_0__["default"].assertOptions(paramsSerializer, {
          encode: validators.function,
          serialize: validators.function
        }, true);
      }
    }

    // Set config.allowAbsoluteUrls
    if (config.allowAbsoluteUrls !== undefined) {
      // do nothing
    } else if (this.defaults.allowAbsoluteUrls !== undefined) {
      config.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls;
    } else {
      config.allowAbsoluteUrls = true;
    }

    _helpers_validator_js__WEBPACK_IMPORTED_MODULE_0__["default"].assertOptions(config, {
      baseUrl: validators.spelling('baseURL'),
      withXsrfToken: validators.spelling('withXSRFToken')
    }, true);

    // Set config.method
    config.method = (config.method || this.defaults.method || 'get').toLowerCase();

    // Flatten headers
    let contextHeaders = headers && _utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].merge(
      headers.common,
      headers[config.method]
    );

    headers && _utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].forEach(
      ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
      (method) => {
        delete headers[method];
      }
    );

    config.headers = _AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_4__["default"].concat(contextHeaders, headers);

    // filter out skipped interceptors
    const requestInterceptorChain = [];
    let synchronousRequestInterceptors = true;
    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
      if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
        return;
      }

      synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

      requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
    });

    const responseInterceptorChain = [];
    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
      responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
    });

    let promise;
    let i = 0;
    let len;

    if (!synchronousRequestInterceptors) {
      const chain = [_dispatchRequest_js__WEBPACK_IMPORTED_MODULE_5__["default"].bind(this), undefined];
      chain.unshift.apply(chain, requestInterceptorChain);
      chain.push.apply(chain, responseInterceptorChain);
      len = chain.length;

      promise = Promise.resolve(config);

      while (i < len) {
        promise = promise.then(chain[i++], chain[i++]);
      }

      return promise;
    }

    len = requestInterceptorChain.length;

    let newConfig = config;

    i = 0;

    while (i < len) {
      const onFulfilled = requestInterceptorChain[i++];
      const onRejected = requestInterceptorChain[i++];
      try {
        newConfig = onFulfilled(newConfig);
      } catch (error) {
        onRejected.call(this, error);
        break;
      }
    }

    try {
      promise = _dispatchRequest_js__WEBPACK_IMPORTED_MODULE_5__["default"].call(this, newConfig);
    } catch (error) {
      return Promise.reject(error);
    }

    i = 0;
    len = responseInterceptorChain.length;

    while (i < len) {
      promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
    }

    return promise;
  }

  getUri(config) {
    config = (0,_mergeConfig_js__WEBPACK_IMPORTED_MODULE_2__["default"])(this.defaults, config);
    const fullPath = (0,_buildFullPath_js__WEBPACK_IMPORTED_MODULE_6__["default"])(config.baseURL, config.url, config.allowAbsoluteUrls);
    return (0,_helpers_buildURL_js__WEBPACK_IMPORTED_MODULE_7__["default"])(fullPath, config.params, config.paramsSerializer);
  }
}

// Provide aliases for supported request methods
_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request((0,_mergeConfig_js__WEBPACK_IMPORTED_MODULE_2__["default"])(config || {}, {
      method,
      url,
      data: (config || {}).data
    }));
  };
});

_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/

  function generateHTTPMethod(isForm) {
    return function httpMethod(url, data, config) {
      return this.request((0,_mergeConfig_js__WEBPACK_IMPORTED_MODULE_2__["default"])(config || {}, {
        method,
        headers: isForm ? {
          'Content-Type': 'multipart/form-data'
        } : {},
        url,
        data
      }));
    };
  }

  Axios.prototype[method] = generateHTTPMethod();

  Axios.prototype[method + 'Form'] = generateHTTPMethod(true);
});

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Axios);


/***/ }),

/***/ "./node_modules/axios/lib/core/AxiosError.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/core/AxiosError.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils.js */ "./node_modules/axios/lib/utils.js");




/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [config] The config.
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 *
 * @returns {Error} The created error.
 */
function AxiosError(message, code, config, request, response) {
  Error.call(this);

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  } else {
    this.stack = (new Error()).stack;
  }

  this.message = message;
  this.name = 'AxiosError';
  code && (this.code = code);
  config && (this.config = config);
  request && (this.request = request);
  if (response) {
    this.response = response;
    this.status = response.status ? response.status : null;
  }
}

_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].inherits(AxiosError, Error, {
  toJSON: function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].toJSONObject(this.config),
      code: this.code,
      status: this.status
    };
  }
});

const prototype = AxiosError.prototype;
const descriptors = {};

[
  'ERR_BAD_OPTION_VALUE',
  'ERR_BAD_OPTION',
  'ECONNABORTED',
  'ETIMEDOUT',
  'ERR_NETWORK',
  'ERR_FR_TOO_MANY_REDIRECTS',
  'ERR_DEPRECATED',
  'ERR_BAD_RESPONSE',
  'ERR_BAD_REQUEST',
  'ERR_CANCELED',
  'ERR_NOT_SUPPORT',
  'ERR_INVALID_URL'
// eslint-disable-next-line func-names
].forEach(code => {
  descriptors[code] = {value: code};
});

Object.defineProperties(AxiosError, descriptors);
Object.defineProperty(prototype, 'isAxiosError', {value: true});

// eslint-disable-next-line func-names
AxiosError.from = (error, code, config, request, response, customProps) => {
  const axiosError = Object.create(prototype);

  _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].toFlatObject(error, axiosError, function filter(obj) {
    return obj !== Error.prototype;
  }, prop => {
    return prop !== 'isAxiosError';
  });

  AxiosError.call(axiosError, error.message, code, config, request, response);

  axiosError.cause = error;

  axiosError.name = error.name;

  customProps && Object.assign(axiosError, customProps);

  return axiosError;
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AxiosError);


/***/ }),

/***/ "./node_modules/axios/lib/core/AxiosHeaders.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/core/AxiosHeaders.js ***!
  \*****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _helpers_parseHeaders_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helpers/parseHeaders.js */ "./node_modules/axios/lib/helpers/parseHeaders.js");





const $internals = Symbol('internals');

function normalizeHeader(header) {
  return header && String(header).trim().toLowerCase();
}

function normalizeValue(value) {
  if (value === false || value == null) {
    return value;
  }

  return _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArray(value) ? value.map(normalizeValue) : String(value);
}

function parseTokens(str) {
  const tokens = Object.create(null);
  const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let match;

  while ((match = tokensRE.exec(str))) {
    tokens[match[1]] = match[2];
  }

  return tokens;
}

const isValidHeaderName = (str) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());

function matchHeaderValue(context, value, header, filter, isHeaderNameFilter) {
  if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isFunction(filter)) {
    return filter.call(this, value, header);
  }

  if (isHeaderNameFilter) {
    value = header;
  }

  if (!_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isString(value)) return;

  if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isString(filter)) {
    return value.indexOf(filter) !== -1;
  }

  if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isRegExp(filter)) {
    return filter.test(value);
  }
}

function formatHeader(header) {
  return header.trim()
    .toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str) => {
      return char.toUpperCase() + str;
    });
}

function buildAccessors(obj, header) {
  const accessorName = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].toCamelCase(' ' + header);

  ['get', 'set', 'has'].forEach(methodName => {
    Object.defineProperty(obj, methodName + accessorName, {
      value: function(arg1, arg2, arg3) {
        return this[methodName].call(this, header, arg1, arg2, arg3);
      },
      configurable: true
    });
  });
}

class AxiosHeaders {
  constructor(headers) {
    headers && this.set(headers);
  }

  set(header, valueOrRewrite, rewrite) {
    const self = this;

    function setHeader(_value, _header, _rewrite) {
      const lHeader = normalizeHeader(_header);

      if (!lHeader) {
        throw new Error('header name must be a non-empty string');
      }

      const key = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].findKey(self, lHeader);

      if(!key || self[key] === undefined || _rewrite === true || (_rewrite === undefined && self[key] !== false)) {
        self[key || _header] = normalizeValue(_value);
      }
    }

    const setHeaders = (headers, _rewrite) =>
      _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));

    if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isPlainObject(header) || header instanceof this.constructor) {
      setHeaders(header, valueOrRewrite)
    } else if(_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
      setHeaders((0,_helpers_parseHeaders_js__WEBPACK_IMPORTED_MODULE_1__["default"])(header), valueOrRewrite);
    } else if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isHeaders(header)) {
      for (const [key, value] of header.entries()) {
        setHeader(value, key, rewrite);
      }
    } else {
      header != null && setHeader(valueOrRewrite, header, rewrite);
    }

    return this;
  }

  get(header, parser) {
    header = normalizeHeader(header);

    if (header) {
      const key = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].findKey(this, header);

      if (key) {
        const value = this[key];

        if (!parser) {
          return value;
        }

        if (parser === true) {
          return parseTokens(value);
        }

        if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isFunction(parser)) {
          return parser.call(this, value, key);
        }

        if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isRegExp(parser)) {
          return parser.exec(value);
        }

        throw new TypeError('parser must be boolean|regexp|function');
      }
    }
  }

  has(header, matcher) {
    header = normalizeHeader(header);

    if (header) {
      const key = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].findKey(this, header);

      return !!(key && this[key] !== undefined && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
    }

    return false;
  }

  delete(header, matcher) {
    const self = this;
    let deleted = false;

    function deleteHeader(_header) {
      _header = normalizeHeader(_header);

      if (_header) {
        const key = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].findKey(self, _header);

        if (key && (!matcher || matchHeaderValue(self, self[key], key, matcher))) {
          delete self[key];

          deleted = true;
        }
      }
    }

    if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArray(header)) {
      header.forEach(deleteHeader);
    } else {
      deleteHeader(header);
    }

    return deleted;
  }

  clear(matcher) {
    const keys = Object.keys(this);
    let i = keys.length;
    let deleted = false;

    while (i--) {
      const key = keys[i];
      if(!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
        delete this[key];
        deleted = true;
      }
    }

    return deleted;
  }

  normalize(format) {
    const self = this;
    const headers = {};

    _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].forEach(this, (value, header) => {
      const key = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].findKey(headers, header);

      if (key) {
        self[key] = normalizeValue(value);
        delete self[header];
        return;
      }

      const normalized = format ? formatHeader(header) : String(header).trim();

      if (normalized !== header) {
        delete self[header];
      }

      self[normalized] = normalizeValue(value);

      headers[normalized] = true;
    });

    return this;
  }

  concat(...targets) {
    return this.constructor.concat(this, ...targets);
  }

  toJSON(asStrings) {
    const obj = Object.create(null);

    _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].forEach(this, (value, header) => {
      value != null && value !== false && (obj[header] = asStrings && _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArray(value) ? value.join(', ') : value);
    });

    return obj;
  }

  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]();
  }

  toString() {
    return Object.entries(this.toJSON()).map(([header, value]) => header + ': ' + value).join('\n');
  }

  get [Symbol.toStringTag]() {
    return 'AxiosHeaders';
  }

  static from(thing) {
    return thing instanceof this ? thing : new this(thing);
  }

  static concat(first, ...targets) {
    const computed = new this(first);

    targets.forEach((target) => computed.set(target));

    return computed;
  }

  static accessor(header) {
    const internals = this[$internals] = (this[$internals] = {
      accessors: {}
    });

    const accessors = internals.accessors;
    const prototype = this.prototype;

    function defineAccessor(_header) {
      const lHeader = normalizeHeader(_header);

      if (!accessors[lHeader]) {
        buildAccessors(prototype, _header);
        accessors[lHeader] = true;
      }
    }

    _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);

    return this;
  }
}

AxiosHeaders.accessor(['Content-Type', 'Content-Length', 'Accept', 'Accept-Encoding', 'User-Agent', 'Authorization']);

// reserved names hotfix
_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].reduceDescriptors(AxiosHeaders.prototype, ({value}, key) => {
  let mapped = key[0].toUpperCase() + key.slice(1); // map `set` => `Set`
  return {
    get: () => value,
    set(headerValue) {
      this[mapped] = headerValue;
    }
  }
});

_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].freezeMethods(AxiosHeaders);

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AxiosHeaders);


/***/ }),

/***/ "./node_modules/axios/lib/core/InterceptorManager.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/core/InterceptorManager.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../utils.js */ "./node_modules/axios/lib/utils.js");




class InterceptorManager {
  constructor() {
    this.handlers = [];
  }

  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */
  use(fulfilled, rejected, options) {
    this.handlers.push({
      fulfilled,
      rejected,
      synchronous: options ? options.synchronous : false,
      runWhen: options ? options.runWhen : null
    });
    return this.handlers.length - 1;
  }

  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   *
   * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
   */
  eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  }

  /**
   * Clear all interceptors from the stack
   *
   * @returns {void}
   */
  clear() {
    if (this.handlers) {
      this.handlers = [];
    }
  }

  /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   *
   * @returns {void}
   */
  forEach(fn) {
    _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].forEach(this.handlers, function forEachHandler(h) {
      if (h !== null) {
        fn(h);
      }
    });
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (InterceptorManager);


/***/ }),

/***/ "./node_modules/axios/lib/core/buildFullPath.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/buildFullPath.js ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ buildFullPath)
/* harmony export */ });
/* harmony import */ var _helpers_isAbsoluteURL_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers/isAbsoluteURL.js */ "./node_modules/axios/lib/helpers/isAbsoluteURL.js");
/* harmony import */ var _helpers_combineURLs_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helpers/combineURLs.js */ "./node_modules/axios/lib/helpers/combineURLs.js");





/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 *
 * @returns {string} The combined full path
 */
function buildFullPath(baseURL, requestedURL, allowAbsoluteUrls) {
  let isRelativeUrl = !(0,_helpers_isAbsoluteURL_js__WEBPACK_IMPORTED_MODULE_0__["default"])(requestedURL);
  if (baseURL && isRelativeUrl || allowAbsoluteUrls == false) {
    return (0,_helpers_combineURLs_js__WEBPACK_IMPORTED_MODULE_1__["default"])(baseURL, requestedURL);
  }
  return requestedURL;
}


/***/ }),

/***/ "./node_modules/axios/lib/core/dispatchRequest.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/core/dispatchRequest.js ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ dispatchRequest)
/* harmony export */ });
/* harmony import */ var _transformData_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./transformData.js */ "./node_modules/axios/lib/core/transformData.js");
/* harmony import */ var _cancel_isCancel_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../cancel/isCancel.js */ "./node_modules/axios/lib/cancel/isCancel.js");
/* harmony import */ var _defaults_index_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../defaults/index.js */ "./node_modules/axios/lib/defaults/index.js");
/* harmony import */ var _cancel_CanceledError_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../cancel/CanceledError.js */ "./node_modules/axios/lib/cancel/CanceledError.js");
/* harmony import */ var _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/AxiosHeaders.js */ "./node_modules/axios/lib/core/AxiosHeaders.js");
/* harmony import */ var _adapters_adapters_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../adapters/adapters.js */ "./node_modules/axios/lib/adapters/adapters.js");









/**
 * Throws a `CanceledError` if cancellation has been requested.
 *
 * @param {Object} config The config that is to be used for the request
 *
 * @returns {void}
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }

  if (config.signal && config.signal.aborted) {
    throw new _cancel_CanceledError_js__WEBPACK_IMPORTED_MODULE_0__["default"](null, config);
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 *
 * @returns {Promise} The Promise to be fulfilled
 */
function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  config.headers = _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__["default"].from(config.headers);

  // Transform request data
  config.data = _transformData_js__WEBPACK_IMPORTED_MODULE_2__["default"].call(
    config,
    config.transformRequest
  );

  if (['post', 'put', 'patch'].indexOf(config.method) !== -1) {
    config.headers.setContentType('application/x-www-form-urlencoded', false);
  }

  const adapter = _adapters_adapters_js__WEBPACK_IMPORTED_MODULE_3__["default"].getAdapter(config.adapter || _defaults_index_js__WEBPACK_IMPORTED_MODULE_4__["default"].adapter);

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = _transformData_js__WEBPACK_IMPORTED_MODULE_2__["default"].call(
      config,
      config.transformResponse,
      response
    );

    response.headers = _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__["default"].from(response.headers);

    return response;
  }, function onAdapterRejection(reason) {
    if (!(0,_cancel_isCancel_js__WEBPACK_IMPORTED_MODULE_5__["default"])(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = _transformData_js__WEBPACK_IMPORTED_MODULE_2__["default"].call(
          config,
          config.transformResponse,
          reason.response
        );
        reason.response.headers = _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__["default"].from(reason.response.headers);
      }
    }

    return Promise.reject(reason);
  });
}


/***/ }),

/***/ "./node_modules/axios/lib/core/mergeConfig.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/mergeConfig.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ mergeConfig)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AxiosHeaders.js */ "./node_modules/axios/lib/core/AxiosHeaders.js");





const headersToObject = (thing) => thing instanceof _AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_0__["default"] ? { ...thing } : thing;

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 *
 * @returns {Object} New object resulting from merging config2 to config1
 */
function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  const config = {};

  function getMergedValue(target, source, prop, caseless) {
    if (_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isPlainObject(target) && _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isPlainObject(source)) {
      return _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].merge.call({caseless}, target, source);
    } else if (_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isPlainObject(source)) {
      return _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].merge({}, source);
    } else if (_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isArray(source)) {
      return source.slice();
    }
    return source;
  }

  // eslint-disable-next-line consistent-return
  function mergeDeepProperties(a, b, prop , caseless) {
    if (!_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isUndefined(b)) {
      return getMergedValue(a, b, prop , caseless);
    } else if (!_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isUndefined(a)) {
      return getMergedValue(undefined, a, prop , caseless);
    }
  }

  // eslint-disable-next-line consistent-return
  function valueFromConfig2(a, b) {
    if (!_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isUndefined(b)) {
      return getMergedValue(undefined, b);
    }
  }

  // eslint-disable-next-line consistent-return
  function defaultToConfig2(a, b) {
    if (!_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isUndefined(b)) {
      return getMergedValue(undefined, b);
    } else if (!_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isUndefined(a)) {
      return getMergedValue(undefined, a);
    }
  }

  // eslint-disable-next-line consistent-return
  function mergeDirectKeys(a, b, prop) {
    if (prop in config2) {
      return getMergedValue(a, b);
    } else if (prop in config1) {
      return getMergedValue(undefined, a);
    }
  }

  const mergeMap = {
    url: valueFromConfig2,
    method: valueFromConfig2,
    data: valueFromConfig2,
    baseURL: defaultToConfig2,
    transformRequest: defaultToConfig2,
    transformResponse: defaultToConfig2,
    paramsSerializer: defaultToConfig2,
    timeout: defaultToConfig2,
    timeoutMessage: defaultToConfig2,
    withCredentials: defaultToConfig2,
    withXSRFToken: defaultToConfig2,
    adapter: defaultToConfig2,
    responseType: defaultToConfig2,
    xsrfCookieName: defaultToConfig2,
    xsrfHeaderName: defaultToConfig2,
    onUploadProgress: defaultToConfig2,
    onDownloadProgress: defaultToConfig2,
    decompress: defaultToConfig2,
    maxContentLength: defaultToConfig2,
    maxBodyLength: defaultToConfig2,
    beforeRedirect: defaultToConfig2,
    transport: defaultToConfig2,
    httpAgent: defaultToConfig2,
    httpsAgent: defaultToConfig2,
    cancelToken: defaultToConfig2,
    socketPath: defaultToConfig2,
    responseEncoding: defaultToConfig2,
    validateStatus: mergeDirectKeys,
    headers: (a, b , prop) => mergeDeepProperties(headersToObject(a), headersToObject(b),prop, true)
  };

  _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].forEach(Object.keys(Object.assign({}, config1, config2)), function computeConfigValue(prop) {
    const merge = mergeMap[prop] || mergeDeepProperties;
    const configValue = merge(config1[prop], config2[prop], prop);
    (_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isUndefined(configValue) && merge !== mergeDirectKeys) || (config[prop] = configValue);
  });

  return config;
}


/***/ }),

/***/ "./node_modules/axios/lib/core/settle.js":
/*!***********************************************!*\
  !*** ./node_modules/axios/lib/core/settle.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ settle)
/* harmony export */ });
/* harmony import */ var _AxiosError_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AxiosError.js */ "./node_modules/axios/lib/core/AxiosError.js");




/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 *
 * @returns {object} The response.
 */
function settle(resolve, reject, response) {
  const validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(new _AxiosError_js__WEBPACK_IMPORTED_MODULE_0__["default"](
      'Request failed with status code ' + response.status,
      [_AxiosError_js__WEBPACK_IMPORTED_MODULE_0__["default"].ERR_BAD_REQUEST, _AxiosError_js__WEBPACK_IMPORTED_MODULE_0__["default"].ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
      response.config,
      response.request,
      response
    ));
  }
}


/***/ }),

/***/ "./node_modules/axios/lib/core/transformData.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/transformData.js ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ transformData)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./../utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _defaults_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../defaults/index.js */ "./node_modules/axios/lib/defaults/index.js");
/* harmony import */ var _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/AxiosHeaders.js */ "./node_modules/axios/lib/core/AxiosHeaders.js");






/**
 * Transform the data for a request or a response
 *
 * @param {Array|Function} fns A single function or Array of functions
 * @param {?Object} response The response object
 *
 * @returns {*} The resulting transformed data
 */
function transformData(fns, response) {
  const config = this || _defaults_index_js__WEBPACK_IMPORTED_MODULE_0__["default"];
  const context = response || config;
  const headers = _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__["default"].from(context.headers);
  let data = context.data;

  _utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].forEach(fns, function transform(fn) {
    data = fn.call(config, data, headers.normalize(), response ? response.status : undefined);
  });

  headers.normalize();

  return data;
}


/***/ }),

/***/ "./node_modules/axios/lib/defaults/index.js":
/*!**************************************************!*\
  !*** ./node_modules/axios/lib/defaults/index.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../core/AxiosError.js */ "./node_modules/axios/lib/core/AxiosError.js");
/* harmony import */ var _transitional_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./transitional.js */ "./node_modules/axios/lib/defaults/transitional.js");
/* harmony import */ var _helpers_toFormData_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../helpers/toFormData.js */ "./node_modules/axios/lib/helpers/toFormData.js");
/* harmony import */ var _helpers_toURLEncodedForm_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../helpers/toURLEncodedForm.js */ "./node_modules/axios/lib/helpers/toURLEncodedForm.js");
/* harmony import */ var _platform_index_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../platform/index.js */ "./node_modules/axios/lib/platform/index.js");
/* harmony import */ var _helpers_formDataToJSON_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../helpers/formDataToJSON.js */ "./node_modules/axios/lib/helpers/formDataToJSON.js");










/**
 * It takes a string, tries to parse it, and if it fails, it returns the stringified version
 * of the input
 *
 * @param {any} rawValue - The value to be stringified.
 * @param {Function} parser - A function that parses a string into a JavaScript object.
 * @param {Function} encoder - A function that takes a value and returns a string.
 *
 * @returns {string} A stringified version of the rawValue.
 */
function stringifySafely(rawValue, parser, encoder) {
  if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].trim(rawValue);
    } catch (e) {
      if (e.name !== 'SyntaxError') {
        throw e;
      }
    }
  }

  return (encoder || JSON.stringify)(rawValue);
}

const defaults = {

  transitional: _transitional_js__WEBPACK_IMPORTED_MODULE_1__["default"],

  adapter: ['xhr', 'http', 'fetch'],

  transformRequest: [function transformRequest(data, headers) {
    const contentType = headers.getContentType() || '';
    const hasJSONContentType = contentType.indexOf('application/json') > -1;
    const isObjectPayload = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isObject(data);

    if (isObjectPayload && _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isHTMLForm(data)) {
      data = new FormData(data);
    }

    const isFormData = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isFormData(data);

    if (isFormData) {
      return hasJSONContentType ? JSON.stringify((0,_helpers_formDataToJSON_js__WEBPACK_IMPORTED_MODULE_2__["default"])(data)) : data;
    }

    if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArrayBuffer(data) ||
      _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isBuffer(data) ||
      _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isStream(data) ||
      _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isFile(data) ||
      _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isBlob(data) ||
      _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isReadableStream(data)
    ) {
      return data;
    }
    if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArrayBufferView(data)) {
      return data.buffer;
    }
    if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isURLSearchParams(data)) {
      headers.setContentType('application/x-www-form-urlencoded;charset=utf-8', false);
      return data.toString();
    }

    let isFileList;

    if (isObjectPayload) {
      if (contentType.indexOf('application/x-www-form-urlencoded') > -1) {
        return (0,_helpers_toURLEncodedForm_js__WEBPACK_IMPORTED_MODULE_3__["default"])(data, this.formSerializer).toString();
      }

      if ((isFileList = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isFileList(data)) || contentType.indexOf('multipart/form-data') > -1) {
        const _FormData = this.env && this.env.FormData;

        return (0,_helpers_toFormData_js__WEBPACK_IMPORTED_MODULE_4__["default"])(
          isFileList ? {'files[]': data} : data,
          _FormData && new _FormData(),
          this.formSerializer
        );
      }
    }

    if (isObjectPayload || hasJSONContentType ) {
      headers.setContentType('application/json', false);
      return stringifySafely(data);
    }

    return data;
  }],

  transformResponse: [function transformResponse(data) {
    const transitional = this.transitional || defaults.transitional;
    const forcedJSONParsing = transitional && transitional.forcedJSONParsing;
    const JSONRequested = this.responseType === 'json';

    if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isResponse(data) || _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isReadableStream(data)) {
      return data;
    }

    if (data && _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isString(data) && ((forcedJSONParsing && !this.responseType) || JSONRequested)) {
      const silentJSONParsing = transitional && transitional.silentJSONParsing;
      const strictJSONParsing = !silentJSONParsing && JSONRequested;

      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === 'SyntaxError') {
            throw _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_5__["default"].from(e, _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_5__["default"].ERR_BAD_RESPONSE, this, null, this.response);
          }
          throw e;
        }
      }
    }

    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  env: {
    FormData: _platform_index_js__WEBPACK_IMPORTED_MODULE_6__["default"].classes.FormData,
    Blob: _platform_index_js__WEBPACK_IMPORTED_MODULE_6__["default"].classes.Blob
  },

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  },

  headers: {
    common: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': undefined
    }
  }
};

_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].forEach(['delete', 'get', 'head', 'post', 'put', 'patch'], (method) => {
  defaults.headers[method] = {};
});

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (defaults);


/***/ }),

/***/ "./node_modules/axios/lib/defaults/transitional.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/defaults/transitional.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  silentJSONParsing: true,
  forcedJSONParsing: true,
  clarifyTimeoutError: false
});


/***/ }),

/***/ "./node_modules/axios/lib/env/data.js":
/*!********************************************!*\
  !*** ./node_modules/axios/lib/env/data.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   VERSION: () => (/* binding */ VERSION)
/* harmony export */ });
const VERSION = "1.8.3";

/***/ }),

/***/ "./node_modules/axios/lib/helpers/AxiosURLSearchParams.js":
/*!****************************************************************!*\
  !*** ./node_modules/axios/lib/helpers/AxiosURLSearchParams.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _toFormData_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toFormData.js */ "./node_modules/axios/lib/helpers/toFormData.js");




/**
 * It encodes a string by replacing all characters that are not in the unreserved set with
 * their percent-encoded equivalents
 *
 * @param {string} str - The string to encode.
 *
 * @returns {string} The encoded string.
 */
function encode(str) {
  const charMap = {
    '!': '%21',
    "'": '%27',
    '(': '%28',
    ')': '%29',
    '~': '%7E',
    '%20': '+',
    '%00': '\x00'
  };
  return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match) {
    return charMap[match];
  });
}

/**
 * It takes a params object and converts it to a FormData object
 *
 * @param {Object<string, any>} params - The parameters to be converted to a FormData object.
 * @param {Object<string, any>} options - The options object passed to the Axios constructor.
 *
 * @returns {void}
 */
function AxiosURLSearchParams(params, options) {
  this._pairs = [];

  params && (0,_toFormData_js__WEBPACK_IMPORTED_MODULE_0__["default"])(params, this, options);
}

const prototype = AxiosURLSearchParams.prototype;

prototype.append = function append(name, value) {
  this._pairs.push([name, value]);
};

prototype.toString = function toString(encoder) {
  const _encode = encoder ? function(value) {
    return encoder.call(this, value, encode);
  } : encode;

  return this._pairs.map(function each(pair) {
    return _encode(pair[0]) + '=' + _encode(pair[1]);
  }, '').join('&');
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AxiosURLSearchParams);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/HttpStatusCode.js":
/*!**********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/HttpStatusCode.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const HttpStatusCode = {
  Continue: 100,
  SwitchingProtocols: 101,
  Processing: 102,
  EarlyHints: 103,
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NonAuthoritativeInformation: 203,
  NoContent: 204,
  ResetContent: 205,
  PartialContent: 206,
  MultiStatus: 207,
  AlreadyReported: 208,
  ImUsed: 226,
  MultipleChoices: 300,
  MovedPermanently: 301,
  Found: 302,
  SeeOther: 303,
  NotModified: 304,
  UseProxy: 305,
  Unused: 306,
  TemporaryRedirect: 307,
  PermanentRedirect: 308,
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  UriTooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  ImATeapot: 418,
  MisdirectedRequest: 421,
  UnprocessableEntity: 422,
  Locked: 423,
  FailedDependency: 424,
  TooEarly: 425,
  UpgradeRequired: 426,
  PreconditionRequired: 428,
  TooManyRequests: 429,
  RequestHeaderFieldsTooLarge: 431,
  UnavailableForLegalReasons: 451,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HttpVersionNotSupported: 505,
  VariantAlsoNegotiates: 506,
  InsufficientStorage: 507,
  LoopDetected: 508,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511,
};

Object.entries(HttpStatusCode).forEach(([key, value]) => {
  HttpStatusCode[value] = key;
});

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (HttpStatusCode);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/bind.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/helpers/bind.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ bind)
/* harmony export */ });


function bind(fn, thisArg) {
  return function wrap() {
    return fn.apply(thisArg, arguments);
  };
}


/***/ }),

/***/ "./node_modules/axios/lib/helpers/buildURL.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/buildURL.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ buildURL)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _helpers_AxiosURLSearchParams_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helpers/AxiosURLSearchParams.js */ "./node_modules/axios/lib/helpers/AxiosURLSearchParams.js");





/**
 * It replaces all instances of the characters `:`, `$`, `,`, `+`, `[`, and `]` with their
 * URI encoded counterparts
 *
 * @param {string} val The value to be encoded.
 *
 * @returns {string} The encoded value.
 */
function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @param {?(object|Function)} options
 *
 * @returns {string} The formatted url
 */
function buildURL(url, params, options) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }
  
  const _encode = options && options.encode || encode;

  if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isFunction(options)) {
    options = {
      serialize: options
    };
  } 

  const serializeFn = options && options.serialize;

  let serializedParams;

  if (serializeFn) {
    serializedParams = serializeFn(params, options);
  } else {
    serializedParams = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isURLSearchParams(params) ?
      params.toString() :
      new _helpers_AxiosURLSearchParams_js__WEBPACK_IMPORTED_MODULE_1__["default"](params, options).toString(_encode);
  }

  if (serializedParams) {
    const hashmarkIndex = url.indexOf("#");

    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
}


/***/ }),

/***/ "./node_modules/axios/lib/helpers/combineURLs.js":
/*!*******************************************************!*\
  !*** ./node_modules/axios/lib/helpers/combineURLs.js ***!
  \*******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ combineURLs)
/* harmony export */ });


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 *
 * @returns {string} The combined URL
 */
function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/?\/$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
}


/***/ }),

/***/ "./node_modules/axios/lib/helpers/composeSignals.js":
/*!**********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/composeSignals.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _cancel_CanceledError_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../cancel/CanceledError.js */ "./node_modules/axios/lib/cancel/CanceledError.js");
/* harmony import */ var _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/AxiosError.js */ "./node_modules/axios/lib/core/AxiosError.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils.js */ "./node_modules/axios/lib/utils.js");




const composeSignals = (signals, timeout) => {
  const {length} = (signals = signals ? signals.filter(Boolean) : []);

  if (timeout || length) {
    let controller = new AbortController();

    let aborted;

    const onabort = function (reason) {
      if (!aborted) {
        aborted = true;
        unsubscribe();
        const err = reason instanceof Error ? reason : this.reason;
        controller.abort(err instanceof _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_0__["default"] ? err : new _cancel_CanceledError_js__WEBPACK_IMPORTED_MODULE_1__["default"](err instanceof Error ? err.message : err));
      }
    }

    let timer = timeout && setTimeout(() => {
      timer = null;
      onabort(new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_0__["default"](`timeout ${timeout} of ms exceeded`, _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_0__["default"].ETIMEDOUT))
    }, timeout)

    const unsubscribe = () => {
      if (signals) {
        timer && clearTimeout(timer);
        timer = null;
        signals.forEach(signal => {
          signal.unsubscribe ? signal.unsubscribe(onabort) : signal.removeEventListener('abort', onabort);
        });
        signals = null;
      }
    }

    signals.forEach((signal) => signal.addEventListener('abort', onabort));

    const {signal} = controller;

    signal.unsubscribe = () => _utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].asap(unsubscribe);

    return signal;
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (composeSignals);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/cookies.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/helpers/cookies.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./../utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _platform_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../platform/index.js */ "./node_modules/axios/lib/platform/index.js");



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_platform_index_js__WEBPACK_IMPORTED_MODULE_0__["default"].hasStandardBrowserEnv ?

  // Standard browser envs support document.cookie
  {
    write(name, value, expires, path, domain, secure) {
      const cookie = [name + '=' + encodeURIComponent(value)];

      _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isNumber(expires) && cookie.push('expires=' + new Date(expires).toGMTString());

      _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isString(path) && cookie.push('path=' + path);

      _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isString(domain) && cookie.push('domain=' + domain);

      secure === true && cookie.push('secure');

      document.cookie = cookie.join('; ');
    },

    read(name) {
      const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
      return (match ? decodeURIComponent(match[3]) : null);
    },

    remove(name) {
      this.write(name, '', Date.now() - 86400000);
    }
  }

  :

  // Non-standard browser env (web workers, react-native) lack needed support.
  {
    write() {},
    read() {
      return null;
    },
    remove() {}
  });



/***/ }),

/***/ "./node_modules/axios/lib/helpers/formDataToJSON.js":
/*!**********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/formDataToJSON.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils.js */ "./node_modules/axios/lib/utils.js");




/**
 * It takes a string like `foo[x][y][z]` and returns an array like `['foo', 'x', 'y', 'z']
 *
 * @param {string} name - The name of the property to get.
 *
 * @returns An array of strings.
 */
function parsePropPath(name) {
  // foo[x][y][z]
  // foo.x.y.z
  // foo-x-y-z
  // foo x y z
  return _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].matchAll(/\w+|\[(\w*)]/g, name).map(match => {
    return match[0] === '[]' ? '' : match[1] || match[0];
  });
}

/**
 * Convert an array to an object.
 *
 * @param {Array<any>} arr - The array to convert to an object.
 *
 * @returns An object with the same keys and values as the array.
 */
function arrayToObject(arr) {
  const obj = {};
  const keys = Object.keys(arr);
  let i;
  const len = keys.length;
  let key;
  for (i = 0; i < len; i++) {
    key = keys[i];
    obj[key] = arr[key];
  }
  return obj;
}

/**
 * It takes a FormData object and returns a JavaScript object
 *
 * @param {string} formData The FormData object to convert to JSON.
 *
 * @returns {Object<string, any> | null} The converted object.
 */
function formDataToJSON(formData) {
  function buildPath(path, value, target, index) {
    let name = path[index++];

    if (name === '__proto__') return true;

    const isNumericKey = Number.isFinite(+name);
    const isLast = index >= path.length;
    name = !name && _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArray(target) ? target.length : name;

    if (isLast) {
      if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].hasOwnProp(target, name)) {
        target[name] = [target[name], value];
      } else {
        target[name] = value;
      }

      return !isNumericKey;
    }

    if (!target[name] || !_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isObject(target[name])) {
      target[name] = [];
    }

    const result = buildPath(path, value, target[name], index);

    if (result && _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArray(target[name])) {
      target[name] = arrayToObject(target[name]);
    }

    return !isNumericKey;
  }

  if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isFormData(formData) && _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isFunction(formData.entries)) {
    const obj = {};

    _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].forEachEntry(formData, (name, value) => {
      buildPath(parsePropPath(name), value, obj, 0);
    });

    return obj;
  }

  return null;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (formDataToJSON);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAbsoluteURL.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAbsoluteURL.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isAbsoluteURL)
/* harmony export */ });


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 *
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
}


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAxiosError.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAxiosError.js ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isAxiosError)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../utils.js */ "./node_modules/axios/lib/utils.js");




/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 *
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
function isAxiosError(payload) {
  return _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isObject(payload) && (payload.isAxiosError === true);
}


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isURLSameOrigin.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isURLSameOrigin.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _platform_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../platform/index.js */ "./node_modules/axios/lib/platform/index.js");


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_platform_index_js__WEBPACK_IMPORTED_MODULE_0__["default"].hasStandardBrowserEnv ? ((origin, isMSIE) => (url) => {
  url = new URL(url, _platform_index_js__WEBPACK_IMPORTED_MODULE_0__["default"].origin);

  return (
    origin.protocol === url.protocol &&
    origin.host === url.host &&
    (isMSIE || origin.port === url.port)
  );
})(
  new URL(_platform_index_js__WEBPACK_IMPORTED_MODULE_0__["default"].origin),
  _platform_index_js__WEBPACK_IMPORTED_MODULE_0__["default"].navigator && /(msie|trident)/i.test(_platform_index_js__WEBPACK_IMPORTED_MODULE_0__["default"].navigator.userAgent)
) : () => true);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/null.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/helpers/null.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// eslint-disable-next-line strict
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (null);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/parseHeaders.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/parseHeaders.js ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../utils.js */ "./node_modules/axios/lib/utils.js");




// RawAxiosHeaders whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
const ignoreDuplicateOf = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].toObjectSet([
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
]);

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} rawHeaders Headers needing to be parsed
 *
 * @returns {Object} Headers parsed into an object
 */
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (rawHeaders => {
  const parsed = {};
  let key;
  let val;
  let i;

  rawHeaders && rawHeaders.split('\n').forEach(function parser(line) {
    i = line.indexOf(':');
    key = line.substring(0, i).trim().toLowerCase();
    val = line.substring(i + 1).trim();

    if (!key || (parsed[key] && ignoreDuplicateOf[key])) {
      return;
    }

    if (key === 'set-cookie') {
      if (parsed[key]) {
        parsed[key].push(val);
      } else {
        parsed[key] = [val];
      }
    } else {
      parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
    }
  });

  return parsed;
});


/***/ }),

/***/ "./node_modules/axios/lib/helpers/parseProtocol.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/parseProtocol.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ parseProtocol)
/* harmony export */ });


function parseProtocol(url) {
  const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
  return match && match[1] || '';
}


/***/ }),

/***/ "./node_modules/axios/lib/helpers/progressEventReducer.js":
/*!****************************************************************!*\
  !*** ./node_modules/axios/lib/helpers/progressEventReducer.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   asyncDecorator: () => (/* binding */ asyncDecorator),
/* harmony export */   progressEventDecorator: () => (/* binding */ progressEventDecorator),
/* harmony export */   progressEventReducer: () => (/* binding */ progressEventReducer)
/* harmony export */ });
/* harmony import */ var _speedometer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./speedometer.js */ "./node_modules/axios/lib/helpers/speedometer.js");
/* harmony import */ var _throttle_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./throttle.js */ "./node_modules/axios/lib/helpers/throttle.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils.js */ "./node_modules/axios/lib/utils.js");




const progressEventReducer = (listener, isDownloadStream, freq = 3) => {
  let bytesNotified = 0;
  const _speedometer = (0,_speedometer_js__WEBPACK_IMPORTED_MODULE_0__["default"])(50, 250);

  return (0,_throttle_js__WEBPACK_IMPORTED_MODULE_1__["default"])(e => {
    const loaded = e.loaded;
    const total = e.lengthComputable ? e.total : undefined;
    const progressBytes = loaded - bytesNotified;
    const rate = _speedometer(progressBytes);
    const inRange = loaded <= total;

    bytesNotified = loaded;

    const data = {
      loaded,
      total,
      progress: total ? (loaded / total) : undefined,
      bytes: progressBytes,
      rate: rate ? rate : undefined,
      estimated: rate && total && inRange ? (total - loaded) / rate : undefined,
      event: e,
      lengthComputable: total != null,
      [isDownloadStream ? 'download' : 'upload']: true
    };

    listener(data);
  }, freq);
}

const progressEventDecorator = (total, throttled) => {
  const lengthComputable = total != null;

  return [(loaded) => throttled[0]({
    lengthComputable,
    total,
    loaded
  }), throttled[1]];
}

const asyncDecorator = (fn) => (...args) => _utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].asap(() => fn(...args));


/***/ }),

/***/ "./node_modules/axios/lib/helpers/resolveConfig.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/resolveConfig.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _platform_index_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../platform/index.js */ "./node_modules/axios/lib/platform/index.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _isURLSameOrigin_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./isURLSameOrigin.js */ "./node_modules/axios/lib/helpers/isURLSameOrigin.js");
/* harmony import */ var _cookies_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./cookies.js */ "./node_modules/axios/lib/helpers/cookies.js");
/* harmony import */ var _core_buildFullPath_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../core/buildFullPath.js */ "./node_modules/axios/lib/core/buildFullPath.js");
/* harmony import */ var _core_mergeConfig_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/mergeConfig.js */ "./node_modules/axios/lib/core/mergeConfig.js");
/* harmony import */ var _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/AxiosHeaders.js */ "./node_modules/axios/lib/core/AxiosHeaders.js");
/* harmony import */ var _buildURL_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./buildURL.js */ "./node_modules/axios/lib/helpers/buildURL.js");









/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((config) => {
  const newConfig = (0,_core_mergeConfig_js__WEBPACK_IMPORTED_MODULE_0__["default"])({}, config);

  let {data, withXSRFToken, xsrfHeaderName, xsrfCookieName, headers, auth} = newConfig;

  newConfig.headers = headers = _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__["default"].from(headers);

  newConfig.url = (0,_buildURL_js__WEBPACK_IMPORTED_MODULE_2__["default"])((0,_core_buildFullPath_js__WEBPACK_IMPORTED_MODULE_3__["default"])(newConfig.baseURL, newConfig.url, newConfig.allowAbsoluteUrls), config.params, config.paramsSerializer);

  // HTTP basic authentication
  if (auth) {
    headers.set('Authorization', 'Basic ' +
      btoa((auth.username || '') + ':' + (auth.password ? unescape(encodeURIComponent(auth.password)) : ''))
    );
  }

  let contentType;

  if (_utils_js__WEBPACK_IMPORTED_MODULE_4__["default"].isFormData(data)) {
    if (_platform_index_js__WEBPACK_IMPORTED_MODULE_5__["default"].hasStandardBrowserEnv || _platform_index_js__WEBPACK_IMPORTED_MODULE_5__["default"].hasStandardBrowserWebWorkerEnv) {
      headers.setContentType(undefined); // Let the browser set it
    } else if ((contentType = headers.getContentType()) !== false) {
      // fix semicolon duplication issue for ReactNative FormData implementation
      const [type, ...tokens] = contentType ? contentType.split(';').map(token => token.trim()).filter(Boolean) : [];
      headers.setContentType([type || 'multipart/form-data', ...tokens].join('; '));
    }
  }

  // Add xsrf header
  // This is only done if running in a standard browser environment.
  // Specifically not if we're in a web worker, or react-native.

  if (_platform_index_js__WEBPACK_IMPORTED_MODULE_5__["default"].hasStandardBrowserEnv) {
    withXSRFToken && _utils_js__WEBPACK_IMPORTED_MODULE_4__["default"].isFunction(withXSRFToken) && (withXSRFToken = withXSRFToken(newConfig));

    if (withXSRFToken || (withXSRFToken !== false && (0,_isURLSameOrigin_js__WEBPACK_IMPORTED_MODULE_6__["default"])(newConfig.url))) {
      // Add xsrf header
      const xsrfValue = xsrfHeaderName && xsrfCookieName && _cookies_js__WEBPACK_IMPORTED_MODULE_7__["default"].read(xsrfCookieName);

      if (xsrfValue) {
        headers.set(xsrfHeaderName, xsrfValue);
      }
    }
  }

  return newConfig;
});



/***/ }),

/***/ "./node_modules/axios/lib/helpers/speedometer.js":
/*!*******************************************************!*\
  !*** ./node_modules/axios/lib/helpers/speedometer.js ***!
  \*******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });


/**
 * Calculate data maxRate
 * @param {Number} [samplesCount= 10]
 * @param {Number} [min= 1000]
 * @returns {Function}
 */
function speedometer(samplesCount, min) {
  samplesCount = samplesCount || 10;
  const bytes = new Array(samplesCount);
  const timestamps = new Array(samplesCount);
  let head = 0;
  let tail = 0;
  let firstSampleTS;

  min = min !== undefined ? min : 1000;

  return function push(chunkLength) {
    const now = Date.now();

    const startedAt = timestamps[tail];

    if (!firstSampleTS) {
      firstSampleTS = now;
    }

    bytes[head] = chunkLength;
    timestamps[head] = now;

    let i = tail;
    let bytesCount = 0;

    while (i !== head) {
      bytesCount += bytes[i++];
      i = i % samplesCount;
    }

    head = (head + 1) % samplesCount;

    if (head === tail) {
      tail = (tail + 1) % samplesCount;
    }

    if (now - firstSampleTS < min) {
      return;
    }

    const passed = startedAt && now - startedAt;

    return passed ? Math.round(bytesCount * 1000 / passed) : undefined;
  };
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (speedometer);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/spread.js":
/*!**************************************************!*\
  !*** ./node_modules/axios/lib/helpers/spread.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ spread)
/* harmony export */ });


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 *
 * @returns {Function}
 */
function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
}


/***/ }),

/***/ "./node_modules/axios/lib/helpers/throttle.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/throttle.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Throttle decorator
 * @param {Function} fn
 * @param {Number} freq
 * @return {Function}
 */
function throttle(fn, freq) {
  let timestamp = 0;
  let threshold = 1000 / freq;
  let lastArgs;
  let timer;

  const invoke = (args, now = Date.now()) => {
    timestamp = now;
    lastArgs = null;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    fn.apply(null, args);
  }

  const throttled = (...args) => {
    const now = Date.now();
    const passed = now - timestamp;
    if ( passed >= threshold) {
      invoke(args, now);
    } else {
      lastArgs = args;
      if (!timer) {
        timer = setTimeout(() => {
          timer = null;
          invoke(lastArgs)
        }, threshold - passed);
      }
    }
  }

  const flush = () => lastArgs && invoke(lastArgs);

  return [throttled, flush];
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (throttle);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/toFormData.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/helpers/toFormData.js ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../core/AxiosError.js */ "./node_modules/axios/lib/core/AxiosError.js");
/* harmony import */ var _platform_node_classes_FormData_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../platform/node/classes/FormData.js */ "./node_modules/axios/lib/helpers/null.js");




// temporary hotfix to avoid circular references until AxiosURLSearchParams is refactored


/**
 * Determines if the given thing is a array or js object.
 *
 * @param {string} thing - The object or array to be visited.
 *
 * @returns {boolean}
 */
function isVisitable(thing) {
  return _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isPlainObject(thing) || _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArray(thing);
}

/**
 * It removes the brackets from the end of a string
 *
 * @param {string} key - The key of the parameter.
 *
 * @returns {string} the key without the brackets.
 */
function removeBrackets(key) {
  return _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].endsWith(key, '[]') ? key.slice(0, -2) : key;
}

/**
 * It takes a path, a key, and a boolean, and returns a string
 *
 * @param {string} path - The path to the current key.
 * @param {string} key - The key of the current object being iterated over.
 * @param {string} dots - If true, the key will be rendered with dots instead of brackets.
 *
 * @returns {string} The path to the current key.
 */
function renderKey(path, key, dots) {
  if (!path) return key;
  return path.concat(key).map(function each(token, i) {
    // eslint-disable-next-line no-param-reassign
    token = removeBrackets(token);
    return !dots && i ? '[' + token + ']' : token;
  }).join(dots ? '.' : '');
}

/**
 * If the array is an array and none of its elements are visitable, then it's a flat array.
 *
 * @param {Array<any>} arr - The array to check
 *
 * @returns {boolean}
 */
function isFlatArray(arr) {
  return _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArray(arr) && !arr.some(isVisitable);
}

const predicates = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].toFlatObject(_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"], {}, null, function filter(prop) {
  return /^is[A-Z]/.test(prop);
});

/**
 * Convert a data object to FormData
 *
 * @param {Object} obj
 * @param {?Object} [formData]
 * @param {?Object} [options]
 * @param {Function} [options.visitor]
 * @param {Boolean} [options.metaTokens = true]
 * @param {Boolean} [options.dots = false]
 * @param {?Boolean} [options.indexes = false]
 *
 * @returns {Object}
 **/

/**
 * It converts an object into a FormData object
 *
 * @param {Object<any, any>} obj - The object to convert to form data.
 * @param {string} formData - The FormData object to append to.
 * @param {Object<string, any>} options
 *
 * @returns
 */
function toFormData(obj, formData, options) {
  if (!_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isObject(obj)) {
    throw new TypeError('target must be an object');
  }

  // eslint-disable-next-line no-param-reassign
  formData = formData || new (_platform_node_classes_FormData_js__WEBPACK_IMPORTED_MODULE_1__["default"] || FormData)();

  // eslint-disable-next-line no-param-reassign
  options = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].toFlatObject(options, {
    metaTokens: true,
    dots: false,
    indexes: false
  }, false, function defined(option, source) {
    // eslint-disable-next-line no-eq-null,eqeqeq
    return !_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isUndefined(source[option]);
  });

  const metaTokens = options.metaTokens;
  // eslint-disable-next-line no-use-before-define
  const visitor = options.visitor || defaultVisitor;
  const dots = options.dots;
  const indexes = options.indexes;
  const _Blob = options.Blob || typeof Blob !== 'undefined' && Blob;
  const useBlob = _Blob && _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isSpecCompliantForm(formData);

  if (!_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isFunction(visitor)) {
    throw new TypeError('visitor must be a function');
  }

  function convertValue(value) {
    if (value === null) return '';

    if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isDate(value)) {
      return value.toISOString();
    }

    if (!useBlob && _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isBlob(value)) {
      throw new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_2__["default"]('Blob is not supported. Use a Buffer instead.');
    }

    if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArrayBuffer(value) || _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isTypedArray(value)) {
      return useBlob && typeof Blob === 'function' ? new Blob([value]) : Buffer.from(value);
    }

    return value;
  }

  /**
   * Default visitor.
   *
   * @param {*} value
   * @param {String|Number} key
   * @param {Array<String|Number>} path
   * @this {FormData}
   *
   * @returns {boolean} return true to visit the each prop of the value recursively
   */
  function defaultVisitor(value, key, path) {
    let arr = value;

    if (value && !path && typeof value === 'object') {
      if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].endsWith(key, '{}')) {
        // eslint-disable-next-line no-param-reassign
        key = metaTokens ? key : key.slice(0, -2);
        // eslint-disable-next-line no-param-reassign
        value = JSON.stringify(value);
      } else if (
        (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArray(value) && isFlatArray(value)) ||
        ((_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isFileList(value) || _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].endsWith(key, '[]')) && (arr = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].toArray(value))
        )) {
        // eslint-disable-next-line no-param-reassign
        key = removeBrackets(key);

        arr.forEach(function each(el, index) {
          !(_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isUndefined(el) || el === null) && formData.append(
            // eslint-disable-next-line no-nested-ternary
            indexes === true ? renderKey([key], index, dots) : (indexes === null ? key : key + '[]'),
            convertValue(el)
          );
        });
        return false;
      }
    }

    if (isVisitable(value)) {
      return true;
    }

    formData.append(renderKey(path, key, dots), convertValue(value));

    return false;
  }

  const stack = [];

  const exposedHelpers = Object.assign(predicates, {
    defaultVisitor,
    convertValue,
    isVisitable
  });

  function build(value, path) {
    if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isUndefined(value)) return;

    if (stack.indexOf(value) !== -1) {
      throw Error('Circular reference detected in ' + path.join('.'));
    }

    stack.push(value);

    _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].forEach(value, function each(el, key) {
      const result = !(_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isUndefined(el) || el === null) && visitor.call(
        formData, el, _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isString(key) ? key.trim() : key, path, exposedHelpers
      );

      if (result === true) {
        build(el, path ? path.concat(key) : [key]);
      }
    });

    stack.pop();
  }

  if (!_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isObject(obj)) {
    throw new TypeError('data must be an object');
  }

  build(obj);

  return formData;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (toFormData);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/toURLEncodedForm.js":
/*!************************************************************!*\
  !*** ./node_modules/axios/lib/helpers/toURLEncodedForm.js ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ toURLEncodedForm)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _toFormData_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toFormData.js */ "./node_modules/axios/lib/helpers/toFormData.js");
/* harmony import */ var _platform_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../platform/index.js */ "./node_modules/axios/lib/platform/index.js");






function toURLEncodedForm(data, options) {
  return (0,_toFormData_js__WEBPACK_IMPORTED_MODULE_0__["default"])(data, new _platform_index_js__WEBPACK_IMPORTED_MODULE_1__["default"].classes.URLSearchParams(), Object.assign({
    visitor: function(value, key, path, helpers) {
      if (_platform_index_js__WEBPACK_IMPORTED_MODULE_1__["default"].isNode && _utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].isBuffer(value)) {
        this.append(key, value.toString('base64'));
        return false;
      }

      return helpers.defaultVisitor.apply(this, arguments);
    }
  }, options));
}


/***/ }),

/***/ "./node_modules/axios/lib/helpers/trackStream.js":
/*!*******************************************************!*\
  !*** ./node_modules/axios/lib/helpers/trackStream.js ***!
  \*******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   readBytes: () => (/* binding */ readBytes),
/* harmony export */   streamChunk: () => (/* binding */ streamChunk),
/* harmony export */   trackStream: () => (/* binding */ trackStream)
/* harmony export */ });

const streamChunk = function* (chunk, chunkSize) {
  let len = chunk.byteLength;

  if (!chunkSize || len < chunkSize) {
    yield chunk;
    return;
  }

  let pos = 0;
  let end;

  while (pos < len) {
    end = pos + chunkSize;
    yield chunk.slice(pos, end);
    pos = end;
  }
}

const readBytes = async function* (iterable, chunkSize) {
  for await (const chunk of readStream(iterable)) {
    yield* streamChunk(chunk, chunkSize);
  }
}

const readStream = async function* (stream) {
  if (stream[Symbol.asyncIterator]) {
    yield* stream;
    return;
  }

  const reader = stream.getReader();
  try {
    for (;;) {
      const {done, value} = await reader.read();
      if (done) {
        break;
      }
      yield value;
    }
  } finally {
    await reader.cancel();
  }
}

const trackStream = (stream, chunkSize, onProgress, onFinish) => {
  const iterator = readBytes(stream, chunkSize);

  let bytes = 0;
  let done;
  let _onFinish = (e) => {
    if (!done) {
      done = true;
      onFinish && onFinish(e);
    }
  }

  return new ReadableStream({
    async pull(controller) {
      try {
        const {done, value} = await iterator.next();

        if (done) {
         _onFinish();
          controller.close();
          return;
        }

        let len = value.byteLength;
        if (onProgress) {
          let loadedBytes = bytes += len;
          onProgress(loadedBytes);
        }
        controller.enqueue(new Uint8Array(value));
      } catch (err) {
        _onFinish(err);
        throw err;
      }
    },
    cancel(reason) {
      _onFinish(reason);
      return iterator.return();
    }
  }, {
    highWaterMark: 2
  })
}


/***/ }),

/***/ "./node_modules/axios/lib/helpers/validator.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/validator.js ***!
  \*****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _env_data_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../env/data.js */ "./node_modules/axios/lib/env/data.js");
/* harmony import */ var _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/AxiosError.js */ "./node_modules/axios/lib/core/AxiosError.js");





const validators = {};

// eslint-disable-next-line func-names
['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach((type, i) => {
  validators[type] = function validator(thing) {
    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
  };
});

const deprecatedWarnings = {};

/**
 * Transitional option validator
 *
 * @param {function|boolean?} validator - set to false if the transitional option has been removed
 * @param {string?} version - deprecated version / removed since version
 * @param {string?} message - some message with additional info
 *
 * @returns {function}
 */
validators.transitional = function transitional(validator, version, message) {
  function formatMessage(opt, desc) {
    return '[Axios v' + _env_data_js__WEBPACK_IMPORTED_MODULE_0__.VERSION + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
  }

  // eslint-disable-next-line func-names
  return (value, opt, opts) => {
    if (validator === false) {
      throw new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_1__["default"](
        formatMessage(opt, ' has been removed' + (version ? ' in ' + version : '')),
        _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_1__["default"].ERR_DEPRECATED
      );
    }

    if (version && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      // eslint-disable-next-line no-console
      console.warn(
        formatMessage(
          opt,
          ' has been deprecated since v' + version + ' and will be removed in the near future'
        )
      );
    }

    return validator ? validator(value, opt, opts) : true;
  };
};

validators.spelling = function spelling(correctSpelling) {
  return (value, opt) => {
    // eslint-disable-next-line no-console
    console.warn(`${opt} is likely a misspelling of ${correctSpelling}`);
    return true;
  }
};

/**
 * Assert object's properties type
 *
 * @param {object} options
 * @param {object} schema
 * @param {boolean?} allowUnknown
 *
 * @returns {object}
 */

function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== 'object') {
    throw new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_1__["default"]('options must be an object', _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_1__["default"].ERR_BAD_OPTION_VALUE);
  }
  const keys = Object.keys(options);
  let i = keys.length;
  while (i-- > 0) {
    const opt = keys[i];
    const validator = schema[opt];
    if (validator) {
      const value = options[opt];
      const result = value === undefined || validator(value, opt, options);
      if (result !== true) {
        throw new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_1__["default"]('option ' + opt + ' must be ' + result, _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_1__["default"].ERR_BAD_OPTION_VALUE);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_1__["default"]('Unknown option ' + opt, _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_1__["default"].ERR_BAD_OPTION);
    }
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  assertOptions,
  validators
});


/***/ }),

/***/ "./node_modules/axios/lib/platform/browser/classes/Blob.js":
/*!*****************************************************************!*\
  !*** ./node_modules/axios/lib/platform/browser/classes/Blob.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (typeof Blob !== 'undefined' ? Blob : null);


/***/ }),

/***/ "./node_modules/axios/lib/platform/browser/classes/FormData.js":
/*!*********************************************************************!*\
  !*** ./node_modules/axios/lib/platform/browser/classes/FormData.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (typeof FormData !== 'undefined' ? FormData : null);


/***/ }),

/***/ "./node_modules/axios/lib/platform/browser/classes/URLSearchParams.js":
/*!****************************************************************************!*\
  !*** ./node_modules/axios/lib/platform/browser/classes/URLSearchParams.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _helpers_AxiosURLSearchParams_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../helpers/AxiosURLSearchParams.js */ "./node_modules/axios/lib/helpers/AxiosURLSearchParams.js");



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (typeof URLSearchParams !== 'undefined' ? URLSearchParams : _helpers_AxiosURLSearchParams_js__WEBPACK_IMPORTED_MODULE_0__["default"]);


/***/ }),

/***/ "./node_modules/axios/lib/platform/browser/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/axios/lib/platform/browser/index.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _classes_URLSearchParams_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./classes/URLSearchParams.js */ "./node_modules/axios/lib/platform/browser/classes/URLSearchParams.js");
/* harmony import */ var _classes_FormData_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./classes/FormData.js */ "./node_modules/axios/lib/platform/browser/classes/FormData.js");
/* harmony import */ var _classes_Blob_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./classes/Blob.js */ "./node_modules/axios/lib/platform/browser/classes/Blob.js");




/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  isBrowser: true,
  classes: {
    URLSearchParams: _classes_URLSearchParams_js__WEBPACK_IMPORTED_MODULE_0__["default"],
    FormData: _classes_FormData_js__WEBPACK_IMPORTED_MODULE_1__["default"],
    Blob: _classes_Blob_js__WEBPACK_IMPORTED_MODULE_2__["default"]
  },
  protocols: ['http', 'https', 'file', 'blob', 'url', 'data']
});


/***/ }),

/***/ "./node_modules/axios/lib/platform/common/utils.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/platform/common/utils.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   hasBrowserEnv: () => (/* binding */ hasBrowserEnv),
/* harmony export */   hasStandardBrowserEnv: () => (/* binding */ hasStandardBrowserEnv),
/* harmony export */   hasStandardBrowserWebWorkerEnv: () => (/* binding */ hasStandardBrowserWebWorkerEnv),
/* harmony export */   navigator: () => (/* binding */ _navigator),
/* harmony export */   origin: () => (/* binding */ origin)
/* harmony export */ });
const hasBrowserEnv = typeof window !== 'undefined' && typeof document !== 'undefined';

const _navigator = typeof navigator === 'object' && navigator || undefined;

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 *
 * @returns {boolean}
 */
const hasStandardBrowserEnv = hasBrowserEnv &&
  (!_navigator || ['ReactNative', 'NativeScript', 'NS'].indexOf(_navigator.product) < 0);

/**
 * Determine if we're running in a standard browser webWorker environment
 *
 * Although the `isStandardBrowserEnv` method indicates that
 * `allows axios to run in a web worker`, the WebWorker will still be
 * filtered out due to its judgment standard
 * `typeof window !== 'undefined' && typeof document !== 'undefined'`.
 * This leads to a problem when axios post `FormData` in webWorker
 */
const hasStandardBrowserWebWorkerEnv = (() => {
  return (
    typeof WorkerGlobalScope !== 'undefined' &&
    // eslint-disable-next-line no-undef
    self instanceof WorkerGlobalScope &&
    typeof self.importScripts === 'function'
  );
})();

const origin = hasBrowserEnv && window.location.href || 'http://localhost';




/***/ }),

/***/ "./node_modules/axios/lib/platform/index.js":
/*!**************************************************!*\
  !*** ./node_modules/axios/lib/platform/index.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node/index.js */ "./node_modules/axios/lib/platform/browser/index.js");
/* harmony import */ var _common_utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./common/utils.js */ "./node_modules/axios/lib/platform/common/utils.js");



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  ..._common_utils_js__WEBPACK_IMPORTED_MODULE_0__,
  ..._node_index_js__WEBPACK_IMPORTED_MODULE_1__["default"]
});


/***/ }),

/***/ "./node_modules/axios/lib/utils.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/utils.js ***!
  \*****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _helpers_bind_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helpers/bind.js */ "./node_modules/axios/lib/helpers/bind.js");




// utils is a library of generic helper functions non-specific to axios

const {toString} = Object.prototype;
const {getPrototypeOf} = Object;

const kindOf = (cache => thing => {
    const str = toString.call(thing);
    return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
})(Object.create(null));

const kindOfTest = (type) => {
  type = type.toLowerCase();
  return (thing) => kindOf(thing) === type
}

const typeOfTest = type => thing => typeof thing === type;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 *
 * @returns {boolean} True if value is an Array, otherwise false
 */
const {isArray} = Array;

/**
 * Determine if a value is undefined
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if the value is undefined, otherwise false
 */
const isUndefined = typeOfTest('undefined');

/**
 * Determine if a value is a Buffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && isFunction(val.constructor.isBuffer) && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
const isArrayBuffer = kindOfTest('ArrayBuffer');


/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  let result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (isArrayBuffer(val.buffer));
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a String, otherwise false
 */
const isString = typeOfTest('string');

/**
 * Determine if a value is a Function
 *
 * @param {*} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
const isFunction = typeOfTest('function');

/**
 * Determine if a value is a Number
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Number, otherwise false
 */
const isNumber = typeOfTest('number');

/**
 * Determine if a value is an Object
 *
 * @param {*} thing The value to test
 *
 * @returns {boolean} True if value is an Object, otherwise false
 */
const isObject = (thing) => thing !== null && typeof thing === 'object';

/**
 * Determine if a value is a Boolean
 *
 * @param {*} thing The value to test
 * @returns {boolean} True if value is a Boolean, otherwise false
 */
const isBoolean = thing => thing === true || thing === false;

/**
 * Determine if a value is a plain Object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a plain Object, otherwise false
 */
const isPlainObject = (val) => {
  if (kindOf(val) !== 'object') {
    return false;
  }

  const prototype = getPrototypeOf(val);
  return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in val) && !(Symbol.iterator in val);
}

/**
 * Determine if a value is a Date
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Date, otherwise false
 */
const isDate = kindOfTest('Date');

/**
 * Determine if a value is a File
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a File, otherwise false
 */
const isFile = kindOfTest('File');

/**
 * Determine if a value is a Blob
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Blob, otherwise false
 */
const isBlob = kindOfTest('Blob');

/**
 * Determine if a value is a FileList
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a File, otherwise false
 */
const isFileList = kindOfTest('FileList');

/**
 * Determine if a value is a Stream
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Stream, otherwise false
 */
const isStream = (val) => isObject(val) && isFunction(val.pipe);

/**
 * Determine if a value is a FormData
 *
 * @param {*} thing The value to test
 *
 * @returns {boolean} True if value is an FormData, otherwise false
 */
const isFormData = (thing) => {
  let kind;
  return thing && (
    (typeof FormData === 'function' && thing instanceof FormData) || (
      isFunction(thing.append) && (
        (kind = kindOf(thing)) === 'formdata' ||
        // detect form-data instance
        (kind === 'object' && isFunction(thing.toString) && thing.toString() === '[object FormData]')
      )
    )
  )
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
const isURLSearchParams = kindOfTest('URLSearchParams');

const [isReadableStream, isRequest, isResponse, isHeaders] = ['ReadableStream', 'Request', 'Response', 'Headers'].map(kindOfTest);

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 *
 * @returns {String} The String freed of excess whitespace
 */
const trim = (str) => str.trim ?
  str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 *
 * @param {Boolean} [allOwnKeys = false]
 * @returns {any}
 */
function forEach(obj, fn, {allOwnKeys = false} = {}) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  let i;
  let l;

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
    const len = keys.length;
    let key;

    for (i = 0; i < len; i++) {
      key = keys[i];
      fn.call(null, obj[key], key, obj);
    }
  }
}

function findKey(obj, key) {
  key = key.toLowerCase();
  const keys = Object.keys(obj);
  let i = keys.length;
  let _key;
  while (i-- > 0) {
    _key = keys[i];
    if (key === _key.toLowerCase()) {
      return _key;
    }
  }
  return null;
}

const _global = (() => {
  /*eslint no-undef:0*/
  if (typeof globalThis !== "undefined") return globalThis;
  return typeof self !== "undefined" ? self : (typeof window !== 'undefined' ? window : global)
})();

const isContextDefined = (context) => !isUndefined(context) && context !== _global;

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 *
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  const {caseless} = isContextDefined(this) && this || {};
  const result = {};
  const assignValue = (val, key) => {
    const targetKey = caseless && findKey(result, key) || key;
    if (isPlainObject(result[targetKey]) && isPlainObject(val)) {
      result[targetKey] = merge(result[targetKey], val);
    } else if (isPlainObject(val)) {
      result[targetKey] = merge({}, val);
    } else if (isArray(val)) {
      result[targetKey] = val.slice();
    } else {
      result[targetKey] = val;
    }
  }

  for (let i = 0, l = arguments.length; i < l; i++) {
    arguments[i] && forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 *
 * @param {Boolean} [allOwnKeys]
 * @returns {Object} The resulting value of object a
 */
const extend = (a, b, thisArg, {allOwnKeys}= {}) => {
  forEach(b, (val, key) => {
    if (thisArg && isFunction(val)) {
      a[key] = (0,_helpers_bind_js__WEBPACK_IMPORTED_MODULE_0__["default"])(val, thisArg);
    } else {
      a[key] = val;
    }
  }, {allOwnKeys});
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 *
 * @returns {string} content value without BOM
 */
const stripBOM = (content) => {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

/**
 * Inherit the prototype methods from one constructor into another
 * @param {function} constructor
 * @param {function} superConstructor
 * @param {object} [props]
 * @param {object} [descriptors]
 *
 * @returns {void}
 */
const inherits = (constructor, superConstructor, props, descriptors) => {
  constructor.prototype = Object.create(superConstructor.prototype, descriptors);
  constructor.prototype.constructor = constructor;
  Object.defineProperty(constructor, 'super', {
    value: superConstructor.prototype
  });
  props && Object.assign(constructor.prototype, props);
}

/**
 * Resolve object with deep prototype chain to a flat object
 * @param {Object} sourceObj source object
 * @param {Object} [destObj]
 * @param {Function|Boolean} [filter]
 * @param {Function} [propFilter]
 *
 * @returns {Object}
 */
const toFlatObject = (sourceObj, destObj, filter, propFilter) => {
  let props;
  let i;
  let prop;
  const merged = {};

  destObj = destObj || {};
  // eslint-disable-next-line no-eq-null,eqeqeq
  if (sourceObj == null) return destObj;

  do {
    props = Object.getOwnPropertyNames(sourceObj);
    i = props.length;
    while (i-- > 0) {
      prop = props[i];
      if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
        destObj[prop] = sourceObj[prop];
        merged[prop] = true;
      }
    }
    sourceObj = filter !== false && getPrototypeOf(sourceObj);
  } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);

  return destObj;
}

/**
 * Determines whether a string ends with the characters of a specified string
 *
 * @param {String} str
 * @param {String} searchString
 * @param {Number} [position= 0]
 *
 * @returns {boolean}
 */
const endsWith = (str, searchString, position) => {
  str = String(str);
  if (position === undefined || position > str.length) {
    position = str.length;
  }
  position -= searchString.length;
  const lastIndex = str.indexOf(searchString, position);
  return lastIndex !== -1 && lastIndex === position;
}


/**
 * Returns new array from array like object or null if failed
 *
 * @param {*} [thing]
 *
 * @returns {?Array}
 */
const toArray = (thing) => {
  if (!thing) return null;
  if (isArray(thing)) return thing;
  let i = thing.length;
  if (!isNumber(i)) return null;
  const arr = new Array(i);
  while (i-- > 0) {
    arr[i] = thing[i];
  }
  return arr;
}

/**
 * Checking if the Uint8Array exists and if it does, it returns a function that checks if the
 * thing passed in is an instance of Uint8Array
 *
 * @param {TypedArray}
 *
 * @returns {Array}
 */
// eslint-disable-next-line func-names
const isTypedArray = (TypedArray => {
  // eslint-disable-next-line func-names
  return thing => {
    return TypedArray && thing instanceof TypedArray;
  };
})(typeof Uint8Array !== 'undefined' && getPrototypeOf(Uint8Array));

/**
 * For each entry in the object, call the function with the key and value.
 *
 * @param {Object<any, any>} obj - The object to iterate over.
 * @param {Function} fn - The function to call for each entry.
 *
 * @returns {void}
 */
const forEachEntry = (obj, fn) => {
  const generator = obj && obj[Symbol.iterator];

  const iterator = generator.call(obj);

  let result;

  while ((result = iterator.next()) && !result.done) {
    const pair = result.value;
    fn.call(obj, pair[0], pair[1]);
  }
}

/**
 * It takes a regular expression and a string, and returns an array of all the matches
 *
 * @param {string} regExp - The regular expression to match against.
 * @param {string} str - The string to search.
 *
 * @returns {Array<boolean>}
 */
const matchAll = (regExp, str) => {
  let matches;
  const arr = [];

  while ((matches = regExp.exec(str)) !== null) {
    arr.push(matches);
  }

  return arr;
}

/* Checking if the kindOfTest function returns true when passed an HTMLFormElement. */
const isHTMLForm = kindOfTest('HTMLFormElement');

const toCamelCase = str => {
  return str.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g,
    function replacer(m, p1, p2) {
      return p1.toUpperCase() + p2;
    }
  );
};

/* Creating a function that will check if an object has a property. */
const hasOwnProperty = (({hasOwnProperty}) => (obj, prop) => hasOwnProperty.call(obj, prop))(Object.prototype);

/**
 * Determine if a value is a RegExp object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a RegExp object, otherwise false
 */
const isRegExp = kindOfTest('RegExp');

const reduceDescriptors = (obj, reducer) => {
  const descriptors = Object.getOwnPropertyDescriptors(obj);
  const reducedDescriptors = {};

  forEach(descriptors, (descriptor, name) => {
    let ret;
    if ((ret = reducer(descriptor, name, obj)) !== false) {
      reducedDescriptors[name] = ret || descriptor;
    }
  });

  Object.defineProperties(obj, reducedDescriptors);
}

/**
 * Makes all methods read-only
 * @param {Object} obj
 */

const freezeMethods = (obj) => {
  reduceDescriptors(obj, (descriptor, name) => {
    // skip restricted props in strict mode
    if (isFunction(obj) && ['arguments', 'caller', 'callee'].indexOf(name) !== -1) {
      return false;
    }

    const value = obj[name];

    if (!isFunction(value)) return;

    descriptor.enumerable = false;

    if ('writable' in descriptor) {
      descriptor.writable = false;
      return;
    }

    if (!descriptor.set) {
      descriptor.set = () => {
        throw Error('Can not rewrite read-only method \'' + name + '\'');
      };
    }
  });
}

const toObjectSet = (arrayOrString, delimiter) => {
  const obj = {};

  const define = (arr) => {
    arr.forEach(value => {
      obj[value] = true;
    });
  }

  isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));

  return obj;
}

const noop = () => {}

const toFiniteNumber = (value, defaultValue) => {
  return value != null && Number.isFinite(value = +value) ? value : defaultValue;
}

/**
 * If the thing is a FormData object, return true, otherwise return false.
 *
 * @param {unknown} thing - The thing to check.
 *
 * @returns {boolean}
 */
function isSpecCompliantForm(thing) {
  return !!(thing && isFunction(thing.append) && thing[Symbol.toStringTag] === 'FormData' && thing[Symbol.iterator]);
}

const toJSONObject = (obj) => {
  const stack = new Array(10);

  const visit = (source, i) => {

    if (isObject(source)) {
      if (stack.indexOf(source) >= 0) {
        return;
      }

      if(!('toJSON' in source)) {
        stack[i] = source;
        const target = isArray(source) ? [] : {};

        forEach(source, (value, key) => {
          const reducedValue = visit(value, i + 1);
          !isUndefined(reducedValue) && (target[key] = reducedValue);
        });

        stack[i] = undefined;

        return target;
      }
    }

    return source;
  }

  return visit(obj, 0);
}

const isAsyncFn = kindOfTest('AsyncFunction');

const isThenable = (thing) =>
  thing && (isObject(thing) || isFunction(thing)) && isFunction(thing.then) && isFunction(thing.catch);

// original code
// https://github.com/DigitalBrainJS/AxiosPromise/blob/16deab13710ec09779922131f3fa5954320f83ab/lib/utils.js#L11-L34

const _setImmediate = ((setImmediateSupported, postMessageSupported) => {
  if (setImmediateSupported) {
    return setImmediate;
  }

  return postMessageSupported ? ((token, callbacks) => {
    _global.addEventListener("message", ({source, data}) => {
      if (source === _global && data === token) {
        callbacks.length && callbacks.shift()();
      }
    }, false);

    return (cb) => {
      callbacks.push(cb);
      _global.postMessage(token, "*");
    }
  })(`axios@${Math.random()}`, []) : (cb) => setTimeout(cb);
})(
  typeof setImmediate === 'function',
  isFunction(_global.postMessage)
);

const asap = typeof queueMicrotask !== 'undefined' ?
  queueMicrotask.bind(_global) : ( typeof process !== 'undefined' && process.nextTick || _setImmediate);

// *********************

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  isArray,
  isArrayBuffer,
  isBuffer,
  isFormData,
  isArrayBufferView,
  isString,
  isNumber,
  isBoolean,
  isObject,
  isPlainObject,
  isReadableStream,
  isRequest,
  isResponse,
  isHeaders,
  isUndefined,
  isDate,
  isFile,
  isBlob,
  isRegExp,
  isFunction,
  isStream,
  isURLSearchParams,
  isTypedArray,
  isFileList,
  forEach,
  merge,
  extend,
  trim,
  stripBOM,
  inherits,
  toFlatObject,
  kindOf,
  kindOfTest,
  endsWith,
  toArray,
  forEachEntry,
  matchAll,
  isHTMLForm,
  hasOwnProperty,
  hasOwnProp: hasOwnProperty, // an alias to avoid ESLint no-prototype-builtins detection
  reduceDescriptors,
  freezeMethods,
  toObjectSet,
  toCamelCase,
  noop,
  toFiniteNumber,
  findKey,
  global: _global,
  isContextDefined,
  isSpecCompliantForm,
  toJSONObject,
  isAsyncFn,
  isThenable,
  setImmediate: _setImmediate,
  asap
});


/***/ }),

/***/ "./node_modules/nanoevents/index.js":
/*!******************************************!*\
  !*** ./node_modules/nanoevents/index.js ***!
  \******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createNanoEvents: () => (/* binding */ createNanoEvents)
/* harmony export */ });
let createNanoEvents = () => ({
  emit(event, ...args) {
    for (
      let callbacks = this.events[event] || [],
        i = 0,
        length = callbacks.length;
      i < length;
      i++
    ) {
      callbacks[i](...args)
    }
  },
  events: {},
  on(event, cb) {
    ;(this.events[event] ||= []).push(cb)
    return () => {
      this.events[event] = this.events[event]?.filter(i => cb !== i)
    }
  }
})


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!******************************************!*\
  !*** ./gameApp/src/domainWorkerStart.js ***!
  \******************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _common_utils_requester__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @common/utils/requester */ "./common/utils/requester.js");
/* harmony import */ var _common_sync_accountApi__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @common/sync/accountApi */ "./common/sync/accountApi.js");
/* harmony import */ var _sync_serverConnection__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./sync/serverConnection */ "./gameApp/src/sync/serverConnection.js");
/* harmony import */ var _sync_nestApi__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./sync/nestApi */ "./gameApp/src/sync/nestApi.js");
/* harmony import */ var _sync_colonyApi__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./sync/colonyApi */ "./gameApp/src/sync/colonyApi.js");
/* harmony import */ var _sync_antApi__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./sync/antApi */ "./gameApp/src/sync/antApi.js");
/* harmony import */ var _sync_nuptialEnvironmentApi__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./sync/nuptialEnvironmentApi */ "./gameApp/src/sync/nuptialEnvironmentApi.js");
/* harmony import */ var _common_domain_service_accountService__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @common/domain/service/accountService */ "./common/domain/service/accountService.js");
/* harmony import */ var _domain_service_messageHandlerService__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @domain/service/messageHandlerService */ "./gameApp/src/domain/service/messageHandlerService.js");
/* harmony import */ var _common_utils_eventEmitter__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @common/utils/eventEmitter */ "./common/utils/eventEmitter.js");
/* harmony import */ var _domain_worldFactory__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @domain/worldFactory */ "./gameApp/src/domain/worldFactory.js");
/* harmony import */ var _domain_service_worldService__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @domain/service/worldService */ "./gameApp/src/domain/service/worldService.js");
/* harmony import */ var _domain_service_colonyService__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @domain/service/colonyService */ "./gameApp/src/domain/service/colonyService.js");
/* harmony import */ var _domain_service_userService__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @domain/service/userService */ "./gameApp/src/domain/service/userService.js");
/* harmony import */ var _domain_service_nuptialEnvironmentService__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @domain/service/nuptialEnvironmentService */ "./gameApp/src/domain/service/nuptialEnvironmentService.js");
/* harmony import */ var _domain_service_nestService__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @domain/service/nestService */ "./gameApp/src/domain/service/nestService.js");
/* harmony import */ var _domain_service_antService__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @domain/service/antService */ "./gameApp/src/domain/service/antService.js");
/* harmony import */ var _domain_entity_nuptialEnvironment__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @domain/entity/nuptialEnvironment */ "./gameApp/src/domain/entity/nuptialEnvironment.js");
/* harmony import */ var _domain_worker_serializers_entitySerializer__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./domain/worker/serializers/entitySerializer */ "./gameApp/src/domain/worker/serializers/entitySerializer.js");
/* harmony import */ var _domain_worker_serializers_colonySerializer__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @domain/worker/serializers/colonySerializer */ "./gameApp/src/domain/worker/serializers/colonySerializer.js");
/* harmony import */ var _domain_worker_myStateCollector__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @domain/worker/myStateCollector */ "./gameApp/src/domain/worker/myStateCollector.js");
/* harmony import */ var _domain_worker_worldStepEventsCollector__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! @domain/worker/worldStepEventsCollector */ "./gameApp/src/domain/worker/worldStepEventsCollector.js");
/* harmony import */ var _domain_worker_viewPointManager__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! @domain/worker/viewPointManager */ "./gameApp/src/domain/worker/viewPointManager.js");
/* harmony import */ var _domain_worker_domainWorker__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./domain/worker/domainWorker */ "./gameApp/src/domain/worker/domainWorker.js");





























let requester = new _common_utils_requester__WEBPACK_IMPORTED_MODULE_0__.Requester();
let serverConnection = new _sync_serverConnection__WEBPACK_IMPORTED_MODULE_2__.ServerConnection();
let accountApi = new _common_sync_accountApi__WEBPACK_IMPORTED_MODULE_1__.AccountApi(requester);
let nestApi = new _sync_nestApi__WEBPACK_IMPORTED_MODULE_3__.NestApi(requester);
let colonyApi = new _sync_colonyApi__WEBPACK_IMPORTED_MODULE_4__.ColonyApi(requester);
let antApi = new _sync_antApi__WEBPACK_IMPORTED_MODULE_5__.AntApi(requester);
let nuptialEnvironmentApi = new _sync_nuptialEnvironmentApi__WEBPACK_IMPORTED_MODULE_6__.NuptialEnvironmentApi(requester)

let eventBus = new _common_utils_eventEmitter__WEBPACK_IMPORTED_MODULE_9__.EventEmitter();
let worldFactory = new _domain_worldFactory__WEBPACK_IMPORTED_MODULE_10__.WorldFactory(eventBus);
let world = worldFactory.buildWorld();
let nuptialEnv = _domain_entity_nuptialEnvironment__WEBPACK_IMPORTED_MODULE_17__.NuptialEnvironment.build();
let worldService = new _domain_service_worldService__WEBPACK_IMPORTED_MODULE_11__.WorldService(world, worldFactory, eventBus);
let accountService = new _common_domain_service_accountService__WEBPACK_IMPORTED_MODULE_7__.AccountService(accountApi);
let colonyService = new _domain_service_colonyService__WEBPACK_IMPORTED_MODULE_12__.ColonyService(eventBus, world, colonyApi, worldFactory);
let userService = new _domain_service_userService__WEBPACK_IMPORTED_MODULE_13__.UserService(eventBus, world);
let nuptialEnvironmentService = new _domain_service_nuptialEnvironmentService__WEBPACK_IMPORTED_MODULE_14__.NuptialEnvironmentService(eventBus, world, nuptialEnv, nuptialEnvironmentApi);
let nestService = new _domain_service_nestService__WEBPACK_IMPORTED_MODULE_15__.NestService(eventBus, world, nestApi);
let antService = new _domain_service_antService__WEBPACK_IMPORTED_MODULE_16__.AntService(eventBus, world, antApi);
let messageHandlerService = new _domain_service_messageHandlerService__WEBPACK_IMPORTED_MODULE_8__.MessageHandlerService(eventBus, serverConnection, worldService, colonyService, userService, nuptialEnvironmentService, accountService);

let entitySerializer = new _domain_worker_serializers_entitySerializer__WEBPACK_IMPORTED_MODULE_18__.EntitySerializer();
let colonySerializer = new _domain_worker_serializers_colonySerializer__WEBPACK_IMPORTED_MODULE_19__.ColonySerializer();

let viewPointManager = new _domain_worker_viewPointManager__WEBPACK_IMPORTED_MODULE_22__.ViewPointManager();
let myStateCollector = new _domain_worker_myStateCollector__WEBPACK_IMPORTED_MODULE_20__.MyStateCollector(eventBus, world, nuptialEnv, userService, entitySerializer, colonySerializer);
let worldStepEventsCollector = new _domain_worker_worldStepEventsCollector__WEBPACK_IMPORTED_MODULE_21__.WorldStepEventsCollector(eventBus);
new _domain_worker_domainWorker__WEBPACK_IMPORTED_MODULE_23__.DomainWorker(eventBus, entitySerializer, viewPointManager, requester, myStateCollector, worldStepEventsCollector, {
    worldService,
    accountService,
    colonyService,
    userService,
    nuptialEnvironmentService,
    nestService,
    antService,
    messageHandlerService
});
})();

/******/ })()
;
//# sourceMappingURL=domainWorker.js.map