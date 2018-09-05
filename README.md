# [![Build Status](https://travis-ci.org/moodysalem/react-sync.svg)](https://travis-ci.org/moodysalem/react-sync) [![npm version](https://img.shields.io/npm/v/react-sync.svg)](https://www.npmjs.com/package/react-sync) react-sync

A declarative approach to fetching API data using [HTML5 Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

## Purpose
`react-sync` provides a single higher order component used for fetching data from your APIs
 
Rendering the data is your responsibility, but refreshing the data from the API is as simple as 
changing the parameters of your request. Let the component manage the state of fetching the data.

## ReactSync Props
|          Name          |                                                 Description                                                 |   Type   | Required |              Default             |
|:----------------------:|:-----------------------------------------------------------------------------------------------------------:|:--------:|:--------:|:--------------------------------:|
|           url          |                                The url to fetch without any query parameters                                |  string  |    Yes   |                                  |
|         headers        |                           Object containing all the headers to pass to the request                          |  object  |    No    |               `null`               |
|         params         |                      Object containing all the query parameters to pass to the request                      |  object  |    No    |               `null`               |
|        toQueryString   |                     Function used to convert the query parameters prop to a query string                    | function |    No    |          [./toQueryString.tsx](https://github.com/moodysalem/react-sync/blob/gh-pages/src/toQueryString.js)|
|         toData         | Function that takes a fetch response object and returns a promise that resolves to the data in the response | function |    No    | returns response JSON by default |
|        children        |           Function that takes an object `{promise, data, error}` and returns a node to be rendered          | function |    Yes   |                                  |            

Source: [props.tsx](https://github.com/moodysalem/react-sync/blob/gh-pages/src/props.jsx)

## Child Props

The function passed to the `children` prop receives the fetch state 

|   Name  |                     Description                     |        Type        |
|:-------:|:---------------------------------------------------:|:------------------:|
| promise | The pending promise if any requests are outstanding | instanceof Promise |
|   data  |       Data that has been fetched from the API       | result of `toData` |
|  error  |       Any fetch errors that may have occurred       |  instanceof Error  |


## Install
`npm install --save react-sync`

Alternately this project builds to a UMD module named ReactSync, so you can include a unpkg script tag in your page 

Look for `window.ReactSync` when importing the UMD module via a script tag

## Usage
See the [demo source](https://github.com/moodysalem/react-sync/blob/gh-pages/index.html) for example usage with filtering

```jsx harmony
import React from 'react';
import ReactSync from 'react-sync';

const StarGazers = ({ owner, repo, githubToken }) => (
  <ReactSync 
    url={`https://api.github.com/repos/${owner}/${repo}/stargazers`} 
    headers={{Authorization: `token ${githubToken}`}}>
    {
      ({ promise, data, error }) => (
        <span>
          {promise !== null ? 'Loading...' : data}      
        </span>
      )
    }
  </ReactSync>
);
```

## Patterns
Composition is king when using this component. 

For example, want to automatically refetch every minute? 
Create a component that wraps ReactSync and updates a timestamp query parameter every minute.

```jsx
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Sync from 'react-sync';

const now = () => (new Date()).getTime();

export default class RefreshSync extends Component {
  static propTypes = {
    refreshEvery: PropTypes.number
  };

  _timer = null;
  state = {
    _ts: now()
  };

  triggerNextRefresh = after => {
    clearTimeout(this._timer);
    this._timer = setTimeout(this.refresh, after);
  };

  refresh = () => {
    this.setState({ _ts: now() });
    this.triggerNextRefresh(this.props.refreshEvery);
  };

  componentDidMount() {
    this.triggerNextRefresh(this.props.refreshEvery);
  }

  componentWillReceiveProps({ refreshEvery }) {
    if (refreshEvery !== this.props.refreshEvery) {
      this.triggerNextRefresh(refreshEvery);
    }
  }

  render() {
    const { params, ...rest } = this.props,
      { _ts } = this.state;

    return <Sync {...rest} params={{ ...params, _ts }}/>;
  }
}
```

What about attaching a token from the context to all requests?

```jsx
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Sync from 'react-sync';

export default class AuthenticatedSync extends Component {
  static contextTypes = {
    token: PropTypes.string
  };

  render() {
    const { headers, ...rest } = this.props,
      { token } = this.context;

    return (
      <Sync
        {...rest}
        headers={{
          ...headers,
          Authorization: token ? `Bearer ${token}` : null
        }}
      />
    );
  }
}
```
    
How about just defaulting a base URL?

```jsx
import React from 'react';
import Sync from 'react-sync';

export const MyApiSync = ({ path, ...rest }) => (
  <Sync {...rest} url={[ 'https://my-api.com', path ].join('/')}/>
);
```
