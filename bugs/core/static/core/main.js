/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./bugs/core/client/src/domain/domainFacade.js":
/*!*****************************************************!*\
  !*** ./bugs/core/client/src/domain/domainFacade.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"DomainFacade\": () => (/* binding */ DomainFacade)\n/* harmony export */ });\n/* harmony import */ var _worldFactory__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./worldFactory */ \"./bugs/core/client/src/domain/worldFactory.js\");\n/* harmony import */ var _entity_action_actionFactory__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./entity/action/actionFactory */ \"./bugs/core/client/src/domain/entity/action/actionFactory.js\");\n/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! events */ \"./node_modules/events/events.js\");\n/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(events__WEBPACK_IMPORTED_MODULE_2__);\n\r\n\r\n\r\n\r\nclass DomainFacade {\r\n\r\n    constructor() {\r\n        this._world = null;\r\n        this._worldFactory = null;\r\n        this._actionFactory = null;\r\n    }\r\n\r\n    initWorld(worldJson) {\r\n        let mainEventBus = new (events__WEBPACK_IMPORTED_MODULE_2___default())();\r\n        this._worldFactory = new _worldFactory__WEBPACK_IMPORTED_MODULE_0__.WorldFactory(mainEventBus);\r\n        this._world = this._worldFactory.buildWorldFromJson(worldJson);\r\n        this._actionFactory = new _entity_action_actionFactory__WEBPACK_IMPORTED_MODULE_1__.ActionFactory(this._world);\r\n    }\r\n\r\n    updateEntity(entityJson) {\r\n        this._world.updateEntity(entityJson);\r\n    }\r\n\r\n    deleteEntity(entityId) {\r\n        this._world.deleteEntity(entityId);\r\n    }\r\n\r\n    addNewEntity(entityJson) {\r\n        let entity = this._worldFactory.buildEntity(entityJson);\r\n        this._world.addEntity(entity);\r\n    }\r\n\r\n    playAction(actionJson) {\r\n        let action = this._actionFactory.buildAction(actionJson);\r\n        this._world.playAction(action);\r\n    }\r\n\r\n    getEntities() {\r\n        return this._world.entities;\r\n    }\r\n\r\n}\r\n\n\n//# sourceURL=webpack://bugs/./bugs/core/client/src/domain/domainFacade.js?");

/***/ }),

/***/ "./bugs/core/client/src/domain/entity/action/action.js":
/*!*************************************************************!*\
  !*** ./bugs/core/client/src/domain/entity/action/action.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Action\": () => (/* binding */ Action)\n/* harmony export */ });\nclass Action {\r\n\r\n    constructor(entityId, actionType, time, actionData) {\r\n        this.entityId = entityId;\r\n        this.type = actionType;\r\n        this.time = time;\r\n        this.additionalData = actionData;\r\n    }\r\n\r\n}\r\n\r\n\n\n//# sourceURL=webpack://bugs/./bugs/core/client/src/domain/entity/action/action.js?");

/***/ }),

/***/ "./bugs/core/client/src/domain/entity/action/actionFactory.js":
/*!********************************************************************!*\
  !*** ./bugs/core/client/src/domain/entity/action/actionFactory.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"ActionFactory\": () => (/* binding */ ActionFactory)\n/* harmony export */ });\n/* harmony import */ var _actionTypes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./actionTypes */ \"./bugs/core/client/src/domain/entity/action/actionTypes.js\");\n/* harmony import */ var _action__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./action */ \"./bugs/core/client/src/domain/entity/action/action.js\");\n\r\n\r\n\r\nclass ActionFactory {\r\n\r\n    constructor(world) {\r\n        this._world = world;\r\n    }\r\n\r\n    buildAction(actionJson) {\r\n        switch (actionJson.action_type) {\r\n            case _actionTypes__WEBPACK_IMPORTED_MODULE_0__.ACTION_TYPES.WALK:\r\n                return this._buildWalkAction(actionJson);\r\n            case _actionTypes__WEBPACK_IMPORTED_MODULE_0__.ACTION_TYPES.FOOD_PICKED:\r\n                return this._buildFoodPickedAction(actionJson);\r\n            case _actionTypes__WEBPACK_IMPORTED_MODULE_0__.ACTION_TYPES.FOOD_GAVE:\r\n                return this._buildFoodGaveAction(actionJson);\r\n            case _actionTypes__WEBPACK_IMPORTED_MODULE_0__.ACTION_TYPES.EAT_FOOD:\r\n                return this._buildEatFoodAction(actionJson)\r\n        }\r\n    }\r\n\r\n    _buildWalkAction(actionJson) {\r\n        return this._buildAction(actionJson.entity_id, actionJson.action_type, actionJson.time, {\r\n            position: actionJson.action_data.position\r\n        });\r\n    }\r\n\r\n    _buildFoodPickedAction(actionJson) {\r\n        let food = this._world.findEntityById(actionJson.action_data.food_id);\r\n        return this._buildAction(actionJson.entity_id, actionJson.action_type, actionJson.time, {\r\n            food\r\n        });\r\n    }\r\n\r\n    _buildEatFoodAction(actionJson) {\r\n        let food = this._world.findEntityById(actionJson.action_data.food_id);\r\n        return this._buildAction(actionJson.entity_id, actionJson.action_type, actionJson.time, {\r\n            food,\r\n            is_food_eaten: actionJson.action_data.is_food_eaten\r\n        });\r\n    }\r\n\r\n    _buildFoodGaveAction(actionJson) {\r\n        return this._buildAction(actionJson.entity_id, actionJson.action_type, actionJson.time);\r\n    }\r\n\r\n    _buildAction(entityId, actionType, time, data) {\r\n        return new _action__WEBPACK_IMPORTED_MODULE_1__.Action(entityId, actionType, time, data);\r\n    }\r\n}\r\n\r\n\n\n//# sourceURL=webpack://bugs/./bugs/core/client/src/domain/entity/action/actionFactory.js?");

/***/ }),

/***/ "./bugs/core/client/src/domain/entity/action/actionTypes.js":
/*!******************************************************************!*\
  !*** ./bugs/core/client/src/domain/entity/action/actionTypes.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"ACTION_TYPES\": () => (/* binding */ ACTION_TYPES)\n/* harmony export */ });\nconst ACTION_TYPES = {\r\n    WALK: 'walk',\r\n    FOOD_PICKED: 'food_picked',\r\n    FOOD_GAVE: 'picked_food_gave',\r\n    EAT_FOOD: 'eat_food'\r\n\r\n};\r\n\r\n\n\n//# sourceURL=webpack://bugs/./bugs/core/client/src/domain/entity/action/actionTypes.js?");

/***/ }),

/***/ "./bugs/core/client/src/domain/entity/bug.js":
/*!***************************************************!*\
  !*** ./bugs/core/client/src/domain/entity/bug.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Bug\": () => (/* binding */ Bug)\n/* harmony export */ });\n/* harmony import */ var _entity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./entity */ \"./bugs/core/client/src/domain/entity/entity.js\");\n/* harmony import */ var _entityTypes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./entityTypes */ \"./bugs/core/client/src/domain/entity/entityTypes.js\");\n/* harmony import */ var _action_actionTypes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./action/actionTypes */ \"./bugs/core/client/src/domain/entity/action/actionTypes.js\");\n\r\n\r\n\r\n\r\nclass Bug extends _entity__WEBPACK_IMPORTED_MODULE_0__.Entity {\r\n\r\n    constructor(eventBus, id, position) {\r\n        super(eventBus, id, position, _entityTypes__WEBPACK_IMPORTED_MODULE_1__.EntityTypes.BUG);\r\n        this.pickedFood = null;\r\n    }\r\n\r\n    updateEntity(entityJson) {\r\n    }\r\n\r\n    getColor() {\r\n        // return this._homeTown.getColor()\r\n    }\r\n\r\n    playAction(action) {\r\n        switch (action.type) {\r\n            case _action_actionTypes__WEBPACK_IMPORTED_MODULE_2__.ACTION_TYPES.WALK:\r\n                return this._playWalkAction(action);\r\n            case _action_actionTypes__WEBPACK_IMPORTED_MODULE_2__.ACTION_TYPES.FOOD_PICKED:\r\n                return this._playFoodPickingAction(action);\r\n            case _action_actionTypes__WEBPACK_IMPORTED_MODULE_2__.ACTION_TYPES.FOOD_GAVE:\r\n                return this._playFoodGiving(action);\r\n            case _action_actionTypes__WEBPACK_IMPORTED_MODULE_2__.ACTION_TYPES.EAT_FOOD:\r\n                return this._playEatFoodAction(action);\r\n            default:\r\n                throw 'unknown type of action'\r\n        }\r\n    }\r\n\r\n    hasPickedFood() {\r\n        return !!this.pickedFood;\r\n    }\r\n\r\n    _playWalkAction(action) {\r\n        let wholeWalkTime = action.time * 1000;\r\n        let walkStartAt = Date.now();\r\n        let destPosition = action.additionalData.position;\r\n        let startPosition = this.position;\r\n        return new Promise((res, rej) => {\r\n            let walkInterval = setInterval(() => {\r\n                let timeInWalk = Date.now() - walkStartAt;\r\n                let walkedPercent = ( 100 * timeInWalk ) / wholeWalkTime;\r\n                if (walkedPercent < 100) {\r\n                    let currentX = this._calcCoordForWalkedPercent(startPosition.x, destPosition.x, walkedPercent);\r\n                    let currentY = this._calcCoordForWalkedPercent(startPosition.y, destPosition.y, walkedPercent);\r\n                    this.setPosition(currentX, currentY);\r\n                } else {\r\n                    this.setPosition(destPosition.x, destPosition.y);\r\n                    clearInterval(walkInterval);\r\n                    res();\r\n                }\r\n            }, 100)\r\n        });\r\n    }\r\n\r\n    _playFoodPickingAction(action) {\r\n        return new Promise((res) => {\r\n            setTimeout(() => {\r\n                this.pickedFood = action.additionalData.food;\r\n                this.pickedFood.die();\r\n                res();\r\n            }, action.time * 1000)\r\n        });\r\n    }\r\n\r\n    _playFoodGiving(action) {\r\n        return new Promise((res) => {\r\n            setTimeout(() => {\r\n                this.pickedFood = null;\r\n                res();\r\n            }, action.time * 1000)\r\n        });\r\n    }\r\n\r\n    _playEatFoodAction(action) {\r\n        return new Promise((res) => {\r\n            setTimeout(() => {\r\n                if (action.additionalData.is_food_eaten) {\r\n                    action.additionalData.food.die();\r\n                }\r\n                res();\r\n            }, action.time * 1000)\r\n        });\r\n    }\r\n\r\n    _calcCoordForWalkedPercent(startCoord, endCoord, flayedPercent) {\r\n        let distance = Math.abs(Math.abs(endCoord) - Math.abs(startCoord));\r\n        let distancePassed = distance * (flayedPercent  / 100);\r\n        return endCoord > startCoord ? startCoord + distancePassed : startCoord - distancePassed;\r\n    }\r\n\r\n}\r\n\r\n\n\n//# sourceURL=webpack://bugs/./bugs/core/client/src/domain/entity/bug.js?");

/***/ }),

/***/ "./bugs/core/client/src/domain/entity/entity.js":
/*!******************************************************!*\
  !*** ./bugs/core/client/src/domain/entity/entity.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Entity\": () => (/* binding */ Entity)\n/* harmony export */ });\nclass Entity {\r\n\r\n    constructor(eventBus, id, position, type) {\r\n        this._eventBus = eventBus;\r\n        this.id = id;\r\n        this._position = position;\r\n        this.type = type;\r\n        this._actionStack = [];\r\n        this._isPlaying = false;\r\n        this._isHidden = false;\r\n    }\r\n\r\n    setPosition(x, y) {\r\n        this._position = {x, y};\r\n    }\r\n\r\n    get position(){\r\n        return this._position;\r\n    }\r\n\r\n    updateEntity(entityJson) {\r\n    }\r\n\r\n    addAction(action) {\r\n        this._actionStack.push(action);\r\n        this._handleActionsByTimeReducer();\r\n        this.tryPlayNextAction();\r\n    }\r\n\r\n    playAction(action) {}\r\n\r\n    tryPlayNextAction() {\r\n        if (this._actionStack.length == 0 || this._isPlaying) {\r\n            return\r\n        }\r\n        let nextAction = this._actionStack[0];\r\n        this._actionStack.shift();\r\n\r\n        this._isPlaying = true;\r\n        this.playAction(nextAction)\r\n            .then(() => {\r\n                this._isPlaying = false;\r\n                this.tryPlayNextAction();\r\n            });\r\n    }\r\n\r\n    isHidden() {\r\n        return this._isHidden;\r\n    }\r\n\r\n    toggleHidden(isHidden) {\r\n        this._isHidden = isHidden;\r\n    }\r\n\r\n    emit(eventName, data) {\r\n        this._eventBus.emit(eventName, data);\r\n    }\r\n\r\n    die() {\r\n        this.emit('died', this);\r\n    }\r\n\r\n    _handleActionsByTimeReducer() {\r\n        if (this._actionStack.length <= 3) {\r\n            return;\r\n        }\r\n        let actionTimeReducer;\r\n        if (this._actionStack.length == 4) {\r\n            actionTimeReducer = 0.9;\r\n        }\r\n        if (this._actionStack.length == 5) {\r\n            actionTimeReducer = 0.7;\r\n        }\r\n        if (this._actionStack.length > 5) {\r\n            actionTimeReducer = 0.5;\r\n        }\r\n        this._actionStack.forEach(action => {\r\n            action.time *= actionTimeReducer;\r\n        });\r\n    }\r\n\r\n}\r\n\r\n\n\n//# sourceURL=webpack://bugs/./bugs/core/client/src/domain/entity/entity.js?");

/***/ }),

/***/ "./bugs/core/client/src/domain/entity/entityTypes.js":
/*!***********************************************************!*\
  !*** ./bugs/core/client/src/domain/entity/entityTypes.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"EntityTypes\": () => (/* binding */ EntityTypes)\n/* harmony export */ });\nconst EntityTypes = {\r\n    BUG: 'bug',\r\n    FOOD: 'food',\r\n    TOWN: 'town',\r\n    FOOD_AREA: 'food_area'\r\n}\r\n\r\n\n\n//# sourceURL=webpack://bugs/./bugs/core/client/src/domain/entity/entityTypes.js?");

/***/ }),

/***/ "./bugs/core/client/src/domain/entity/food.js":
/*!****************************************************!*\
  !*** ./bugs/core/client/src/domain/entity/food.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Food\": () => (/* binding */ Food)\n/* harmony export */ });\n/* harmony import */ var _entity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./entity */ \"./bugs/core/client/src/domain/entity/entity.js\");\n/* harmony import */ var _entityTypes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./entityTypes */ \"./bugs/core/client/src/domain/entity/entityTypes.js\");\n\r\n\r\n\r\nclass Food extends _entity__WEBPACK_IMPORTED_MODULE_0__.Entity {\r\n    constructor(eventBus, id, position, calories) {\r\n        super(eventBus, id, position, _entityTypes__WEBPACK_IMPORTED_MODULE_1__.EntityTypes.FOOD);\r\n        this.calories = calories;\r\n    }\r\n\r\n    updateEntity(entityJson) {\r\n    }\r\n}\r\n\r\n\n\n//# sourceURL=webpack://bugs/./bugs/core/client/src/domain/entity/food.js?");

/***/ }),

/***/ "./bugs/core/client/src/domain/entity/foodArea.js":
/*!********************************************************!*\
  !*** ./bugs/core/client/src/domain/entity/foodArea.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"FoodArea\": () => (/* binding */ FoodArea)\n/* harmony export */ });\n/* harmony import */ var _entity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./entity */ \"./bugs/core/client/src/domain/entity/entity.js\");\n/* harmony import */ var _entityTypes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./entityTypes */ \"./bugs/core/client/src/domain/entity/entityTypes.js\");\n\r\n\r\n\r\nclass FoodArea extends _entity__WEBPACK_IMPORTED_MODULE_0__.Entity {\r\n    constructor(eventBus, id, position, calories) {\r\n        super(eventBus, id, position, _entityTypes__WEBPACK_IMPORTED_MODULE_1__.EntityTypes.FOOD_AREA);\r\n    }\r\n\r\n    updateEntity(entityJson) {\r\n    }\r\n}\r\n\r\n\n\n//# sourceURL=webpack://bugs/./bugs/core/client/src/domain/entity/foodArea.js?");

/***/ }),

/***/ "./bugs/core/client/src/domain/entity/town.js":
/*!****************************************************!*\
  !*** ./bugs/core/client/src/domain/entity/town.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Town\": () => (/* binding */ Town)\n/* harmony export */ });\n/* harmony import */ var _entity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./entity */ \"./bugs/core/client/src/domain/entity/entity.js\");\n/* harmony import */ var _entityTypes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./entityTypes */ \"./bugs/core/client/src/domain/entity/entityTypes.js\");\n\r\n\r\n\r\nclass Town extends _entity__WEBPACK_IMPORTED_MODULE_0__.Entity {\r\n\r\n    constructor(eventBus, id, position, color) {\r\n        super(eventBus, id, position, _entityTypes__WEBPACK_IMPORTED_MODULE_1__.EntityTypes.TOWN);\r\n        this._color = color\r\n    }\r\n\r\n    get color() {\r\n        return this._color\r\n    }\r\n\r\n}\r\n\r\n\r\n\n\n//# sourceURL=webpack://bugs/./bugs/core/client/src/domain/entity/town.js?");

/***/ }),

/***/ "./bugs/core/client/src/domain/entity/world.js":
/*!*****************************************************!*\
  !*** ./bugs/core/client/src/domain/entity/world.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"World\": () => (/* binding */ World)\n/* harmony export */ });\nclass World {\r\n    constructor(eventBus, entities) {\r\n        this._eventBus = eventBus;\r\n        this._entities = entities;\r\n\r\n        this._eventBus.on('died', this._on_died.bind(this));\r\n    }\r\n\r\n    get entities() {\r\n        return [...this._entities];\r\n    }\r\n\r\n    addEntity(entity) {\r\n        this._entities.push(entity);\r\n    }\r\n\r\n    updateEntity(entityJson) {\r\n        let entity = this.findEntityById(entityJson.id);\r\n        entity.updateEntity(entityJson);\r\n    }\r\n\r\n    playAction(action) {\r\n        let entity = this.findEntityById(action.entityId);\r\n        entity.addAction(action);\r\n    }\r\n\r\n    deleteEntity(entityId) {\r\n        let entityIndex = -1;\r\n        for (let i = 0; i < this._entities.length; i++)  {\r\n            if (this._entities[i].id == entityId) {\r\n                entityIndex = i;\r\n                break;\r\n            }\r\n        }\r\n\r\n        if (entityIndex != -1) {\r\n            this._entities.splice(entityIndex, 1);\r\n        }\r\n    }\r\n\r\n    findEntityById(id) {\r\n        return this._entities.find( entity => entity.id === id);\r\n    }\r\n\r\n    _on_died(entity) {\r\n        this.deleteEntity(entity.id);\r\n    }\r\n\r\n}\r\n\r\n\n\n//# sourceURL=webpack://bugs/./bugs/core/client/src/domain/entity/world.js?");

/***/ }),

/***/ "./bugs/core/client/src/domain/index.js":
/*!**********************************************!*\
  !*** ./bugs/core/client/src/domain/index.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"initDomainLayer\": () => (/* binding */ initDomainLayer)\n/* harmony export */ });\n/* harmony import */ var _domainFacade__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./domainFacade */ \"./bugs/core/client/src/domain/domainFacade.js\");\n\r\n\r\nfunction initDomainLayer() {\r\n    let domainFacade = new _domainFacade__WEBPACK_IMPORTED_MODULE_0__.DomainFacade();\r\n\r\n    return domainFacade;\r\n}\r\n\r\n\n\n//# sourceURL=webpack://bugs/./bugs/core/client/src/domain/index.js?");

/***/ }),

/***/ "./bugs/core/client/src/domain/worldFactory.js":
/*!*****************************************************!*\
  !*** ./bugs/core/client/src/domain/worldFactory.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"WorldFactory\": () => (/* binding */ WorldFactory)\n/* harmony export */ });\n/* harmony import */ var _entity_entityTypes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./entity/entityTypes */ \"./bugs/core/client/src/domain/entity/entityTypes.js\");\n/* harmony import */ var _entity_bug__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./entity/bug */ \"./bugs/core/client/src/domain/entity/bug.js\");\n/* harmony import */ var _entity_world__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./entity/world */ \"./bugs/core/client/src/domain/entity/world.js\");\n/* harmony import */ var _entity_town__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./entity/town */ \"./bugs/core/client/src/domain/entity/town.js\");\n/* harmony import */ var _entity_food__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./entity/food */ \"./bugs/core/client/src/domain/entity/food.js\");\n/* harmony import */ var _entity_foodArea__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./entity/foodArea */ \"./bugs/core/client/src/domain/entity/foodArea.js\");\n\r\n\r\n\r\n\r\n\r\n\r\n\r\nclass WorldFactory {\r\n\r\n    constructor(mainEventBus) {\r\n        this.mainEventBus = mainEventBus;\r\n    }\r\n\r\n    buildWorldFromJson(worldJson) {\r\n        let entities = [];\r\n        worldJson.entities.forEach(entityJson => {\r\n            let entity = this.buildEntity(entityJson);\r\n            entities.push(entity);\r\n        });\r\n\r\n        let world = this.buildWorld(entities);\r\n\r\n        return world;\r\n    }\r\n\r\n    buildWorld(entities) {\r\n        return new _entity_world__WEBPACK_IMPORTED_MODULE_2__.World(this.mainEventBus, entities);\r\n    }\r\n\r\n    buildBug(id, position) {\r\n        return new _entity_bug__WEBPACK_IMPORTED_MODULE_1__.Bug(this.mainEventBus, id, position);\r\n    }\r\n\r\n    buildTown(id, position, color) {\r\n        return new _entity_town__WEBPACK_IMPORTED_MODULE_3__.Town(this.mainEventBus, id, position, color);\r\n    }\r\n\r\n    buildFood(id, position, calories) {\r\n        return new _entity_food__WEBPACK_IMPORTED_MODULE_4__.Food(this.mainEventBus, id, position, calories);\r\n    }\r\n\r\n    buildFoodArea(id, position) {\r\n        return new _entity_foodArea__WEBPACK_IMPORTED_MODULE_5__.FoodArea(this.mainEventBus, id, position);\r\n    }\r\n\r\n    buildEntity(entityJson) {\r\n        switch(entityJson.type) {\r\n            case _entity_entityTypes__WEBPACK_IMPORTED_MODULE_0__.EntityTypes.BUG:\r\n                return this.buildBug(entityJson.id, entityJson.position);\r\n            case _entity_entityTypes__WEBPACK_IMPORTED_MODULE_0__.EntityTypes.TOWN:\r\n                return this.buildTown(entityJson.id, entityJson.position, entityJson.color);\r\n            case _entity_entityTypes__WEBPACK_IMPORTED_MODULE_0__.EntityTypes.FOOD:\r\n                return this.buildFood(entityJson.id, entityJson.position, entityJson.calories);\r\n            case _entity_entityTypes__WEBPACK_IMPORTED_MODULE_0__.EntityTypes.FOOD_AREA:\r\n                return this.buildFoodArea(entityJson.id, entityJson.position);\r\n            default:\r\n                throw 'unknown type of entity';\r\n        }\r\n    }\r\n}\r\n\r\n\n\n//# sourceURL=webpack://bugs/./bugs/core/client/src/domain/worldFactory.js?");

/***/ }),

/***/ "./bugs/core/client/src/index.js":
/*!***************************************!*\
  !*** ./bugs/core/client/src/index.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _sync__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./sync */ \"./bugs/core/client/src/sync/index.js\");\n/* harmony import */ var _domain__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./domain */ \"./bugs/core/client/src/domain/index.js\");\n/* harmony import */ var _view__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./view */ \"./bugs/core/client/src/view/index.js\");\n\r\n\r\n\r\n\r\nlet domainFacade = (0,_domain__WEBPACK_IMPORTED_MODULE_1__.initDomainLayer)();\r\n(0,_sync__WEBPACK_IMPORTED_MODULE_0__.initSyncLayer)(domainFacade);\r\n(0,_view__WEBPACK_IMPORTED_MODULE_2__.initViewLayer)(domainFacade);\r\n\n\n//# sourceURL=webpack://bugs/./bugs/core/client/src/index.js?");

/***/ }),

/***/ "./bugs/core/client/src/sync/index.js":
/*!********************************************!*\
  !*** ./bugs/core/client/src/sync/index.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"initSyncLayer\": () => (/* binding */ initSyncLayer)\n/* harmony export */ });\n/* harmony import */ var _mainSocketConsumer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./mainSocketConsumer */ \"./bugs/core/client/src/sync/mainSocketConsumer.js\");\n\r\n\r\nfunction initSyncLayer(domainFacade) {\r\n    let socket = new WebSocket(`ws://${location.host}/mainsocket`);\r\n    let socketConsumer = new _mainSocketConsumer__WEBPACK_IMPORTED_MODULE_0__.MainSocketConsumer(socket, domainFacade);\r\n}\r\n\r\n\n\n//# sourceURL=webpack://bugs/./bugs/core/client/src/sync/index.js?");

/***/ }),

/***/ "./bugs/core/client/src/sync/mainSocketConsumer.js":
/*!*********************************************************!*\
  !*** ./bugs/core/client/src/sync/mainSocketConsumer.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"MainSocketConsumer\": () => (/* binding */ MainSocketConsumer)\n/* harmony export */ });\nclass MainSocketConsumer {\r\n    constructor(socket, domainFacade) {\r\n        this._socket = socket;\r\n        this._domainFacade = domainFacade;\r\n\r\n        this._socket.onopen = this._onOpen.bind(this);\r\n        this._socket.onmessage = this._onMsg.bind(this);\r\n    }\r\n\r\n    _onOpen() {\r\n        console.log('connected');\r\n    }\r\n\r\n    _onMsg(event) {\r\n        let msg = JSON.parse(event.data);\r\n        switch(msg.type) {\r\n            case 'whole_world':\r\n                this._domainFacade.initWorld(msg.world);\r\n                break;\r\n            case 'entity_changed':\r\n                this._domainFacade.updateEntity(msg.entity);\r\n                break;\r\n            // case 'entity_died':\r\n            //     this._domainFacade.deleteEntity(msg.entity_id);\r\n            //     break;\r\n            case 'entity_born':\r\n                this._domainFacade.addNewEntity(msg.entity);\r\n                break;\r\n            case 'entity_action':\r\n                this._domainFacade.playAction(msg.action);\r\n                break;\r\n            default: \r\n                throw `unknown type of message \"${ msg.type }\"`\r\n        }\r\n    }\r\n}\r\n\r\n\n\n//# sourceURL=webpack://bugs/./bugs/core/client/src/sync/mainSocketConsumer.js?");

/***/ }),

/***/ "./bugs/core/client/src/view/index.js":
/*!********************************************!*\
  !*** ./bugs/core/client/src/view/index.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"initViewLayer\": () => (/* binding */ initViewLayer)\n/* harmony export */ });\n/* harmony import */ var _worldView__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./worldView */ \"./bugs/core/client/src/view/worldView.js\");\n\r\n\r\nfunction initViewLayer(domainFacade) {\r\n    let canvEl = document.getElementById('bugsCanvas');\r\n    let worldView = new _worldView__WEBPACK_IMPORTED_MODULE_0__.WorldView(canvEl, domainFacade);\r\n}\r\n\r\n\n\n//# sourceURL=webpack://bugs/./bugs/core/client/src/view/index.js?");

/***/ }),

/***/ "./bugs/core/client/src/view/worldView.js":
/*!************************************************!*\
  !*** ./bugs/core/client/src/view/worldView.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"WorldView\": () => (/* binding */ WorldView)\n/* harmony export */ });\n/* harmony import */ var _domain_entity_entityTypes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../domain/entity/entityTypes */ \"./bugs/core/client/src/domain/entity/entityTypes.js\");\n\r\n\r\nclass WorldView {\r\n    constructor(canvas, domainFacade) {\r\n        this._domainFacade = domainFacade;\r\n        this._canvas = canvas;\r\n        this._ctx = this._canvas.getContext('2d');\r\n\r\n        setInterval(this._renderWorld.bind(this), 100);\r\n    }\r\n\r\n    _renderWorld() {\r\n        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);\r\n\r\n        let entities = this._domainFacade.getEntities();\r\n        entities.forEach(entity => {\r\n            if (entity.isHidden()) {\r\n                return;\r\n            }\r\n            \r\n            switch (entity.type) {\r\n                case _domain_entity_entityTypes__WEBPACK_IMPORTED_MODULE_0__.EntityTypes.BUG:\r\n                    this._renderBug(entity);\r\n                    break;\r\n                case _domain_entity_entityTypes__WEBPACK_IMPORTED_MODULE_0__.EntityTypes.TOWN:\r\n                    this._renderTown(entity);\r\n                    break;\r\n                case _domain_entity_entityTypes__WEBPACK_IMPORTED_MODULE_0__.EntityTypes.FOOD:\r\n                    this._renderFood(entity);\r\n                    break;\r\n            }\r\n        });\r\n    }\r\n\r\n    _renderBug(bug) {\r\n        let width = 10;\r\n        let height = 10;\r\n        let posX = bug.position.x - width / 2;\r\n        let posY = bug.position.y - height / 2;\r\n        this._ctx.fillStyle = 'red';\r\n        this._ctx.strokeStyle = 'black';\r\n        this._ctx.fillRect(posX, posY, width, height);\r\n        this._ctx.beginPath();\r\n        this._ctx.arc(posX, posY, 100, 0, 2 * Math.PI);\r\n        this._ctx.stroke();\r\n\r\n        if (bug.hasPickedFood()) {\r\n            this._ctx.fillStyle = 'green';\r\n            this._ctx.fillRect(posX, posY - 10, width, height);\r\n        }\r\n    }\r\n\r\n    _renderTown(town) {\r\n        let width = 40;\r\n        let height = 40; \r\n        this._ctx.fillStyle = 'yellow';\r\n        this._ctx.strokeStyle = 'black';\r\n        let posX = town.position.x - width / 2;\r\n        let posY = town.position.y - height / 2;\r\n        this._ctx.fillRect(posX, posY, width, height)\r\n        this._ctx.beginPath();\r\n        this._ctx.arc(town.position.x, town.position.y, 300, 0, 2 * Math.PI);\r\n        this._ctx.stroke();\r\n    }\r\n\r\n    _renderFood(food) {\r\n        let width = 10;\r\n        let height = 10; \r\n        this._ctx.fillStyle = 'green';\r\n        let posX = food.position.x - width / 2;\r\n        let posY = food.position.y - height / 2;\r\n        this._ctx.fillRect(posX, posY, width, height)\r\n        this._ctx.beginPath();\r\n    }\r\n\r\n}\r\n\r\n\n\n//# sourceURL=webpack://bugs/./bugs/core/client/src/view/worldView.js?");

/***/ }),

/***/ "./node_modules/events/events.js":
/*!***************************************!*\
  !*** ./node_modules/events/events.js ***!
  \***************************************/
/***/ ((module) => {

eval("// Copyright Joyent, Inc. and other Node contributors.\n//\n// Permission is hereby granted, free of charge, to any person obtaining a\n// copy of this software and associated documentation files (the\n// \"Software\"), to deal in the Software without restriction, including\n// without limitation the rights to use, copy, modify, merge, publish,\n// distribute, sublicense, and/or sell copies of the Software, and to permit\n// persons to whom the Software is furnished to do so, subject to the\n// following conditions:\n//\n// The above copyright notice and this permission notice shall be included\n// in all copies or substantial portions of the Software.\n//\n// THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS\n// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF\n// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN\n// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,\n// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR\n// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE\n// USE OR OTHER DEALINGS IN THE SOFTWARE.\n\n\n\nvar R = typeof Reflect === 'object' ? Reflect : null\nvar ReflectApply = R && typeof R.apply === 'function'\n  ? R.apply\n  : function ReflectApply(target, receiver, args) {\n    return Function.prototype.apply.call(target, receiver, args);\n  }\n\nvar ReflectOwnKeys\nif (R && typeof R.ownKeys === 'function') {\n  ReflectOwnKeys = R.ownKeys\n} else if (Object.getOwnPropertySymbols) {\n  ReflectOwnKeys = function ReflectOwnKeys(target) {\n    return Object.getOwnPropertyNames(target)\n      .concat(Object.getOwnPropertySymbols(target));\n  };\n} else {\n  ReflectOwnKeys = function ReflectOwnKeys(target) {\n    return Object.getOwnPropertyNames(target);\n  };\n}\n\nfunction ProcessEmitWarning(warning) {\n  if (console && console.warn) console.warn(warning);\n}\n\nvar NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {\n  return value !== value;\n}\n\nfunction EventEmitter() {\n  EventEmitter.init.call(this);\n}\nmodule.exports = EventEmitter;\nmodule.exports.once = once;\n\n// Backwards-compat with node 0.10.x\nEventEmitter.EventEmitter = EventEmitter;\n\nEventEmitter.prototype._events = undefined;\nEventEmitter.prototype._eventsCount = 0;\nEventEmitter.prototype._maxListeners = undefined;\n\n// By default EventEmitters will print a warning if more than 10 listeners are\n// added to it. This is a useful default which helps finding memory leaks.\nvar defaultMaxListeners = 10;\n\nfunction checkListener(listener) {\n  if (typeof listener !== 'function') {\n    throw new TypeError('The \"listener\" argument must be of type Function. Received type ' + typeof listener);\n  }\n}\n\nObject.defineProperty(EventEmitter, 'defaultMaxListeners', {\n  enumerable: true,\n  get: function() {\n    return defaultMaxListeners;\n  },\n  set: function(arg) {\n    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {\n      throw new RangeError('The value of \"defaultMaxListeners\" is out of range. It must be a non-negative number. Received ' + arg + '.');\n    }\n    defaultMaxListeners = arg;\n  }\n});\n\nEventEmitter.init = function() {\n\n  if (this._events === undefined ||\n      this._events === Object.getPrototypeOf(this)._events) {\n    this._events = Object.create(null);\n    this._eventsCount = 0;\n  }\n\n  this._maxListeners = this._maxListeners || undefined;\n};\n\n// Obviously not all Emitters should be limited to 10. This function allows\n// that to be increased. Set to zero for unlimited.\nEventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {\n  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {\n    throw new RangeError('The value of \"n\" is out of range. It must be a non-negative number. Received ' + n + '.');\n  }\n  this._maxListeners = n;\n  return this;\n};\n\nfunction _getMaxListeners(that) {\n  if (that._maxListeners === undefined)\n    return EventEmitter.defaultMaxListeners;\n  return that._maxListeners;\n}\n\nEventEmitter.prototype.getMaxListeners = function getMaxListeners() {\n  return _getMaxListeners(this);\n};\n\nEventEmitter.prototype.emit = function emit(type) {\n  var args = [];\n  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);\n  var doError = (type === 'error');\n\n  var events = this._events;\n  if (events !== undefined)\n    doError = (doError && events.error === undefined);\n  else if (!doError)\n    return false;\n\n  // If there is no 'error' event listener then throw.\n  if (doError) {\n    var er;\n    if (args.length > 0)\n      er = args[0];\n    if (er instanceof Error) {\n      // Note: The comments on the `throw` lines are intentional, they show\n      // up in Node's output if this results in an unhandled exception.\n      throw er; // Unhandled 'error' event\n    }\n    // At least give some kind of context to the user\n    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));\n    err.context = er;\n    throw err; // Unhandled 'error' event\n  }\n\n  var handler = events[type];\n\n  if (handler === undefined)\n    return false;\n\n  if (typeof handler === 'function') {\n    ReflectApply(handler, this, args);\n  } else {\n    var len = handler.length;\n    var listeners = arrayClone(handler, len);\n    for (var i = 0; i < len; ++i)\n      ReflectApply(listeners[i], this, args);\n  }\n\n  return true;\n};\n\nfunction _addListener(target, type, listener, prepend) {\n  var m;\n  var events;\n  var existing;\n\n  checkListener(listener);\n\n  events = target._events;\n  if (events === undefined) {\n    events = target._events = Object.create(null);\n    target._eventsCount = 0;\n  } else {\n    // To avoid recursion in the case that type === \"newListener\"! Before\n    // adding it to the listeners, first emit \"newListener\".\n    if (events.newListener !== undefined) {\n      target.emit('newListener', type,\n                  listener.listener ? listener.listener : listener);\n\n      // Re-assign `events` because a newListener handler could have caused the\n      // this._events to be assigned to a new object\n      events = target._events;\n    }\n    existing = events[type];\n  }\n\n  if (existing === undefined) {\n    // Optimize the case of one listener. Don't need the extra array object.\n    existing = events[type] = listener;\n    ++target._eventsCount;\n  } else {\n    if (typeof existing === 'function') {\n      // Adding the second element, need to change to array.\n      existing = events[type] =\n        prepend ? [listener, existing] : [existing, listener];\n      // If we've already got an array, just append.\n    } else if (prepend) {\n      existing.unshift(listener);\n    } else {\n      existing.push(listener);\n    }\n\n    // Check for listener leak\n    m = _getMaxListeners(target);\n    if (m > 0 && existing.length > m && !existing.warned) {\n      existing.warned = true;\n      // No error code for this since it is a Warning\n      // eslint-disable-next-line no-restricted-syntax\n      var w = new Error('Possible EventEmitter memory leak detected. ' +\n                          existing.length + ' ' + String(type) + ' listeners ' +\n                          'added. Use emitter.setMaxListeners() to ' +\n                          'increase limit');\n      w.name = 'MaxListenersExceededWarning';\n      w.emitter = target;\n      w.type = type;\n      w.count = existing.length;\n      ProcessEmitWarning(w);\n    }\n  }\n\n  return target;\n}\n\nEventEmitter.prototype.addListener = function addListener(type, listener) {\n  return _addListener(this, type, listener, false);\n};\n\nEventEmitter.prototype.on = EventEmitter.prototype.addListener;\n\nEventEmitter.prototype.prependListener =\n    function prependListener(type, listener) {\n      return _addListener(this, type, listener, true);\n    };\n\nfunction onceWrapper() {\n  if (!this.fired) {\n    this.target.removeListener(this.type, this.wrapFn);\n    this.fired = true;\n    if (arguments.length === 0)\n      return this.listener.call(this.target);\n    return this.listener.apply(this.target, arguments);\n  }\n}\n\nfunction _onceWrap(target, type, listener) {\n  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };\n  var wrapped = onceWrapper.bind(state);\n  wrapped.listener = listener;\n  state.wrapFn = wrapped;\n  return wrapped;\n}\n\nEventEmitter.prototype.once = function once(type, listener) {\n  checkListener(listener);\n  this.on(type, _onceWrap(this, type, listener));\n  return this;\n};\n\nEventEmitter.prototype.prependOnceListener =\n    function prependOnceListener(type, listener) {\n      checkListener(listener);\n      this.prependListener(type, _onceWrap(this, type, listener));\n      return this;\n    };\n\n// Emits a 'removeListener' event if and only if the listener was removed.\nEventEmitter.prototype.removeListener =\n    function removeListener(type, listener) {\n      var list, events, position, i, originalListener;\n\n      checkListener(listener);\n\n      events = this._events;\n      if (events === undefined)\n        return this;\n\n      list = events[type];\n      if (list === undefined)\n        return this;\n\n      if (list === listener || list.listener === listener) {\n        if (--this._eventsCount === 0)\n          this._events = Object.create(null);\n        else {\n          delete events[type];\n          if (events.removeListener)\n            this.emit('removeListener', type, list.listener || listener);\n        }\n      } else if (typeof list !== 'function') {\n        position = -1;\n\n        for (i = list.length - 1; i >= 0; i--) {\n          if (list[i] === listener || list[i].listener === listener) {\n            originalListener = list[i].listener;\n            position = i;\n            break;\n          }\n        }\n\n        if (position < 0)\n          return this;\n\n        if (position === 0)\n          list.shift();\n        else {\n          spliceOne(list, position);\n        }\n\n        if (list.length === 1)\n          events[type] = list[0];\n\n        if (events.removeListener !== undefined)\n          this.emit('removeListener', type, originalListener || listener);\n      }\n\n      return this;\n    };\n\nEventEmitter.prototype.off = EventEmitter.prototype.removeListener;\n\nEventEmitter.prototype.removeAllListeners =\n    function removeAllListeners(type) {\n      var listeners, events, i;\n\n      events = this._events;\n      if (events === undefined)\n        return this;\n\n      // not listening for removeListener, no need to emit\n      if (events.removeListener === undefined) {\n        if (arguments.length === 0) {\n          this._events = Object.create(null);\n          this._eventsCount = 0;\n        } else if (events[type] !== undefined) {\n          if (--this._eventsCount === 0)\n            this._events = Object.create(null);\n          else\n            delete events[type];\n        }\n        return this;\n      }\n\n      // emit removeListener for all listeners on all events\n      if (arguments.length === 0) {\n        var keys = Object.keys(events);\n        var key;\n        for (i = 0; i < keys.length; ++i) {\n          key = keys[i];\n          if (key === 'removeListener') continue;\n          this.removeAllListeners(key);\n        }\n        this.removeAllListeners('removeListener');\n        this._events = Object.create(null);\n        this._eventsCount = 0;\n        return this;\n      }\n\n      listeners = events[type];\n\n      if (typeof listeners === 'function') {\n        this.removeListener(type, listeners);\n      } else if (listeners !== undefined) {\n        // LIFO order\n        for (i = listeners.length - 1; i >= 0; i--) {\n          this.removeListener(type, listeners[i]);\n        }\n      }\n\n      return this;\n    };\n\nfunction _listeners(target, type, unwrap) {\n  var events = target._events;\n\n  if (events === undefined)\n    return [];\n\n  var evlistener = events[type];\n  if (evlistener === undefined)\n    return [];\n\n  if (typeof evlistener === 'function')\n    return unwrap ? [evlistener.listener || evlistener] : [evlistener];\n\n  return unwrap ?\n    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);\n}\n\nEventEmitter.prototype.listeners = function listeners(type) {\n  return _listeners(this, type, true);\n};\n\nEventEmitter.prototype.rawListeners = function rawListeners(type) {\n  return _listeners(this, type, false);\n};\n\nEventEmitter.listenerCount = function(emitter, type) {\n  if (typeof emitter.listenerCount === 'function') {\n    return emitter.listenerCount(type);\n  } else {\n    return listenerCount.call(emitter, type);\n  }\n};\n\nEventEmitter.prototype.listenerCount = listenerCount;\nfunction listenerCount(type) {\n  var events = this._events;\n\n  if (events !== undefined) {\n    var evlistener = events[type];\n\n    if (typeof evlistener === 'function') {\n      return 1;\n    } else if (evlistener !== undefined) {\n      return evlistener.length;\n    }\n  }\n\n  return 0;\n}\n\nEventEmitter.prototype.eventNames = function eventNames() {\n  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];\n};\n\nfunction arrayClone(arr, n) {\n  var copy = new Array(n);\n  for (var i = 0; i < n; ++i)\n    copy[i] = arr[i];\n  return copy;\n}\n\nfunction spliceOne(list, index) {\n  for (; index + 1 < list.length; index++)\n    list[index] = list[index + 1];\n  list.pop();\n}\n\nfunction unwrapListeners(arr) {\n  var ret = new Array(arr.length);\n  for (var i = 0; i < ret.length; ++i) {\n    ret[i] = arr[i].listener || arr[i];\n  }\n  return ret;\n}\n\nfunction once(emitter, name) {\n  return new Promise(function (resolve, reject) {\n    function errorListener(err) {\n      emitter.removeListener(name, resolver);\n      reject(err);\n    }\n\n    function resolver() {\n      if (typeof emitter.removeListener === 'function') {\n        emitter.removeListener('error', errorListener);\n      }\n      resolve([].slice.call(arguments));\n    };\n\n    eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });\n    if (name !== 'error') {\n      addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });\n    }\n  });\n}\n\nfunction addErrorHandlerIfEventEmitter(emitter, handler, flags) {\n  if (typeof emitter.on === 'function') {\n    eventTargetAgnosticAddListener(emitter, 'error', handler, flags);\n  }\n}\n\nfunction eventTargetAgnosticAddListener(emitter, name, listener, flags) {\n  if (typeof emitter.on === 'function') {\n    if (flags.once) {\n      emitter.once(name, listener);\n    } else {\n      emitter.on(name, listener);\n    }\n  } else if (typeof emitter.addEventListener === 'function') {\n    // EventTarget does not have `error` event semantics like Node\n    // EventEmitters, we do not listen for `error` events here.\n    emitter.addEventListener(name, function wrapListener(arg) {\n      // IE does not have builtin `{ once: true }` support so we\n      // have to do it manually.\n      if (flags.once) {\n        emitter.removeEventListener(name, wrapListener);\n      }\n      listener(arg);\n    });\n  } else {\n    throw new TypeError('The \"emitter\" argument must be of type EventEmitter. Received type ' + typeof emitter);\n  }\n}\n\n\n//# sourceURL=webpack://bugs/./node_modules/events/events.js?");

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
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
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
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./bugs/core/client/src/index.js");
/******/ 	
/******/ })()
;