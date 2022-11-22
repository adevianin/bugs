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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"DomainFacade\": () => (/* binding */ DomainFacade)\n/* harmony export */ });\nclass DomainFacade {\n\n    constructor(worldFactory) {\n        this._worldFactory = worldFactory;\n        this._world = null;\n    }\n\n    initWorld(worldJson) {\n        this._world = this._worldFactory.buildWorld(worldJson);\n    }\n\n    updateEntity(entityJson) {\n        this._world.updateEntity(entityJson);\n    }\n\n    get world() {\n        return this._world;\n    }\n\n}\n\n\n//# sourceURL=webpack://bugs/./bugs/core/client/src/domain/domainFacade.js?");

/***/ }),

/***/ "./bugs/core/client/src/domain/entity/bug.js":
/*!***************************************************!*\
  !*** ./bugs/core/client/src/domain/entity/bug.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Bug\": () => (/* binding */ Bug)\n/* harmony export */ });\n/* harmony import */ var _entity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./entity */ \"./bugs/core/client/src/domain/entity/entity.js\");\n\n\nclass Bug extends _entity__WEBPACK_IMPORTED_MODULE_0__.Entity {\n\n    constructor(mainEventBus, homeTown, id, pos, size) {\n        super(mainEventBus, id, pos, size);\n        this._flySpeed = 50;\n        this._homeTown = homeTown;\n    }\n\n    updateEntity(entityJson) {\n        this.flyTo(entityJson.pos.x, entityJson.pos.y);\n    }\n\n    flyTo(x, y) {\n        this._clearFlying()\n\n        let distance = Math.sqrt(Math.pow(x - this.position.x, 2)+ Math.pow(y - this.position.y, 2));\n        this._wholeFlyTime = distance / this._flySpeed;\n        this._flyStartAt = this._getNow();\n        this._flyingInterval = setInterval(() => {\n            let timeInFly = this._getNow() - this._flyStartAt;\n            let flayedPercent = ( 100 * timeInFly ) / this._wholeFlyTime;\n            if (flayedPercent < 100) {\n                let currentX = this._calcCoordForFlyedPercent(this.position.x, x, flayedPercent);\n                let currentY = this._calcCoordForFlyedPercent(this.position.y, y, flayedPercent);\n                this.setPosition(currentX, currentY);\n            } else {\n                this.setPosition(x, y);\n                this._clearFlying();\n            }\n        }, 100)\n    }\n\n    getColor() {\n        return this._homeTown.getColor()\n    }\n\n    _clearFlying() {\n        this._wholeFlyTime = null;\n        clearInterval(this._flyingInterval);\n    }\n\n    _calcCoordForFlyedPercent(startCoord, endCoord, flayedPercent) {\n        let distance = Math.abs(Math.abs(endCoord) - Math.abs(startCoord));\n        let distancePassed = distance * (flayedPercent  / 100);\n        return endCoord > startCoord ? startCoord + distancePassed : startCoord - distancePassed;\n    }\n\n    _getNow() {\n        return Date.now() / 1000;\n    }\n\n}\n\n\n\n//# sourceURL=webpack://bugs/./bugs/core/client/src/domain/entity/bug.js?");

/***/ }),

/***/ "./bugs/core/client/src/domain/entity/entity.js":
/*!******************************************************!*\
  !*** ./bugs/core/client/src/domain/entity/entity.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Entity\": () => (/* binding */ Entity)\n/* harmony export */ });\nclass Entity {\n\n    constructor(mainEventBus, id, pos, size) {\n        this.id = id;\n        this._pos = pos;\n        this._size = size;\n        this._mainEventBus = mainEventBus\n    }\n\n    setPosition(x, y) {\n        this._pos = { x, y }\n    }\n\n    get size() {\n        return {\n            width: this._size.width,\n            height: this._size.height,\n        };\n    }\n\n    get position() {\n        return {\n            x: this._pos.x,\n            y: this._pos.y,\n        };\n    }\n\n    updateEntity() {\n    }\n}\n\n\n\n//# sourceURL=webpack://bugs/./bugs/core/client/src/domain/entity/entity.js?");

/***/ }),

/***/ "./bugs/core/client/src/domain/entity/entityTypes.js":
/*!***********************************************************!*\
  !*** ./bugs/core/client/src/domain/entity/entityTypes.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"EntityTypes\": () => (/* binding */ EntityTypes)\n/* harmony export */ });\nconst EntityTypes = {\n    BUG: 1,\n    FOOD: 2,\n    TOWN: 3\n}\n\n\n\n//# sourceURL=webpack://bugs/./bugs/core/client/src/domain/entity/entityTypes.js?");

/***/ }),

/***/ "./bugs/core/client/src/domain/entity/food.js":
/*!****************************************************!*\
  !*** ./bugs/core/client/src/domain/entity/food.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Food\": () => (/* binding */ Food)\n/* harmony export */ });\n/* harmony import */ var _entity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./entity */ \"./bugs/core/client/src/domain/entity/entity.js\");\n\n\nclass Food extends _entity__WEBPACK_IMPORTED_MODULE_0__.Entity {\n    constructor(mainEventBus, id, pos, size, calories) {\n        super(mainEventBus, id, pos, size);\n        this._calories = calories;\n    }\n\n    updateEntity(entityJson) {\n        if (entityJson.eaten) {\n            this._mainEventBus.emit('eaten', this)\n        }\n    }\n}\n\n\n\n//# sourceURL=webpack://bugs/./bugs/core/client/src/domain/entity/food.js?");

/***/ }),

/***/ "./bugs/core/client/src/domain/entity/town.js":
/*!****************************************************!*\
  !*** ./bugs/core/client/src/domain/entity/town.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Town\": () => (/* binding */ Town)\n/* harmony export */ });\n/* harmony import */ var _entity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./entity */ \"./bugs/core/client/src/domain/entity/entity.js\");\n\n\nclass Town extends _entity__WEBPACK_IMPORTED_MODULE_0__.Entity {\n\n    constructor(mainEventBus, id, pos, size, color) {\n        super(mainEventBus, id, pos, size);\n        this._color = color\n    }\n\n    getColor() {\n        return this._color\n    }\n}\n\n\n\n\n//# sourceURL=webpack://bugs/./bugs/core/client/src/domain/entity/town.js?");

/***/ }),

/***/ "./bugs/core/client/src/domain/entity/world.js":
/*!*****************************************************!*\
  !*** ./bugs/core/client/src/domain/entity/world.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"World\": () => (/* binding */ World)\n/* harmony export */ });\n/* harmony import */ var _entityTypes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./entityTypes */ \"./bugs/core/client/src/domain/entity/entityTypes.js\");\n\n\nclass World {\n    constructor(mainEventBus, worldFactory, bugs, foods, towns) {\n        this._bugs = bugs;\n        this._foods = foods\n        this._towns = towns\n        this._worldFactory = worldFactory\n        this._mainEventBus = mainEventBus\n\n        this._mainEventBus.on('eaten', this._onFoodEaten.bind(this))\n    }\n\n    get bugs() {\n        return [...this._bugs];\n    }\n\n    get foods() {\n        return [...this._foods]\n    }\n\n    get towns() {\n        return [...this._towns]\n    }\n\n    updateEntity(entityJson) {\n        let entity = this._findEntityById(entityJson.id);\n        if (entity) {\n            entity.updateEntity(entityJson);\n        } else {\n            this._buildNewcameEntity(entityJson)\n        }\n    }\n\n    _findEntityById(id) {\n        let bug = this._bugs.find(b => { return b.id === id });\n        if (bug) { return bug }\n\n        return this._foods.find(f => { return f.id === id });\n    }\n\n    _buildNewcameEntity(entityJson) {\n        switch(entityJson.type) {\n            case _entityTypes__WEBPACK_IMPORTED_MODULE_0__.EntityTypes.BUG:\n                this._bugs.push(this._worldFactory.buildBug(entityJson));\n                break;\n            case _entityTypes__WEBPACK_IMPORTED_MODULE_0__.EntityTypes.FOOD:\n                this._foods.push(this._worldFactory.buildFood(entityJson))\n                break;\n            default:\n                throw `unknown type of entity \"${ entityJson.type }\"`\n        }\n    }\n\n    _onFoodEaten(food) {\n        for (let i = 0; i < this._foods.length; i++) {\n            if (this._foods[i].id == food.id) {\n                this._foods.splice(i, 1)\n            }\n        }\n    }\n}\n\n\n\n//# sourceURL=webpack://bugs/./bugs/core/client/src/domain/entity/world.js?");

/***/ }),

/***/ "./bugs/core/client/src/domain/index.js":
/*!**********************************************!*\
  !*** ./bugs/core/client/src/domain/index.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"initDomainLayer\": () => (/* binding */ initDomainLayer)\n/* harmony export */ });\n/* harmony import */ var _domainFacade__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./domainFacade */ \"./bugs/core/client/src/domain/domainFacade.js\");\n/* harmony import */ var _worldFactory__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./worldFactory */ \"./bugs/core/client/src/domain/worldFactory.js\");\n/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! events */ \"./node_modules/events/events.js\");\n/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(events__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\n\nfunction initDomainLayer() {\n    let main_event_bus = new (events__WEBPACK_IMPORTED_MODULE_2___default())();\n    let worldFactory = new _worldFactory__WEBPACK_IMPORTED_MODULE_1__.WorldFactory(main_event_bus);\n    let domainFacade = new _domainFacade__WEBPACK_IMPORTED_MODULE_0__.DomainFacade(worldFactory);\n\n    return domainFacade;\n}\n\n\n\n//# sourceURL=webpack://bugs/./bugs/core/client/src/domain/index.js?");

/***/ }),

/***/ "./bugs/core/client/src/domain/worldFactory.js":
/*!*****************************************************!*\
  !*** ./bugs/core/client/src/domain/worldFactory.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"WorldFactory\": () => (/* binding */ WorldFactory)\n/* harmony export */ });\n/* harmony import */ var _entity_bug__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./entity/bug */ \"./bugs/core/client/src/domain/entity/bug.js\");\n/* harmony import */ var _entity_world__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./entity/world */ \"./bugs/core/client/src/domain/entity/world.js\");\n/* harmony import */ var _entity_food__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./entity/food */ \"./bugs/core/client/src/domain/entity/food.js\");\n/* harmony import */ var _entity_town__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./entity/town */ \"./bugs/core/client/src/domain/entity/town.js\");\n/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! events */ \"./node_modules/events/events.js\");\n/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(events__WEBPACK_IMPORTED_MODULE_4__);\n\n\n\n\n\n\nclass WorldFactory {\n\n    constructor(mainEventBus) {\n        this._mainEventBus = mainEventBus\n    }\n\n    buildWorld(worldJson) {\n        let towns = []\n        worldJson.towns.forEach(townJson => {\n            let town = this.buildTown(townJson);\n            towns.push(town)\n        })\n\n        let initedBugs = [];\n        worldJson.bugs.forEach(bugJson => {\n            let town = towns.find(t => t.id == bugJson.from_town)\n            let bug = this.buildBug(bugJson, town);\n            initedBugs.push(bug);\n        });\n\n        let foods = []\n        worldJson.foods.forEach(foodJson => {\n            let food = this.buildFood(foodJson);\n            foods.push(food)\n        })\n\n        let world = new _entity_world__WEBPACK_IMPORTED_MODULE_1__.World(this._mainEventBus, this, initedBugs, foods, towns);\n\n        return world;\n    }\n\n    buildBug(bugJson, town) {\n        return new _entity_bug__WEBPACK_IMPORTED_MODULE_0__.Bug(this._mainEventBus, town, bugJson.id, bugJson.pos, bugJson.size);\n    }\n\n    buildFood(foodJson) {\n        return new _entity_food__WEBPACK_IMPORTED_MODULE_2__.Food(this._mainEventBus, foodJson.id, foodJson.pos, foodJson.size, foodJson.calories);\n    }\n\n    buildTown(townJson) {\n        return new _entity_town__WEBPACK_IMPORTED_MODULE_3__.Town(this._mainEventBus, townJson.id, townJson.pos, townJson.size, townJson.color);\n    }\n}\n\n\n\n//# sourceURL=webpack://bugs/./bugs/core/client/src/domain/worldFactory.js?");

/***/ }),

/***/ "./bugs/core/client/src/index.js":
/*!***************************************!*\
  !*** ./bugs/core/client/src/index.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _sync__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./sync */ \"./bugs/core/client/src/sync/index.js\");\n/* harmony import */ var _domain__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./domain */ \"./bugs/core/client/src/domain/index.js\");\n/* harmony import */ var _view__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./view */ \"./bugs/core/client/src/view/index.js\");\n\n\n\n\nlet domainFacade = (0,_domain__WEBPACK_IMPORTED_MODULE_1__.initDomainLayer)();\n(0,_sync__WEBPACK_IMPORTED_MODULE_0__.initSyncLayer)(domainFacade);\n(0,_view__WEBPACK_IMPORTED_MODULE_2__.initViewLayer)(domainFacade);\n\n\n//# sourceURL=webpack://bugs/./bugs/core/client/src/index.js?");

/***/ }),

/***/ "./bugs/core/client/src/sync/index.js":
/*!********************************************!*\
  !*** ./bugs/core/client/src/sync/index.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"initSyncLayer\": () => (/* binding */ initSyncLayer)\n/* harmony export */ });\n/* harmony import */ var _mainSocketConsumer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./mainSocketConsumer */ \"./bugs/core/client/src/sync/mainSocketConsumer.js\");\n\n\nfunction initSyncLayer(domainFacade) {\n    let socket = new WebSocket(`ws://${location.host}/mainsocket`);\n    let socketConsumer = new _mainSocketConsumer__WEBPACK_IMPORTED_MODULE_0__.MainSocketConsumer(socket, domainFacade);\n}\n\n\n\n//# sourceURL=webpack://bugs/./bugs/core/client/src/sync/index.js?");

/***/ }),

/***/ "./bugs/core/client/src/sync/mainSocketConsumer.js":
/*!*********************************************************!*\
  !*** ./bugs/core/client/src/sync/mainSocketConsumer.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"MainSocketConsumer\": () => (/* binding */ MainSocketConsumer)\n/* harmony export */ });\nclass MainSocketConsumer {\n    constructor(socket, domainFacade) {\n        this._socket = socket;\n        this._domainFacade = domainFacade;\n\n        this._socket.onopen = this._onOpen.bind(this);\n        this._socket.onmessage = this._onMsg.bind(this);\n    }\n\n    _onOpen() {\n        console.log('connected');\n    }\n\n    _onMsg(event) {\n        let msg = JSON.parse(event.data);\n        switch(msg.type) {\n            case 'whole_world':\n                this._domainFacade.initWorld(msg.world);\n                break;\n            case 'entity_changed':\n                this._domainFacade.updateEntity(msg.entity);\n                break;\n            default: \n                throw `unknown type of message \"${ msg.type }\"`\n        }\n    }\n}\n\n\n\n//# sourceURL=webpack://bugs/./bugs/core/client/src/sync/mainSocketConsumer.js?");

/***/ }),

/***/ "./bugs/core/client/src/view/index.js":
/*!********************************************!*\
  !*** ./bugs/core/client/src/view/index.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"initViewLayer\": () => (/* binding */ initViewLayer)\n/* harmony export */ });\n/* harmony import */ var _worldView__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./worldView */ \"./bugs/core/client/src/view/worldView.js\");\n\n\nfunction initViewLayer(domainFacade) {\n    let canvEl = document.getElementById('bugsCanvas');\n    let worldView = new _worldView__WEBPACK_IMPORTED_MODULE_0__.WorldView(canvEl, domainFacade);\n}\n\n\n\n//# sourceURL=webpack://bugs/./bugs/core/client/src/view/index.js?");

/***/ }),

/***/ "./bugs/core/client/src/view/worldView.js":
/*!************************************************!*\
  !*** ./bugs/core/client/src/view/worldView.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"WorldView\": () => (/* binding */ WorldView)\n/* harmony export */ });\nclass WorldView {\n    constructor(canvas, domainFacade) {\n        this._domainFacade = domainFacade;\n        this._canvas = canvas;\n        this._ctx = this._canvas.getContext('2d');\n\n        setInterval(this._renderWorld.bind(this), 100);\n    }\n\n    _renderWorld() {\n        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);\n\n        this._renderTowns();\n        this._renderFoods();\n        this._renderBugs();\n    }\n\n    _renderBugs() {\n        let bugs = this._domainFacade.world.bugs;\n        bugs.forEach(bug => {\n            let posX = bug.position.x - bug.size.width / 2;\n            let posY = bug.position.y - bug.size.height / 2;\n            this._ctx.fillStyle = bug.getColor()\n            this._ctx.fillRect(posX, posY, bug.size.width, bug.size.height)\n            this._ctx.beginPath();\n            this._ctx.arc(posX, posY, 150, 0, 2 * Math.PI);\n            this._ctx.stroke();\n        })\n    }\n\n    _renderFoods() {\n        let foods = this._domainFacade.world.foods\n        this._ctx.fillStyle = 'green';\n        foods.forEach(food => {\n            let posX = food.position.x - food.size.width / 2;\n            let posY = food.position.y - food.size.height / 2;\n            this._ctx.fillRect(posX, posY, food.size.width, food.size.height)\n        })\n    }\n\n    _renderTowns() {\n        let towns = this._domainFacade.world.towns;\n        towns.forEach(town => {\n            this._ctx.fillStyle = 'yellow';\n            let posX = town.position.x - town.size.width / 2;\n            let posY = town.position.y - town.size.height / 2;\n            this._ctx.fillRect(posX, posY, town.size.width, town.size.height)\n        })\n    }\n\n}\n\n\n\n//# sourceURL=webpack://bugs/./bugs/core/client/src/view/worldView.js?");

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