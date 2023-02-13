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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"DomainFacade\": () => (/* binding */ DomainFacade)\n/* harmony export */ });\n/* harmony import */ var _worldFactory__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./worldFactory */ \"./bugs/core/client/src/domain/worldFactory.js\");\n/* harmony import */ var _entity_action_actionFactory__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./entity/action/actionFactory */ \"./bugs/core/client/src/domain/entity/action/actionFactory.js\");\n\r\n\r\n\r\nclass DomainFacade {\r\n\r\n    constructor() {\r\n        this._world = null;\r\n        this._worldFactory = null;\r\n        this._actionFactory = null;\r\n    }\r\n\r\n    initWorld(worldJson) {\r\n        this._worldFactory = new _worldFactory__WEBPACK_IMPORTED_MODULE_0__.WorldFactory();\r\n        this._world = this._worldFactory.buildWorldFromJson(worldJson);\r\n        this._actionFactory = new _entity_action_actionFactory__WEBPACK_IMPORTED_MODULE_1__.ActionFactory(this._world);\r\n    }\r\n\r\n    updateEntity(entityJson) {\r\n        this._world.updateEntity(entityJson);\r\n    }\r\n\r\n    deleteEntity(entityId) {\r\n        this._world.deleteEntity(entityId);\r\n    }\r\n\r\n    addNewEntity(entityJson) {\r\n        let entity = this._worldFactory.buildEntity(entityJson);\r\n        this._world.addEntity(entity);\r\n    }\r\n\r\n    playAction(actionJson) {\r\n        let action = this._actionFactory.buildAction(actionJson);\r\n        this._world.playAction(action);\r\n    }\r\n\r\n    getEntities() {\r\n        return this._world.entities;\r\n    }\r\n\r\n}\r\n\n\n//# sourceURL=webpack://bugs/./bugs/core/client/src/domain/domainFacade.js?");

/***/ }),

/***/ "./bugs/core/client/src/domain/entity/action/actionFactory.js":
/*!********************************************************************!*\
  !*** ./bugs/core/client/src/domain/entity/action/actionFactory.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"ActionFactory\": () => (/* binding */ ActionFactory)\n/* harmony export */ });\n/* harmony import */ var _actionTypes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./actionTypes */ \"./bugs/core/client/src/domain/entity/action/actionTypes.js\");\n\r\n\r\nclass ActionFactory {\r\n\r\n    constructor(world) {\r\n        this._world = world;\r\n    }\r\n\r\n    buildAction(actionJson) {\r\n        switch (actionJson.action_type) {\r\n            case _actionTypes__WEBPACK_IMPORTED_MODULE_0__.ACTION_TYPES.WALK:\r\n                return actionJson;\r\n            case _actionTypes__WEBPACK_IMPORTED_MODULE_0__.ACTION_TYPES.FOOD_PICKED:\r\n                return this._buildFoodPickedAction(actionJson);\r\n            case _actionTypes__WEBPACK_IMPORTED_MODULE_0__.ACTION_TYPES.FOOD_GAVE:\r\n                return actionJson;\r\n        }\r\n    }\r\n\r\n    _buildFoodPickedAction(actionJson) {\r\n        let food = this._world.findEntityById(actionJson.action_data.food_id);\r\n        let action = Object.assign({}, actionJson, {\r\n            action_data: { food }\r\n        });\r\n\r\n        return action;\r\n    }\r\n}\r\n\r\n\n\n//# sourceURL=webpack://bugs/./bugs/core/client/src/domain/entity/action/actionFactory.js?");

/***/ }),

/***/ "./bugs/core/client/src/domain/entity/action/actionTypes.js":
/*!******************************************************************!*\
  !*** ./bugs/core/client/src/domain/entity/action/actionTypes.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"ACTION_TYPES\": () => (/* binding */ ACTION_TYPES)\n/* harmony export */ });\nconst ACTION_TYPES = {\r\n    WALK: 'walk',\r\n    FOOD_PICKED: 'food_picked',\r\n    FOOD_GAVE: 'picked_food_gave'\r\n\r\n};\r\n\r\n\n\n//# sourceURL=webpack://bugs/./bugs/core/client/src/domain/entity/action/actionTypes.js?");

/***/ }),

/***/ "./bugs/core/client/src/domain/entity/bug.js":
/*!***************************************************!*\
  !*** ./bugs/core/client/src/domain/entity/bug.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Bug\": () => (/* binding */ Bug)\n/* harmony export */ });\n/* harmony import */ var _entity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./entity */ \"./bugs/core/client/src/domain/entity/entity.js\");\n/* harmony import */ var _entityTypes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./entityTypes */ \"./bugs/core/client/src/domain/entity/entityTypes.js\");\n/* harmony import */ var _action_actionTypes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./action/actionTypes */ \"./bugs/core/client/src/domain/entity/action/actionTypes.js\");\n\r\n\r\n\r\n\r\nclass Bug extends _entity__WEBPACK_IMPORTED_MODULE_0__.Entity {\r\n\r\n    constructor(id, position) {\r\n        super(id, position, _entityTypes__WEBPACK_IMPORTED_MODULE_1__.EntityTypes.BUG);\r\n        this.pickedFood = null;\r\n    }\r\n\r\n    updateEntity(entityJson) {\r\n    }\r\n\r\n    getColor() {\r\n        // return this._homeTown.getColor()\r\n    }\r\n\r\n    playAction(action) {\r\n        switch (action.action_type) {\r\n            case _action_actionTypes__WEBPACK_IMPORTED_MODULE_2__.ACTION_TYPES.WALK:\r\n                return this._playWalkAction(action);\r\n            case _action_actionTypes__WEBPACK_IMPORTED_MODULE_2__.ACTION_TYPES.FOOD_PICKED:\r\n                return this._playFoodPickingAction(action);\r\n            case _action_actionTypes__WEBPACK_IMPORTED_MODULE_2__.ACTION_TYPES.FOOD_GAVE:\r\n                return this._playFoodGiving(action);\r\n            default:\r\n                throw 'unknown type of action'\r\n        }\r\n    }\r\n\r\n    hasPickedFood() {\r\n        return !!this.pickedFood;\r\n    }\r\n\r\n    _playWalkAction(action) {\r\n        let wholeWalkTime = action.time * 1000;\r\n        let walkStartAt = Date.now();\r\n        let destPosition = action.action_data.position;\r\n        let startPosition = this.position;\r\n        return new Promise((res, rej) => {\r\n            let walkInterval = setInterval(() => {\r\n                let timeInWalk = Date.now() - walkStartAt;\r\n                let walkedPercent = ( 100 * timeInWalk ) / wholeWalkTime;\r\n                if (walkedPercent < 100) {\r\n                    let currentX = this._calcCoordForWalkedPercent(startPosition.x, destPosition.x, walkedPercent);\r\n                    let currentY = this._calcCoordForWalkedPercent(startPosition.y, destPosition.y, walkedPercent);\r\n                    this.setPosition(currentX, currentY);\r\n                } else {\r\n                    this.setPosition(destPosition.x, destPosition.y);\r\n                    clearInterval(walkInterval);\r\n                    res();\r\n                }\r\n            }, 100)\r\n        });\r\n    }\r\n\r\n    _playFoodPickingAction(action) {\r\n        return new Promise((res) => {\r\n            setTimeout(() => {\r\n                this.pickedFood = action.action_data.food;\r\n                this.pickedFood.toggleHidden(true);\r\n                res();\r\n            }, action.time * 1000)\r\n        });\r\n    }\r\n\r\n    _playFoodGiving(action) {\r\n        return new Promise((res) => {\r\n            setTimeout(() => {\r\n                this.pickedFood = null;\r\n                res();\r\n            }, action.time * 1000)\r\n        });\r\n    }\r\n\r\n    _calcCoordForWalkedPercent(startCoord, endCoord, flayedPercent) {\r\n        let distance = Math.abs(Math.abs(endCoord) - Math.abs(startCoord));\r\n        let distancePassed = distance * (flayedPercent  / 100);\r\n        return endCoord > startCoord ? startCoord + distancePassed : startCoord - distancePassed;\r\n    }\r\n\r\n}\r\n\r\n\n\n//# sourceURL=webpack://bugs/./bugs/core/client/src/domain/entity/bug.js?");

/***/ }),

/***/ "./bugs/core/client/src/domain/entity/entity.js":
/*!******************************************************!*\
  !*** ./bugs/core/client/src/domain/entity/entity.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Entity\": () => (/* binding */ Entity)\n/* harmony export */ });\nclass Entity {\r\n\r\n    constructor(id, position, type) {\r\n        this.id = id;\r\n        this._position = position;\r\n        this.type = type;\r\n        this._actionStack = [];\r\n        this._isPlaying = false;\r\n        this._isHidden = false;\r\n    }\r\n\r\n    setPosition(x, y) {\r\n        this._position = {x, y};\r\n    }\r\n\r\n    get position(){\r\n        return this._position;\r\n    }\r\n\r\n    updateEntity(entityJson) {\r\n    }\r\n\r\n    addAction(action) {\r\n        this._actionStack.push(action);\r\n        this.tryPlayNextAction();\r\n    }\r\n\r\n    playAction(action) {}\r\n\r\n    tryPlayNextAction() {\r\n        if (this._actionStack.length == 0 || this._isPlaying) {\r\n            return\r\n        }\r\n        let nextAction = this._actionStack[0];\r\n        this._actionStack.shift();\r\n\r\n        this._isPlaying = true;\r\n        this.playAction(nextAction)\r\n            .then(() => {\r\n                this._isPlaying = false;\r\n                this.tryPlayNextAction();\r\n            });\r\n    }\r\n\r\n    isHidden() {\r\n        return this._isHidden;\r\n    }\r\n\r\n    toggleHidden(isHidden) {\r\n        this._isHidden = isHidden;\r\n    }\r\n\r\n}\r\n\r\n\n\n//# sourceURL=webpack://bugs/./bugs/core/client/src/domain/entity/entity.js?");

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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Food\": () => (/* binding */ Food)\n/* harmony export */ });\n/* harmony import */ var _entity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./entity */ \"./bugs/core/client/src/domain/entity/entity.js\");\n/* harmony import */ var _entityTypes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./entityTypes */ \"./bugs/core/client/src/domain/entity/entityTypes.js\");\n\r\n\r\n\r\nclass Food extends _entity__WEBPACK_IMPORTED_MODULE_0__.Entity {\r\n    constructor(id, position, calories) {\r\n        super(id, position, _entityTypes__WEBPACK_IMPORTED_MODULE_1__.EntityTypes.FOOD);\r\n        this.calories = calories;\r\n    }\r\n\r\n    updateEntity(entityJson) {\r\n    }\r\n}\r\n\r\n\n\n//# sourceURL=webpack://bugs/./bugs/core/client/src/domain/entity/food.js?");

/***/ }),

/***/ "./bugs/core/client/src/domain/entity/foodArea.js":
/*!********************************************************!*\
  !*** ./bugs/core/client/src/domain/entity/foodArea.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"FoodArea\": () => (/* binding */ FoodArea)\n/* harmony export */ });\n/* harmony import */ var _entity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./entity */ \"./bugs/core/client/src/domain/entity/entity.js\");\n/* harmony import */ var _entityTypes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./entityTypes */ \"./bugs/core/client/src/domain/entity/entityTypes.js\");\n\r\n\r\n\r\nclass FoodArea extends _entity__WEBPACK_IMPORTED_MODULE_0__.Entity {\r\n    constructor(id, position, calories) {\r\n        super(id, position, _entityTypes__WEBPACK_IMPORTED_MODULE_1__.EntityTypes.FOOD_AREA);\r\n    }\r\n\r\n    updateEntity(entityJson) {\r\n    }\r\n}\r\n\r\n\n\n//# sourceURL=webpack://bugs/./bugs/core/client/src/domain/entity/foodArea.js?");

/***/ }),

/***/ "./bugs/core/client/src/domain/entity/town.js":
/*!****************************************************!*\
  !*** ./bugs/core/client/src/domain/entity/town.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Town\": () => (/* binding */ Town)\n/* harmony export */ });\n/* harmony import */ var _entity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./entity */ \"./bugs/core/client/src/domain/entity/entity.js\");\n/* harmony import */ var _entityTypes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./entityTypes */ \"./bugs/core/client/src/domain/entity/entityTypes.js\");\n\r\n\r\n\r\nclass Town extends _entity__WEBPACK_IMPORTED_MODULE_0__.Entity {\r\n\r\n    constructor(id, position, color) {\r\n        super(id, position, _entityTypes__WEBPACK_IMPORTED_MODULE_1__.EntityTypes.TOWN);\r\n        this._color = color\r\n    }\r\n\r\n    get color() {\r\n        return this._color\r\n    }\r\n\r\n}\r\n\r\n\r\n\n\n//# sourceURL=webpack://bugs/./bugs/core/client/src/domain/entity/town.js?");

/***/ }),

/***/ "./bugs/core/client/src/domain/entity/world.js":
/*!*****************************************************!*\
  !*** ./bugs/core/client/src/domain/entity/world.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"World\": () => (/* binding */ World)\n/* harmony export */ });\nclass World {\r\n    constructor(entities) {\r\n        this._entities = entities\r\n    }\r\n\r\n    get entities() {\r\n        return [...this._entities];\r\n    }\r\n\r\n    addEntity(entity) {\r\n        this._entities.push(entity);\r\n    }\r\n\r\n    updateEntity(entityJson) {\r\n        let entity = this.findEntityById(entityJson.id);\r\n        entity.updateEntity(entityJson);\r\n    }\r\n\r\n    playAction(action) {\r\n        let entity = this.findEntityById(action.entity_id);\r\n        entity.addAction(action);\r\n    }\r\n\r\n    deleteEntity(entityId) {\r\n        let entityIndex = -1;\r\n        for (let i = 0; i < this._entities.length; i++)  {\r\n            if (this._entities[i].id == entityId) {\r\n                entityIndex = i;\r\n                break;\r\n            }\r\n        }\r\n\r\n        if (entityIndex != -1) {\r\n            this._entities.splice(entityIndex, 1);\r\n        }\r\n    }\r\n\r\n    findEntityById(id) {\r\n        return this._entities.find( entity => entity.id === id);\r\n    }\r\n\r\n}\r\n\r\n\n\n//# sourceURL=webpack://bugs/./bugs/core/client/src/domain/entity/world.js?");

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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"WorldFactory\": () => (/* binding */ WorldFactory)\n/* harmony export */ });\n/* harmony import */ var _entity_entityTypes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./entity/entityTypes */ \"./bugs/core/client/src/domain/entity/entityTypes.js\");\n/* harmony import */ var _entity_bug__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./entity/bug */ \"./bugs/core/client/src/domain/entity/bug.js\");\n/* harmony import */ var _entity_world__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./entity/world */ \"./bugs/core/client/src/domain/entity/world.js\");\n/* harmony import */ var _entity_town__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./entity/town */ \"./bugs/core/client/src/domain/entity/town.js\");\n/* harmony import */ var _entity_food__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./entity/food */ \"./bugs/core/client/src/domain/entity/food.js\");\n/* harmony import */ var _entity_foodArea__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./entity/foodArea */ \"./bugs/core/client/src/domain/entity/foodArea.js\");\n\r\n\r\n\r\n\r\n\r\n\r\n\r\nclass WorldFactory {\r\n\r\n    buildWorldFromJson(worldJson) {\r\n        let entities = [];\r\n        worldJson.entities.forEach(entityJson => {\r\n            let entity = this.buildEntity(entityJson);\r\n            entities.push(entity);\r\n        });\r\n\r\n        let world = this.buildWorld(entities);\r\n\r\n        return world;\r\n    }\r\n\r\n    buildWorld(entities) {\r\n        return new _entity_world__WEBPACK_IMPORTED_MODULE_2__.World(entities);\r\n    }\r\n\r\n    buildBug(id, position) {\r\n        return new _entity_bug__WEBPACK_IMPORTED_MODULE_1__.Bug(id, position);\r\n    }\r\n\r\n    buildTown(id, position, color) {\r\n        return new _entity_town__WEBPACK_IMPORTED_MODULE_3__.Town(id, position, color);\r\n    }\r\n\r\n    buildFood(id, position, calories) {\r\n        return new _entity_food__WEBPACK_IMPORTED_MODULE_4__.Food(id, position, calories);\r\n    }\r\n\r\n    buildFoodArea(id, position) {\r\n        return new _entity_foodArea__WEBPACK_IMPORTED_MODULE_5__.FoodArea(id, position);\r\n    }\r\n\r\n    buildEntity(entityJson) {\r\n        switch(entityJson.type) {\r\n            case _entity_entityTypes__WEBPACK_IMPORTED_MODULE_0__.EntityTypes.BUG:\r\n                return this.buildBug(entityJson.id, entityJson.position);\r\n            case _entity_entityTypes__WEBPACK_IMPORTED_MODULE_0__.EntityTypes.TOWN:\r\n                return this.buildTown(entityJson.id, entityJson.position, entityJson.color);\r\n            case _entity_entityTypes__WEBPACK_IMPORTED_MODULE_0__.EntityTypes.FOOD:\r\n                return this.buildFood(entityJson.id, entityJson.position, entityJson.calories);\r\n            case _entity_entityTypes__WEBPACK_IMPORTED_MODULE_0__.EntityTypes.FOOD_AREA:\r\n                return this.buildFoodArea(entityJson.id, entityJson.position);\r\n            default:\r\n                throw 'unknown type of entity';\r\n        }\r\n    }\r\n}\r\n\r\n\n\n//# sourceURL=webpack://bugs/./bugs/core/client/src/domain/worldFactory.js?");

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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"MainSocketConsumer\": () => (/* binding */ MainSocketConsumer)\n/* harmony export */ });\nclass MainSocketConsumer {\r\n    constructor(socket, domainFacade) {\r\n        this._socket = socket;\r\n        this._domainFacade = domainFacade;\r\n\r\n        this._socket.onopen = this._onOpen.bind(this);\r\n        this._socket.onmessage = this._onMsg.bind(this);\r\n    }\r\n\r\n    _onOpen() {\r\n        console.log('connected');\r\n    }\r\n\r\n    _onMsg(event) {\r\n        let msg = JSON.parse(event.data);\r\n        switch(msg.type) {\r\n            case 'whole_world':\r\n                this._domainFacade.initWorld(msg.world);\r\n                break;\r\n            case 'entity_changed':\r\n                this._domainFacade.updateEntity(msg.entity);\r\n                break;\r\n            case 'entity_died':\r\n                this._domainFacade.deleteEntity(msg.entity_id);\r\n                break;\r\n            case 'entity_born':\r\n                this._domainFacade.addNewEntity(msg.entity);\r\n                break;\r\n            case 'entity_action':\r\n                this._domainFacade.playAction(msg.action);\r\n                break;\r\n            default: \r\n                throw `unknown type of message \"${ msg.type }\"`\r\n        }\r\n    }\r\n}\r\n\r\n\n\n//# sourceURL=webpack://bugs/./bugs/core/client/src/sync/mainSocketConsumer.js?");

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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"WorldView\": () => (/* binding */ WorldView)\n/* harmony export */ });\n/* harmony import */ var _domain_entity_entityTypes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../domain/entity/entityTypes */ \"./bugs/core/client/src/domain/entity/entityTypes.js\");\n\r\n\r\nclass WorldView {\r\n    constructor(canvas, domainFacade) {\r\n        this._domainFacade = domainFacade;\r\n        this._canvas = canvas;\r\n        this._ctx = this._canvas.getContext('2d');\r\n\r\n        setInterval(this._renderWorld.bind(this), 100);\r\n    }\r\n\r\n    _renderWorld() {\r\n        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);\r\n\r\n        let entities = this._domainFacade.getEntities();\r\n        entities.forEach(entity => {\r\n            if (entity.isHidden()) {\r\n                return;\r\n            }\r\n            \r\n            switch (entity.type) {\r\n                case _domain_entity_entityTypes__WEBPACK_IMPORTED_MODULE_0__.EntityTypes.BUG:\r\n                    this._renderBug(entity);\r\n                    break;\r\n                case _domain_entity_entityTypes__WEBPACK_IMPORTED_MODULE_0__.EntityTypes.TOWN:\r\n                    this._renderTown(entity);\r\n                    break;\r\n                case _domain_entity_entityTypes__WEBPACK_IMPORTED_MODULE_0__.EntityTypes.FOOD:\r\n                    this._renderFood(entity);\r\n                    break;\r\n            }\r\n        });\r\n    }\r\n\r\n    _renderBug(bug) {\r\n        let width = 10;\r\n        let height = 10;\r\n        let posX = bug.position.x - width / 2;\r\n        let posY = bug.position.y - height / 2;\r\n        this._ctx.fillStyle = 'red';\r\n        this._ctx.strokeStyle = 'black';\r\n        this._ctx.fillRect(posX, posY, width, height);\r\n        this._ctx.beginPath();\r\n        this._ctx.arc(posX, posY, 200, 0, 2 * Math.PI);\r\n        this._ctx.stroke();\r\n\r\n        if (bug.hasPickedFood()) {\r\n            this._ctx.fillStyle = 'green';\r\n            this._ctx.fillRect(posX, posY - 10, width, height);\r\n        }\r\n    }\r\n\r\n    _renderTown(town) {\r\n        let width = 40;\r\n        let height = 40; \r\n        this._ctx.fillStyle = 'yellow';\r\n        this._ctx.strokeStyle = 'black';\r\n        let posX = town.position.x - width / 2;\r\n        let posY = town.position.y - height / 2;\r\n        this._ctx.fillRect(posX, posY, width, height)\r\n        this._ctx.beginPath();\r\n        this._ctx.arc(town.position.x, town.position.y, 300, 0, 2 * Math.PI);\r\n        this._ctx.stroke();\r\n    }\r\n\r\n    _renderFood(food) {\r\n        let width = 10;\r\n        let height = 10; \r\n        this._ctx.fillStyle = 'green';\r\n        let posX = food.position.x - width / 2;\r\n        let posY = food.position.y - height / 2;\r\n        this._ctx.fillRect(posX, posY, width, height)\r\n        this._ctx.beginPath();\r\n    }\r\n\r\n}\r\n\r\n\n\n//# sourceURL=webpack://bugs/./bugs/core/client/src/view/worldView.js?");

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
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./bugs/core/client/src/index.js");
/******/ 	
/******/ })()
;