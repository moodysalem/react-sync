(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"));
	else if(typeof define === 'function' && define.amd)
		define(["react"], factory);
	else if(typeof exports === 'object')
		exports["ReactSync"] = factory(require("react"));
	else
		root["ReactSync"] = factory(root["React"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _propTypes = __webpack_require__(2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ReactSync = function (_PureComponent) {
	  _inherits(ReactSync, _PureComponent);

	  function ReactSync() {
	    var _ref;

	    var _temp, _this, _ret;

	    _classCallCheck(this, ReactSync);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = ReactSync.__proto__ || Object.getPrototypeOf(ReactSync)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
	      // The pending promise
	      promise: null,
	      // The data returned from fetching the URL
	      data: null
	    }, _temp), _possibleConstructorReturn(_this, _ret);
	  }

	  _createClass(ReactSync, [{
	    key: 'render',
	    value: function render() {
	      return (0, _react.cloneElement)(_react.Children.only(this.props.children), { syncState: this.state });
	    }
	  }]);

	  return ReactSync;
	}(_react.PureComponent);

	ReactSync.propTypes = _propTypes.propTypes;
	ReactSync.defaultProps = _propTypes.defaultProps;
	exports.default = ReactSync;

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.defaultProps = exports.propTypes = undefined;

	var _react = __webpack_require__(1);

	var propTypes = exports.propTypes = {
	  // The base URL without any query parameters
	  url: _react.PropTypes.string.isRequired,

	  ///////////////////// OPTIONAL //////////////////////////////

	  // The attribute of an object that uniquely identifies it
	  primaryKey: _react.PropTypes.string,

	  // The headers to include in all requests
	  headers: _react.PropTypes.object,
	  // The accept header sent in all requests
	  accept: _react.PropTypes.string,

	  // The query parameters to include in GET requests
	  params: _react.PropTypes.object,

	  // The content-type used for request bodies in POST and PUT requests
	  contentType: _react.PropTypes.string
	};

	var defaultProps = exports.defaultProps = {
	  primaryKey: 'id',
	  headers: null,
	  accept: 'json',
	  params: null,
	  contentType: 'json'
	};

/***/ }
/******/ ])
});
;