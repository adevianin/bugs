/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./bugs/core/client/src/index.js":
/*!***************************************!*\
  !*** ./bugs/core/client/src/index.js ***!
  \***************************************/
/***/ (() => {

eval("console.log('start');\n\nlet socket = new WebSocket(`ws://${location.host}/mainsocket`);\n\nsocket.onopen = function(e) {\n    console.log('connected');\n};\n\nsocket.onmessage = function(event) {\n    console.log('new msg ', event.data);\n}\n\n//# sourceURL=webpack://bugs/./bugs/core/client/src/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./bugs/core/client/src/index.js"]();
/******/ 	
/******/ })()
;