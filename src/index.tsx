import { Component } from 'react';
import { defaultProps, ReactSyncPropTypes } from './props';

// @ts-ignore
import deepEqual = require('deep-equal');

export interface StateType<T> {
  promise: Promise<T> | null;
  data: T | null;
  error: Error | null
}

export default class ReactSync<T> extends Component<ReactSyncPropTypes<T>> {
  static defaultProps = defaultProps;

  state: StateType<T> = {
    // The pending promise
    promise: null,

    // The data returned from handling the response
    data: null,

    // The error that occurred during the fetch
    error: null
  };

  // the incremented # of the fetch we are working on - used to ignore responses from previous requests
  _fetchKey = 0;

  fetchData({ url, params, headers, toQueryString, toData }: ReactSyncPropTypes<T>) {
    // this is the only fetch that matters
    const myFetchKey = ++this._fetchKey;

    // only updates state as long as the promise is not cancelled
    const updateState = state => {
      if (myFetchKey === this._fetchKey) {
        this.setState(state);
      }
    };

    updateState({
      // always clear old errors, never clear old responses
      error: null,

      promise: fetch(`${url}?${toQueryString(params)}`, { headers })
        .then(toData)
        .then(data => {
          updateState({ data, promise: null });
          return data;
        })
        .catch(error => {
          updateState({ error, promise: null });
          return null
        })
    });
  }

  componentDidMount() {
    this.fetchData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    // if the url, parameters, or headers changed, we need to start over
    if (
      !deepEqual(
        { url: nextProps.url, params: nextProps.params, headers: nextProps.header },
        { url: this.props.url, params: this.props.params, headers: this.props.headers }
      )
    ) {
      this.fetchData(nextProps);
    }
  }

  render() {
    const { children } = this.props;

    return children(this.state);
  }
};