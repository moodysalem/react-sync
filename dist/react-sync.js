(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"), require("jquery"));
	else if(typeof define === 'function' && define.amd)
		define(["react", "jquery"], factory);
	else if(typeof exports === 'object')
		exports["ReactSync"] = factory(require("react"), require("jquery"));
	else
		root["ReactSync"] = factory(root["React"], root["$"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__) {
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

	var React = __webpack_require__(1);
	var $ = __webpack_require__(2);
	var omit = __webpack_require__(3);
	var functionBind = __webpack_require__(7);

	var capFirst = function capitalizeFirstLetter(string) {
	  return string.charAt(0).toUpperCase() + string.slice(1);
	};

	var DATA_PROP_NAME = 'data',
	  LOADING_PROP_NAME = 'loading',
	  FETCHED_PROP_NAME = 'fetched',
	  ONSAVE_PROP_NAME = 'onSave',
	  ONDELETE_PROP_NAME = 'onDelete';

	// shortcut
	var rpt = React.PropTypes;

	// separated so we can easily get the list of keys
	var propTypes = {
	  // The root URL where the data is located
	  rootUrl: rpt.string.isRequired,
	  // The ID of the model. Leave blank to fetch a collection
	  id: rpt.oneOfType([ rpt.string, rpt.number ]),

	  // This is the prefix of the data, loading, and fetched properties passed to the children, as well as the
	  // suffix given to the onSave and onDelete properties
	  dataName: rpt.string,

	  // Whether the data should be fetched when this component mounts
	  fetchOnMount: rpt.bool,
	  // Whether the data should be fetched when any new properties are received that could change the data
	  fetchOnNewProps: rpt.bool,

	  // The query parameters to include when fetching the data
	  params: rpt.object,
	  // Indicates whether to perform a traditional "shallow" serialization of query parameters
	  traditionalParams: rpt.bool,

	  // How many records to fetch at a time - leave blank to ignore this parameter
	  count: rpt.number,
	  // The name of the parameter that will be passed to the server to indicate how many records to fetch
	  countParam: rpt.string,

	  // The number of the record on which to start - leave blank to ignore this parameter
	  start: rpt.number,
	  // The name of the parameter that will be passed to the server to indicate which record to start on
	  startParam: rpt.string,

	  // The sorts to send to the server - leave blank to ignore this parameter
	  sorts: rpt.arrayOf(rpt.shape({
	    attribute: rpt.string.isRequired,
	    desc: rpt.bool.isRequired
	  })),
	  // The separator between the attribute and whether it's descending or ascending
	  sortInfoSeparator: rpt.string,
	  // The name of the query parameter that will be used for sorting
	  sortParam: rpt.string,

	  // Event Handlers - these are not passed to the child, but rather are used to notify the owner component
	  // when they occur
	  onCreate: rpt.func,
	  onRead: rpt.func,
	  onUpdate: rpt.func,
	  onDelete: rpt.func,

	  onError: rpt.func,

	  // Options to pass to ajax calls
	  ajaxOptions: rpt.object
	};

	var propNames = Object.keys(propTypes).concat('children');

	module.exports = React.createClass({
	  displayName: 'React Sync',

	  propTypes: propTypes,

	  getDefaultProps: function () {
	    return {
	      id: null,
	      dataName: '',
	      fetchOnMount: true,
	      fetchOnNewProps: true,
	      params: null,
	      traditionalParams: true,
	      sorts: null,
	      sortInfoSeparator: '|',
	      sortParam: 'sort',
	      start: null,
	      startParam: 'start',
	      count: null,
	      countParam: 'count',
	      onCreate: null,
	      onRead: null,
	      onUpdate: null,
	      onDelete: null,
	      onError: null,
	      ajaxOptions: null
	    };
	  },

	  getInitialState: function () {
	    return {
	      // The data received from the AJAX call
	      data: null,
	      // Whether the data has been fetched
	      fetched: false,
	      // Whether an ajax call is in progress
	      loading: false,
	      // The last URL used to fetch the data
	      lastFetchUrl: null
	    };
	  },

	  /**
	   * Get an object containing all the parameters that should be sent as query parameters in the URL
	   */
	  getParameterObject: function () {
	    var p = $.extend({}, this.props.params);
	    if (this.props.start !== null && this.props.count !== null) {
	      p[ this.props.startParam ] = this.props.start;
	      p[ this.props.countParam ] = this.props.count;
	    }
	    if (this.props.sorts !== null && this.props.sorts.length > 0) {
	      var sis = this.props.sortInfoSeparator;
	      p[ this.props.sortParam ] = $.map(this.props.sorts, function (sort) {
	        return ((sort.desc) ? 'D' : 'A') + sis + sort.attribute;
	      });
	    }
	    return p;
	  },

	  /**
	   * Get the URL that should be fetched
	   */
	  getUrl: function (withQueryParams) {
	    var url = this.props.rootUrl;
	    if (this.props.id !== null) {
	      if (url[ url.length - 1 ] === '/') {
	        url = url + this.props.id;
	      } else {
	        url = url + '/' + this.props.id;
	      }
	    }

	    if (withQueryParams) {
	      url = url + '?' + $.param(this.getParameterObject(), this.props.traditionalParams);
	    }
	    return url;
	  },

	  /**
	   * Modify the loading state of the object
	   * @param isLoading boolean of whether it's loading
	   */
	  setLoading: function (isLoading, callback) {
	    if (this.isMounted()) {
	      this.setState({
	        loading: isLoading
	      }, callback);
	    }
	  },

	  /**
	   * Fetch the data at the URL
	   */
	  fetch: function () {
	    var url = this.getUrl(true);
	    this.setState({
	      loading: true,
	      lastFetchUrl: url
	    }, function () {
	      $.ajax($.extend({}, this.props.ajaxOptions, {
	        url: url,
	        context: this,
	        success: function (data, status, jqXhr) {
	          this.setLoading(false);
	          this.markFetched();
	          this.setData(data);
	          if (this.props.onRead !== null) {
	            this.props.onRead.apply(this, arguments);
	          }
	        },
	        error: function (jqXhr, textStatus, errorThrown) {
	          this.setLoading(false);
	          this.clearData();
	          if (this.props.onError !== null) {
	            this.props.onError.apply(this, arguments);
	          }
	        }
	      }));
	    });
	  },

	  /**
	   * Reset the data in the state object to null
	   */
	  clearData: function () {
	    this.setData(null);
	  },

	  /**
	   * Set the data in the state object
	   * @param data to set
	   */
	  setData: function (data) {
	    if (this.isMounted()) {
	      this.setState({
	        data: data
	      });
	    }
	  },

	  /**
	   * Set fetched to true
	   */
	  markFetched: function () {
	    if (this.isMounted()) {
	      if (!this.state.fetched) {
	        this.setState({
	          fetched: true
	        });
	      }
	    }
	  },

	  /**
	   * Fetch if the component is supposed to fetch on mount
	   */
	  componentDidMount: function () {
	    if (this.props.fetchOnMount) {
	      this.fetch();
	    }
	  },

	  /**
	   * Refetch the data if props caused the URL to change
	   */
	  componentDidUpdate: function (prevProps, prevState) {
	    if (this.props.fetchOnNewProps && this.getUrl(true) !== this.state.lastFetchUrl) {
	      this.fetch();
	    }
	  },

	  /**
	   * Sync new data to the server
	   * @param newData new data to save
	   */
	  doSave: function (newData) {
	    var isNew = this.props.id === null;
	    this.setLoading(true, function () {
	      $.ajax($.extend({}, this.props.ajaxOptions, {
	        method: isNew ? 'POST' : 'PUT',
	        data: newData,
	        url: this.getUrl(false),
	        context: this,

	        success: function (data, status, jqXhr) {
	          this.setLoading(false);
	          this.clearData();
	          var eHandler = (isNew ? this.props.onCreate : this.props.onUpdate);
	          if (eHandler !== null) {
	            eHandler.apply(this, arguments);
	          }
	        },

	        error: function (jqXhr, textStatus, errorThrown) {
	          this.setLoading(false);
	          if (this.props.onError !== null) {
	            this.props.onError.apply(this, arguments);
	          }
	        }
	      }));
	    });
	  },

	  /**
	   * Make a delete request to the URL
	   */
	  doDelete: function () {
	    this.setLoading(true, function () {
	      $.ajax($.extend({}, this.props.ajaxOptions, {
	        method: 'DELETE',
	        url: this.getUrl(false),
	        context: this,

	        success: function (data, status, jqXhr) {
	          this.setLoading(false);
	          this.clearData();
	          if (this.props.onDelete !== null) {
	            this.props.onDelete.apply(this, arguments);
	          }
	        },

	        error: function (jqXhr, textStatus, errorThrown) {
	          this.setLoading(false);
	          if (this.props.onError !== null) {
	            this.props.onError.apply(this, arguments);
	          }
	        }
	      }));
	    });
	  },

	  /**
	   * This function returns an object containing all the props to pass to the child of this component.
	   *
	   * Props not used by this react-sync will be included in the props passed to the child. This allows for composing
	   * this component multiple times with different dataNames, to provide data from multiple sources to a single component.
	   * @returns {*}
	   */
	  getChildProps: function () {
	    // pass all the props that aren't used by this component to the child
	    var childProps = omit(this.props, propNames);

	    var dn = this.props.dataName;
	    var hasDataName = dn.length > 0;

	    childProps[ dn + (hasDataName ? capFirst(DATA_PROP_NAME) : DATA_PROP_NAME) ] = this.state.data;
	    childProps[ dn + (hasDataName ? capFirst(LOADING_PROP_NAME) : LOADING_PROP_NAME) ] = this.state.loading;
	    childProps[ dn + (hasDataName ? capFirst(FETCHED_PROP_NAME) : FETCHED_PROP_NAME) ] = this.state.fetched;
	    childProps[ ONSAVE_PROP_NAME + (hasDataName ? capFirst(dn) : dn) ] = functionBind.call(this.doSave, this);
	    childProps[ ONDELETE_PROP_NAME + (hasDataName ? capFirst(dn) : dn) ] = functionBind.call(this.doSave, this);

	    return childProps;
	  },


	  /**
	   * Just clone the child element with the data, plus the new event handlers.
	   * @returns {*}
	   */
	  render: function () {
	    return React.cloneElement(React.Children.only(this.props.children), this.getChildProps());
	  }
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/*!
	 * object.omit <https://github.com/jonschlinkert/object.omit>
	 *
	 * Copyright (c) 2014-2015, Jon Schlinkert.
	 * Licensed under the MIT License.
	 */

	'use strict';

	var isObject = __webpack_require__(4);
	var forOwn = __webpack_require__(5);

	module.exports = function omit(obj, keys) {
	  if (!isObject(obj)) return {};

	  var keys = [].concat.apply([], [].slice.call(arguments, 1));
	  var last = keys[keys.length - 1];
	  var res = {}, fn;

	  if (typeof last === 'function') {
	    fn = keys.pop();
	  }

	  var isFunction = typeof fn === 'function';
	  if (!keys.length && !isFunction) {
	    return obj;
	  }

	  forOwn(obj, function (value, key) {
	    if (keys.indexOf(key) === -1) {

	      if (!isFunction) {
	        res[key] = value;
	      } else if (fn(value, key, obj)) {
	        res[key] = value;
	      }
	    }
	  });
	  return res;
	};


/***/ },
/* 4 */
/***/ function(module, exports) {

	/*!
	 * is-extendable <https://github.com/jonschlinkert/is-extendable>
	 *
	 * Copyright (c) 2015, Jon Schlinkert.
	 * Licensed under the MIT License.
	 */

	'use strict';

	module.exports = function isExtendable(val) {
	  return typeof val !== 'undefined' && val !== null
	    && (typeof val === 'object' || typeof val === 'function');
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/*!
	 * for-own <https://github.com/jonschlinkert/for-own>
	 *
	 * Copyright (c) 2014-2015, Jon Schlinkert.
	 * Licensed under the MIT License.
	 */

	'use strict';

	var forIn = __webpack_require__(6);
	var hasOwn = Object.prototype.hasOwnProperty;

	module.exports = function forOwn(o, fn, thisArg) {
	  forIn(o, function (val, key) {
	    if (hasOwn.call(o, key)) {
	      return fn.call(thisArg, o[key], key, o);
	    }
	  });
	};


/***/ },
/* 6 */
/***/ function(module, exports) {

	/*!
	 * for-in <https://github.com/jonschlinkert/for-in>
	 *
	 * Copyright (c) 2014-2015, Jon Schlinkert.
	 * Licensed under the MIT License.
	 */

	'use strict';

	module.exports = function forIn(o, fn, thisArg) {
	  for (var key in o) {
	    if (fn.call(thisArg, o[key], key, o) === false) {
	      break;
	    }
	  }
	};

/***/ },
/* 7 */
/***/ function(module, exports) {

	var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
	var slice = Array.prototype.slice;
	var toStr = Object.prototype.toString;
	var funcType = '[object Function]';

	module.exports = function bind(that) {
	    var target = this;
	    if (typeof target !== 'function' || toStr.call(target) !== funcType) {
	        throw new TypeError(ERROR_MESSAGE + target);
	    }
	    var args = slice.call(arguments, 1);

	    var binder = function () {
	        if (this instanceof bound) {
	            var result = target.apply(
	                this,
	                args.concat(slice.call(arguments))
	            );
	            if (Object(result) === result) {
	                return result;
	            }
	            return this;
	        } else {
	            return target.apply(
	                that,
	                args.concat(slice.call(arguments))
	            );
	        }
	    };

	    var boundLength = Math.max(0, target.length - args.length);
	    var boundArgs = [];
	    for (var i = 0; i < boundLength; i++) {
	        boundArgs.push('$' + i);
	    }

	    var bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this,arguments); }')(binder);

	    if (target.prototype) {
	        var Empty = function Empty() {};
	        Empty.prototype = target.prototype;
	        bound.prototype = new Empty();
	        Empty.prototype = null;
	    }

	    return bound;
	};



/***/ }
/******/ ])
});
;