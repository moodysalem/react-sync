'use strict';

var React = require('react');
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
    // The query parameters
    params: rpt.object
  },

  getDefaultProps: function () {
    return {
      fetchOnMount: false,
      params: null
    };
  },

  getInitialState: function () {
    return {
      data: null,
      fetched: false,
      loading: false
    };
  },

  fetch: function () {

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