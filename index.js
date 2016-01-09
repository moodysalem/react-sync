'use strict';

var React = require('react');
var request = require('superagent');
var assign = require('object-assign');
var omit = require('object.omit');
var without = require('array-without');
var functionBind = require('function-bind');
var deepEqual = require('deep-equal');

var noop = function () {
};

/**
 * Helper function that capitalizes the first letter in the string
 * @param string to capitalize
 * @returns {string} capitalized string
 */
var capFirst = function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// shortcut
var rpt = React.PropTypes;

// separated so we can easily get the list of keys
var propTypes = {
  // The URL minus any query parameters
  url: rpt.string.isRequired,

  // If you are just using the component for its callbacks, then you can provide the initial data
  initialData: rpt.any,

  // This is the prefix of the data, loading, and fetched properties passed to the children, as well as the
  // suffix given to the onSave and onDelete properties
  dataName: rpt.string,

  // Whether the component should do a GET when it mounts
  readOnMount: rpt.bool,
  // Whether the component should do a GET when props change that would affect the URL or query parameters
  readOnUpdate: rpt.bool,

  // The query parameters to include when fetching the data
  params: rpt.object,
  // The headers to include in all requests
  headers: rpt.object,
  // The content-type used for request bodies in POST and PUT requests
  contentType: rpt.string,
  // The accept header
  accept: rpt.string,

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
  onError: rpt.func
};

// all the properties listed above and the children property are used by this component
var propNames = Object.keys(propTypes).concat('children');

module.exports = React.createClass({
  displayName: 'React Sync',

  propTypes: propTypes,

  getDefaultProps: function () {
    return {
      dataName: null,
      initialData: null,
      readOnMount: true,
      readOnUpdate: true,
      params: null,
      headers: null,
      contentType: 'json',
      accept: 'json',
      sorts: null,
      sortInfoSeparator: '|',
      sortParam: 'sort',
      start: null,
      startParam: 'start',
      count: null,
      countParam: 'count',
      onCreate: noop,
      onRead: noop,
      onUpdate: noop,
      onDelete: noop,
      onError: noop
    };
  },

  getInitialState: function () {
    return {
      // The fetch data
      data: this.props.initialData,
      // Whether the data has been fetched
      fetched: false,
      // All the active requests
      activeRequests: [],
      // The URL and parameters used in the last fetch
      lastGet: null,
      // The currently active GET request. Only one GET can happen at a time to prevent race conditions
      activeGet: null
    };
  },

  /**
   * Get an object containing all the parameters that should be sent as query parameters in the URL
   */
  getParameters: function () {
    var p = assign({}, this.props.params);
    if (this.props.start !== null && this.props.count !== null) {
      p[ this.props.startParam ] = this.props.start;
      p[ this.props.countParam ] = this.props.count;
    }
    if (this.props.sorts !== null && this.props.sorts.length > 0) {
      var sis = this.props.sortInfoSeparator;
      var sorts = [];

      // create the string values for the sort parameter
      for (var i = 0; i < this.props.sorts.length; i++) {
        var s = this.props.sorts;
        sorts.push((s.desc ? 'D' : 'A') + sis + s.attribute);
      }

      p[ this.props.sortParam ] = sorts;
    }
    return p;
  },

  /**
   * POST the data
   */
  doCreate: function (data) {
    var req = request.post(this.props.url)
      .type(this.props.contentType)
      .accept(this.props.accept)
      .send(data);

    if (this.props.headers !== null) {
      req.set(this.props.headers);
    }

    this.setState({
      activeRequests: this.state.activeRequests.concat(req)
    }, function () {
      req.end(functionBind.call(function (err, res) {
        if (err !== null) {
          this.props.onError(err);
        } else {
          this.props.onCreate(res);
        }

        this.setState({
          activeRequests: without(this.state.activeRequests, req)
        });
      }, this));
    });
  },

  /**
   * GET the data
   */
  doRead: function () {
    var url = this.props.url;
    var params = this.getParameters();

    var req = request.get(url)
      .accept(this.props.accept)
      .query(params);

    if (this.props.headers !== null) {
      req.set(this.props.headers);
    }

    if (this.state.activeGet !== null) {
      this.state.activeGet.abort();
    }

    this.setState({
      lastGet: {
        url: url,
        params: params
      },
      activeRequests: this.state.activeRequests.concat([ req ]),
      activeGet: req
    }, function () {
      req.end(functionBind.call(function (err, res) {
        var data = null;

        // done loading
        if (err === null) {
          data = res.body;
          this.props.onRead(res);
        } else {
          this.props.onError(err);
        }

        this.setState({
          data: data,
          activeRequests: without(this.state.activeRequests, req),
          fetched: (this.state.fetched || data !== null),
          activeGet: null
        });
      }, this));
    });
  },

  /**
   * PUT the data passed as the first parameter
   */
  doUpdate: function (data) {
    var req = request.put(this.props.url)
      .type(this.props.contentType)
      .accept(this.props.accept)
      .send(data);

    if (this.props.headers !== null) {
      req.set(this.props.headers);
    }

    this.setState({
      activeRequests: this.state.activeRequests.concat(req)
    }, function () {
      req.end(functionBind.call(function (err, res) {
        if (err !== null) {
          this.props.onError(err);
        } else {
          this.props.onUpdate(res);
        }

        this.setState({
          activeRequests: without(this.state.activeRequests, req)
        });
      }, this));
    });
  },

  /**
   * Make a DELETE request to the URL
   */
  doDelete: function () {
    var req = request.del(this.props.url)
      .type(this.props.contentType)
      .accept(this.props.accept)
      .send(data);

    if (this.props.headers !== null) {
      req.set(this.props.headers);
    }

    this.setState({
      activeRequests: this.state.activeRequests.concat(req)
    }, function () {
      req.end(functionBind.call(function (err, res) {
        if (err !== null) {
          this.props.onError(err);
        } else {
          this.props.onDelete(res);
        }

        this.setState({
          activeRequests: without(this.state.activeRequests, req)
        });
      }, this));
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
    if (this.props.readOnMount) {
      this.doRead();
    }
  },

  /**
   * Abort all active requests when the component unmounts
   */
  componentWillUnmount: function () {
    for (var i = 0; i < this.state.activeRequests.length; i++) {
      this.state.activeRequests[ i ].abort();
    }
  },

  /**
   * Fetch if the URL changes or the params change
   */
  componentDidUpdate: function (prevProps, prevState) {
    if (this.props.readOnUpdate) {
      var lastGet = this.state.lastGet;
      if (lastGet === null || this.props.url !== lastGet.url || !deepEqual(this.getParameters(), lastGet.params)) {
        this.doRead();
      }
    }
  },

  /**
   * Get the name of a property, based on the dataName and whether it should be a suffix
   * @param base name to be transformed
   * @param suffix whether it should be transformed with the dataName as a suffix
   * @returns {string} new name
   */
  getPropertyName: function (base, suffix) {
    var dn = this.props.dataName;

    if (dn !== null) {
      if (suffix === true) {
        return base + capFirst(dn);
      } else {
        return dn + capFirst(base);
      }
    }

    return base;
  },

  /**
   * This function returns an object containing all the props to pass to the child of this component.
   *
   * Props not used by this react-sync will be included in the props passed to the child. This allows for composing
   * this component multiple times with different dataNames, to provide data from multiple sources to a single component.
   * @returns {*}
   */
  getChildProps: function () {
    // start with all the props that aren't used by this component
    var childProps = omit(this.props, propNames);

    childProps[ this.getPropertyName('data') ] = this.state.data;
    childProps[ this.getPropertyName('loading') ] = this.state.activeRequests.length > 0;
    childProps[ this.getPropertyName('fetched') ] = this.state.fetched;
    childProps[ this.getPropertyName('doCreate', true) ] = functionBind.call(this.doCreate, this);
    childProps[ this.getPropertyName('doRead', true) ] = functionBind.call(this.doCreate, this);
    childProps[ this.getPropertyName('doUpdate', true) ] = functionBind.call(this.doUpdate, this);
    childProps[ this.getPropertyName('doDelete', true) ] = functionBind.call(this.doUpdate, this);

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