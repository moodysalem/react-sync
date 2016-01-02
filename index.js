'use strict';

var React = require('react');
var $ = require('jquery');
var rpt = React.PropTypes;

module.exports = React.createClass({
  displayName: 'React Sync Manager',

  propTypes: {
    // The root URL where the data is located
    rootUrl: rpt.string.isRequired,
    // The ID of the model. Leave blank to fetch a collection
    id: rpt.oneOfType([ rpt.string, rpt.number ]),
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
    onSync: rpt.func,
    onSave: rpt.func,
    onDelete: rpt.func,

    // Options to pass to ajax calls
    ajaxOptions: rpt.object
  },

  getDefaultProps: function () {
    return {
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
      onSync: null,
      onSave: null,
      onDelete: null,
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
      loading: false
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
  getUrl: function () {
    var url = this.props.rootUrl;
    if (this.props.id !== null) {
      if (url[ url.length - 1 ] === '/') {
        url = url + this.props.id;
      } else {
        url = url + '/' + this.props.id;
      }
    }

    url = url + '?' + $.param(this.getParameterObject(), this.props.traditionalParams);
  },


  fetch: function () {
    this.setState({
      loading: true
    }, function () {
      $.ajax({
        url: this.getUrl(),
        success: (function (data) {
          this.markFetched();
          if (this.props.onSync !== null){
            this.props.onSync();
          }
        }).bind(this)
      })
    });
  },

  markFetched: function () {
    if (!this.state.fetched) {
      this.setState({
        fetched: true
      });
    }
  },

  componentDidMount: function () {
    if (this.props.fetchOnMount) {
      this.fetch();
    }
  },

  handleSave: function () {
  },
  handleDelete: function () {
  },

  render: function () {
    return React.cloneElement(React.Children.only(this.props.children), {
      data: this.state.data,
      fetched: this.state.fetched,
      loading: this.state.loading,
      onSave: this.handleSave,
      onDelete: this.handleDelete
    });
  }
});