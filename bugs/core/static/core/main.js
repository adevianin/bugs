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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Bug\": () => (/* binding */ Bug)\n/* harmony export */ });\n/* harmony import */ var _entity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./entity */ \"./bugs/core/client/src/domain/entity/entity.js\");\n\n\nclass Bug extends _entity__WEBPACK_IMPORTED_MODULE_0__.Entity {\n\n    updateEntity(entityJson) {\n        this.position = entityJson.pos;\n    }\n\n}\n\n\n\n//# sourceURL=webpack://bugs/./bugs/core/client/src/domain/entity/bug.js?");

/***/ }),

/***/ "./bugs/core/client/src/domain/entity/entity.js":
/*!******************************************************!*\
  !*** ./bugs/core/client/src/domain/entity/entity.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Entity\": () => (/* binding */ Entity)\n/* harmony export */ });\nclass Entity {\n\n    constructor(id, pos, size) {\n        this.id = id;\n        this._pos = pos;\n        this._size = size;\n    }\n\n    get position() {\n        return {\n            x: this._pos.x,\n            y: this._pos.y,\n        };\n    }\n\n    set position(position) {\n        this._pos = {\n            x: position.x,\n            y: position.y\n        }\n    }\n\n    get size() {\n        return {\n            width: this._size.width,\n            height: this._size.height,\n        };\n    }\n\n    updateEntity() {\n    }\n}\n\n\n\n//# sourceURL=webpack://bugs/./bugs/core/client/src/domain/entity/entity.js?");

/***/ }),

/***/ "./bugs/core/client/src/domain/entity/world.js":
/*!*****************************************************!*\
  !*** ./bugs/core/client/src/domain/entity/world.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"World\": () => (/* binding */ World)\n/* harmony export */ });\nclass World {\n    constructor(bugs) {\n        this._bugs = bugs;\n    }\n\n    get bugs() {\n        return [...this._bugs];\n    }\n\n    updateEntity(entityJson) {\n        let entity = this._findEntityById(entityJson.id);\n        if (entity) {\n            entity.updateEntity(entityJson);\n        } else {\n            console.warn(`entity with id=\"${entityJson.id}\" is not found`);\n        }\n    }\n\n    _findEntityById(id) {\n        return this._bugs.find(b => { return b.id === id });\n    }\n}\n\n\n\n//# sourceURL=webpack://bugs/./bugs/core/client/src/domain/entity/world.js?");

/***/ }),

/***/ "./bugs/core/client/src/domain/index.js":
/*!**********************************************!*\
  !*** ./bugs/core/client/src/domain/index.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"initDomainLayer\": () => (/* binding */ initDomainLayer)\n/* harmony export */ });\n/* harmony import */ var _domainFacade__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./domainFacade */ \"./bugs/core/client/src/domain/domainFacade.js\");\n/* harmony import */ var _worldFactory__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./worldFactory */ \"./bugs/core/client/src/domain/worldFactory.js\");\n\n\n\nfunction initDomainLayer() {\n    let worldFactory = new _worldFactory__WEBPACK_IMPORTED_MODULE_1__.WorldFactory();\n    let domainFacade = new _domainFacade__WEBPACK_IMPORTED_MODULE_0__.DomainFacade(worldFactory);\n\n    return domainFacade;\n}\n\n\n\n//# sourceURL=webpack://bugs/./bugs/core/client/src/domain/index.js?");

/***/ }),

/***/ "./bugs/core/client/src/domain/worldFactory.js":
/*!*****************************************************!*\
  !*** ./bugs/core/client/src/domain/worldFactory.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"WorldFactory\": () => (/* binding */ WorldFactory)\n/* harmony export */ });\n/* harmony import */ var _entity_bug__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./entity/bug */ \"./bugs/core/client/src/domain/entity/bug.js\");\n/* harmony import */ var _entity_world__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./entity/world */ \"./bugs/core/client/src/domain/entity/world.js\");\n\n\n\nclass WorldFactory {\n\n    buildWorld(worldJson) {\n        let initedBugs = [];\n        worldJson.bugs.forEach(bugJson => {\n            let bug = this.buildBug(bugJson);\n            initedBugs.push(bug);\n        });\n\n        let world = new _entity_world__WEBPACK_IMPORTED_MODULE_1__.World(initedBugs);\n\n        return world;\n    }\n\n    buildBug(bugJson) {\n        return new _entity_bug__WEBPACK_IMPORTED_MODULE_0__.Bug(bugJson.id, bugJson.pos, bugJson.size);\n    }\n}\n\n\n\n//# sourceURL=webpack://bugs/./bugs/core/client/src/domain/worldFactory.js?");

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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"WorldView\": () => (/* binding */ WorldView)\n/* harmony export */ });\nclass WorldView {\n    constructor(canvas, domainFacade) {\n        this._domainFacade = domainFacade;\n        this._canvas = canvas;\n        this._ctx = this._canvas.getContext('2d');\n\n        setInterval(this._renderWorld.bind(this), 100);\n    }\n\n    _renderWorld() {\n        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);\n\n        this._renderBugs();\n    }\n\n    _renderBugs() {\n        let bugs = this._domainFacade.world.bugs;\n        bugs.forEach(bug => {\n            let posX = bug.position.x - bug.size.width / 2;\n            let posY = bug.position.y - bug.size.height / 2;\n            this._ctx.fillRect(posX, posY, bug.size.width, bug.size.height)\n        })\n    }\n}\n\n\n\n//# sourceURL=webpack://bugs/./bugs/core/client/src/view/worldView.js?");

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