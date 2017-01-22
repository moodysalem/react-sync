# [![Build Status](https://travis-ci.org/moodysalem/react-sync.svg)](https://travis-ci.org/moodysalem/react-sync) [![npm version](https://img.shields.io/npm/v/react-sync.svg)](https://www.npmjs.com/package/react-sync) react-sync


A declarative approach to fetching data using [HTML5 Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

## Status
This project has been rewritten between versions 0.5 to 0.6 to be only responsible for fetching data. A demo is available in the [index.html](https://github.com/moodysalem/react-sync/blob/gh-pages/index.html) file.

I believe in its current state it's stable and ready to be used (v0.6.4)

## Purpose
`react-sync` provides a single higher order component used for retrieving data from your APIs. Manipulating and rendering the data is your responsibility, but refreshing the data from the API is as simple as changing a prop.

## Size
The source is relatively short and very easy to understand (< 100 LOC) and the UMD module is < 15kb before compression or minification!

## API
See [props.jsx](https://github.com/moodysalem/react-sync/blob/gh-pages/src/props.jsx) for an annotated description of the props accepted by this component

## Install
`npm install --save react-sync`

OR

`yarn add react-sync`

Alternately this project builds to a UMD module named ReactSync, so you can include a rawgit script tag in your page e.g. v0.6.4: 

`<script src="https://cdn.rawgit.com/moodysalem/react-sync/ef1770eb582abe6da474134e0c663233833275e4/dist/react-sync.js" type="text/javascript"></script>`

If you have included the script as a tag on the page and are not using webpack, then you should look for `window.ReactSync`

## Usage
See the [demo source](https://github.com/moodysalem/react-sync/blob/gh-pages/index.html#L43) for example.

## Patterns
Composition is king when using this component. 

For example, want to automatically refetch every minute? 
Create a component that wraps ReactSync and updates a timestamp query parameter every minute.

    import React, { PureComponent } from "react";
    import Sync from "react-sync";
    
    const now = () => (new Date()).getTime();
    
    export default class RefreshSync extends PureComponent {
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
        const { refreshEvery, resource, ...rest } = this.props,
          { _ts } = this.state;
    
        return <Sync {...rest} resource={{ ...resource, params: { ...resource.params, _ts } }}/>;
      }
    }
    
What about attaching a token from the context to all requests?

    import React, { PureComponent } from "react";
    import Sync from "react-sync";
    
    export default class AuthenticateSync extends PureComponent {
      static contextTypes = {
        token: PropTypes.string
      };
    
      render() {
        const { resource: { headers, ...resource }, ...rest } = this.props,
          { token } = this.context;
    
        return (
          <Sync {...rest}
                resource={{
                  ...resource,
                  headers: {
                    ...headers,
                    Authorization: token ? `Bearer ${token}` : null
                  }
                }}/>
        );
      }
    }
    
How about just defaulting a base URL?

    import React, { PureComponent } from "react";
    import Sync from "react-sync";
    import join from "url-join";
    
    export const MyApiSync = ({ path, resource, ...rest }) => (
      <Sync {...rest} resource={{ ...resource, url: join('https://my-api.com', path) }}/>
    );
