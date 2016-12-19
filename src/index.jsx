import React, { Children, cloneElement, PureComponent, PropTypes } from "react";
import { types, defaults } from "./props";
import deepEqual from "deep-equal";

export default class ReactSync extends PureComponent {
  static propTypes = types;
  static defaultProps = defaults;

  state = {
    // The pending promise
    promise: null,
    // The data returned from fetching the URL
    response: null,
    // The error that occurred
    error: null
  };

  // the incremented # of the fetch we are working on
  _fetchKey = 0;

  fetchFromProps = () => this.fetchData(this.props);

  fetchData({ url, params, headers, queryStringFunction }) {
    // this is the only fetch that matters
    const myFetchKey = this._fetchKey++;
    const isCancelled = () => myFetchKey !== this._fetchKey;

    this.setState({
      // always clear old errors, never clear old responses
      error: null,

      promise: fetch(`${url}?${queryStringFunction(params)}`, { headers })
        .then(
          response => {
            if (isCancelled()) {
              return;
            }

            this.setState({ response, promise: null });
          },
          error => {
            if (isCancelled()) {
              return;
            }

            this.setState({ error, promise: null });
          }
        )
    });
  }

  componentDidMount() {
    this.fetchFromProps();
  }

  componentWillReceiveProps({ url, params, headers, queryStringFunction }) {
    const {
      url: oldUrl, params: oldParams, headers: oldHeaders, queryStringFunction: oldQueryStringFunction
    } = this.props;

    // if the url, parameters, or headers changed, we need to start over
    if (
      url !== oldUrl || oldQueryStringFunction !== queryStringFunction || !deepEqual(params, oldParams) || !deepEqual(headers, oldHeaders)
    ) {
      this.fetchData({ url, params, headers, queryStringFunction });
    }
  }

  render() {
    const { children, propName } = this.props;

    return cloneElement(
      Children.only(children),
      { [ propName ]: this.state }
    );
  }
}