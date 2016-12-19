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

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _props3 = __webpack_require__(2);

	var _deepEqual = __webpack_require__(4);

	var _deepEqual2 = _interopRequireDefault(_deepEqual);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

	      // The data returned from handling the response
	      data: null,

	      // The error that occurred during the fetch
	      error: null
	    }, _this._fetchKey = 0, _temp), _possibleConstructorReturn(_this, _ret);
	  }

	  // the incremented # of the fetch we are working on - used to ignore previous requests


	  _createClass(ReactSync, [{
	    key: "fetchData",
	    value: function fetchData(_ref2) {
	      var _this2 = this;

	      var _ref2$resource = _ref2.resource,
	          url = _ref2$resource.url,
	          params = _ref2$resource.params,
	          headers = _ref2$resource.headers,
	          _ref2$fetchConfig = _ref2.fetchConfig,
	          queryStringFunction = _ref2$fetchConfig.queryStringFunction,
	          toData = _ref2$fetchConfig.toData;

	      // this is the only fetch that matters
	      var myFetchKey = ++this._fetchKey;

	      // only updates state as long as the promise is not cancelled
	      var updateState = function updateState(state) {
	        if (myFetchKey === _this2._fetchKey) {
	          _this2.setState(state);
	        }
	      };

	      this.setState({
	        // always clear old errors, never clear old responses
	        error: null,

	        promise: fetch(url + "?" + queryStringFunction(params), { headers: headers }).then(toData).then(function (data) {
	          return updateState({ data: data, promise: null });
	        }).catch(function (error) {
	          return updateState({ error: error, promise: null });
	        })
	      });
	    }
	  }, {
	    key: "componentDidMount",
	    value: function componentDidMount() {
	      this.fetchData(this.props);
	    }
	  }, {
	    key: "componentWillReceiveProps",
	    value: function componentWillReceiveProps(nextProps) {
	      var resource = nextProps.resource,
	          fetchConfig = nextProps.fetchConfig,
	          _props = this.props,
	          oldResource = _props.resource,
	          oldFetchConfig = _props.fetchConfig;

	      // if the url, parameters, or headers changed, we need to start over

	      if (!(0, _deepEqual2.default)(resource, oldResource) || !(0, _deepEqual2.default)(fetchConfig, oldFetchConfig)) {
	        this.fetchData(nextProps);
	      }
	    }
	  }, {
	    key: "render",
	    value: function render() {
	      var _props2 = this.props,
	          children = _props2.children,
	          propName = _props2.propName;


	      return (0, _react.cloneElement)(_react.Children.only(children), _defineProperty({}, propName, this.state));
	    }
	  }]);

	  return ReactSync;
	}(_react.PureComponent);

	ReactSync.propTypes = _props3.types;
	ReactSync.defaultProps = _props3.defaults;
	exports.default = ReactSync;
	;
	module.exports = exports["default"];

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.defaults = exports.types = undefined;

	var _react = __webpack_require__(1);

	var _queryString = __webpack_require__(3);

	var _queryString2 = _interopRequireDefault(_queryString);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var types = exports.types = {
	  // the name of the prop passed down to the child
	  propName: _react.PropTypes.string,

	  resource: _react.PropTypes.shape({
	    // The base URL without any query parameters
	    url: _react.PropTypes.string.isRequired,

	    // The headers to include
	    headers: _react.PropTypes.object,

	    // The query parameters to include in GET requests
	    params: _react.PropTypes.object
	  }).isRequired,

	  fetchConfig: _react.PropTypes.shape({
	    // converts an object to a query string for the url
	    queryStringFunction: _react.PropTypes.func.isRequired,

	    // takes a fetch response and returns a promise that resolves to the data in the response
	    // also deals with handling invalid responses
	    toData: _react.PropTypes.func.isRequired
	  })
	};

	var defaults = exports.defaults = {
	  propName: 'sync',

	  fetchConfig: {
	    queryStringFunction: _queryString2.default,
	    toData: function toData(response) {
	      if (response.status === 200) {
	        return response.json();
	      }

	      return Promise.reject(new Error("Received response status " + response.status + "!"));
	    }
	  }
	};

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	exports.default = queryString;
	/**
	 * Takes a key/value pair and returns the corresponding encoded query string to represent it
	 * @param key
	 * @param value
	 * @returns {*}
	 */
	function encodePair(key, value) {
	  if (typeof key !== 'string') {
	    return '';
	  }

	  // for arrays we repeat the key without braces
	  if (Array.isArray(value)) {
	    return value.map(function (val) {
	      return encodePair(key, val);
	    }).join('&');
	  }

	  return encodeURIComponent(key) + '=' + encodeURIComponent(value);
	}

	/**
	 * Convert a parameter object to an encoded query string
	 * @param params object
	 * @returns {*} query string
	 */
	function queryString(params) {
	  if ((typeof params === 'undefined' ? 'undefined' : _typeof(params)) !== 'object' || params === null) {
	    return '';
	  }

	  return Object.keys(params).map(function (k) {
	    return encodePair(k, params[k]);
	  }).join('&');
	}
	module.exports = exports['default'];

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var pSlice = Array.prototype.slice;
	var objectKeys = __webpack_require__(5);
	var isArguments = __webpack_require__(6);

	var deepEqual = module.exports = function (actual, expected, opts) {
	  if (!opts) opts = {};
	  // 7.1. All identical values are equivalent, as determined by ===.
	  if (actual === expected) {
	    return true;

	  } else if (actual instanceof Date && expected instanceof Date) {
	    return actual.getTime() === expected.getTime();

	  // 7.3. Other pairs that do not both pass typeof value == 'object',
	  // equivalence is determined by ==.
	  } else if (!actual || !expected || typeof actual != 'object' && typeof expected != 'object') {
	    return opts.strict ? actual === expected : actual == expected;

	  // 7.4. For all other Object pairs, including Array objects, equivalence is
	  // determined by having the same number of owned properties (as verified
	  // with Object.prototype.hasOwnProperty.call), the same set of keys
	  // (although not necessarily the same order), equivalent values for every
	  // corresponding key, and an identical 'prototype' property. Note: this
	  // accounts for both named and indexed properties on Arrays.
	  } else {
	    return objEquiv(actual, expected, opts);
	  }
	}

	function isUndefinedOrNull(value) {
	  return value === null || value === undefined;
	}

	function isBuffer (x) {
	  if (!x || typeof x !== 'object' || typeof x.length !== 'number') return false;
	  if (typeof x.copy !== 'function' || typeof x.slice !== 'function') {
	    return false;
	  }
	  if (x.length > 0 && typeof x[0] !== 'number') return false;
	  return true;
	}

	function objEquiv(a, b, opts) {
	  var i, key;
	  if (isUndefinedOrNull(a) || isUndefinedOrNull(b))
	    return false;
	  // an identical 'prototype' property.
	  if (a.prototype !== b.prototype) return false;
	  //~~~I've managed to break Object.keys through screwy arguments passing.
	  //   Converting to array solves the problem.
	  if (isArguments(a)) {
	    if (!isArguments(b)) {
	      return false;
	    }
	    a = pSlice.call(a);
	    b = pSlice.call(b);
	    return deepEqual(a, b, opts);
	  }
	  if (isBuffer(a)) {
	    if (!isBuffer(b)) {
	      return false;
	    }
	    if (a.length !== b.length) return false;
	    for (i = 0; i < a.length; i++) {
	      if (a[i] !== b[i]) return false;
	    }
	    return true;
	  }
	  try {
	    var ka = objectKeys(a),
	        kb = objectKeys(b);
	  } catch (e) {//happens when one is a string literal and the other isn't
	    return false;
	  }
	  // having the same number of owned properties (keys incorporates
	  // hasOwnProperty)
	  if (ka.length != kb.length)
	    return false;
	  //the same set of keys (although not necessarily the same order),
	  ka.sort();
	  kb.sort();
	  //~~~cheap key test
	  for (i = ka.length - 1; i >= 0; i--) {
	    if (ka[i] != kb[i])
	      return false;
	  }
	  //equivalent values for every corresponding key, and
	  //~~~possibly expensive deep test
	  for (i = ka.length - 1; i >= 0; i--) {
	    key = ka[i];
	    if (!deepEqual(a[key], b[key], opts)) return false;
	  }
	  return typeof a === typeof b;
	}


/***/ },
/* 5 */
/***/ function(module, exports) {

	exports = module.exports = typeof Object.keys === 'function'
	  ? Object.keys : shim;

	exports.shim = shim;
	function shim (obj) {
	  var keys = [];
	  for (var key in obj) keys.push(key);
	  return keys;
	}


/***/ },
/* 6 */
/***/ function(module, exports) {

	var supportsArgumentsClass = (function(){
	  return Object.prototype.toString.call(arguments)
	})() == '[object Arguments]';

	exports = module.exports = supportsArgumentsClass ? supported : unsupported;

	exports.supported = supported;
	function supported(object) {
	  return Object.prototype.toString.call(object) == '[object Arguments]';
	};

	exports.unsupported = unsupported;
	function unsupported(object){
	  return object &&
	    typeof object == 'object' &&
	    typeof object.length == 'number' &&
	    Object.prototype.hasOwnProperty.call(object, 'callee') &&
	    !Object.prototype.propertyIsEnumerable.call(object, 'callee') ||
	    false;
	};


/***/ }
/******/ ])
});
;