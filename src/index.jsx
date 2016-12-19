import React, { Children, cloneElement, PureComponent, PropTypes } from "react";
import { types, defaults } from "./props";
import deepEqual from "deep-equal";

export default class ReactSync extends PureComponent {
  static propTypes = types;
  static defaultProps = defaults;

  state = {
    // The pending promise
    promise: null,

    // The data returned from handling the response
    data: null,

    // The error that occurred during the fetch
    error: null
  };

  // the incremented # of the fetch we are working on - used to ignore previous requests
  _fetchKey = 0;

  fetchData({ resource: { url, params, headers }, fetchConfig: { queryStringFunction, toData } }) {
    // this is the only fetch that matters
    const myFetchKey = ++this._fetchKey;

    // only updates state as long as the promise is not cancelled
    const updateState = state => {
      if (myFetchKey === this._fetchKey) {
        this.setState(state);
      }
    };

    this.setState({
      // always clear old errors, never clear old responses
      error: null,

      promise: fetch(`${url}?${queryStringFunction(params)}`, { headers })
        .then(toData)
        .then(data => updateState({ data, promise: null }))
        .catch(error => updateState({ error, promise: null }))
    });
  }

  componentDidMount() {
    this.fetchData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const { resource, fetchConfig } = nextProps,
      { resource: oldResource, fetchConfig: oldFetchConfig } = this.props;

    // if the url, parameters, or headers changed, we need to start over
    if (!deepEqual(resource, oldResource) || !deepEqual(fetchConfig, oldFetchConfig)) {
      this.fetchData(nextProps);
    }
  }

  render() {
    const { children, propName } = this.props;

    return cloneElement(
      Children.only(children),
      { [ propName ]: this.state }
    );
  }
};