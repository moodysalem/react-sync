import React, { Children, cloneElement, PureComponent, PropTypes } from 'react';
import { types, defaults } from './props';

export default class ReactSync extends PureComponent {
  static propTypes = types;
  static defaultProps = defaults;

  state = {
    // The pending promise
    promise: null,
    // The data returned from fetching the URL
    data: null
  };

  render() {
    return cloneElement(
      Children.only(this.props.children),
      { syncState: this.state }
    );
  }
}