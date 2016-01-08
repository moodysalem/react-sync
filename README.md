# [react-sync](http://moodysalem.github.io/react-sync)
[![Build Status](https://travis-ci.org/moodysalem/react-sync.svg)](https://travis-ci.org/moodysalem/react-sync)
[![npm version](https://img.shields.io/npm/v/react-sync.svg)](https://www.npmjs.com/package/react-sync)

A declarative approach to fetching data via [superagent](https://github.com/visionmedia/superagent)

# Install
    npm install --save react-sync

# Component Usage

### Code
    var React = require('react');
    var ReactDOM = require('react-dom');
    var reactSync = React.createFactory(require('react-sync'));
    ReactDOM.render(reactSync({
        rootUrl: 'myrestfulresource'
    }, ...), document.getElementById('app'));

### Properties

| Property | Type | Required | Default | Usage |
| -------- | ---- | -------- | ------- | ----- |
| rootUrl  | String | Yes | None | Pass the root URL of the resource to be fetched |
| id | String or Number | No | null | Pass the ID of the model if this component is managing data for a single instance. |
| initialData | Any | No | null | The data before any successful fetches occur |
| dataName | String | No | null | Pass a name for the data, that will be used to get the names of the properties passed to the child component. |
| readOnMount | Boolean | No | True | Whether the component does a GET to refresh its data at the URL when mounted. |
| readOnUpdate | Boolean | No | True | Whether the component does another GET to refresh its data when properties change that would cause the URL or query parameters to change |
| params | Object | No | null | Query parameters to be passed when fetching the resource. |
| headers | Object | No | null | The headers to use in all requests |
| contentType | String | No | json | How to serialize data in PUTs and POSTs |
| accept | String | No | json | The accept header used in all requests |
| count | Number | No | null | Pass count to indicate the number of results to return. The name of the query parameter comes from the next property. |
| countParam | String | No | count | The name of the query parameter that is used to tell the server how many records to fetch. |
| start | Number | No | null | Pass start to indicate the number of the record to retrieve to the server. |
| startParam | String | No | start | The name of the parameter that is used to tell the server the first record to fetch. |
| sorts | Array of Object | No | null | A list of sorts that should be applied to the collection when fetched from the server. |
| sortInfoSeparator | String | No | Pipe | The character used to separate the sort direction (A or D) from the sort attribute |
| sortParam | String | No | sort | The name of the query parameter that is used to tell the server the sort orders. |
| onCreate | Function | No | no-op | A function to be called when a POST request is successful |
| onRead | Function | No | no-op | A function to be called when a GET request is successful |
| onUpdate | Function | No | no-op | A function to be called when a PUT request is successful |
| onDelete | Function | No | no-op | A function to be called when a DELETE request is successful |
| onError | Function | No | no-op | A function to be called when any request fails |


### Methods
#### doRead()
Triggers a new GET request to refresh the data

#### doCreate(data)
Trigger a POST to the URL with the data in the request body

#### doSave(data)
Trigger a PUT to the URL with the data in the request body

#### doDelete()
Trigger a DELETE to the URL with the data in the request body

### Child Properties

The child of this component receives the following properties.

| Property | Type | Description |
| -------- | ---- | ----------- |
| data | Any | The data received from the server |
| fetched | Boolean | Whether the data has ever been fetched from the server. |
| loading | Boolean | Whether a request is being processed. |
| doCreate | Function | A reference to #doCreate |
| doRead | Function | A reference to #doRead |
| doUpdate | Function | A reference to #doUpdate |
| doDelete | Function | A reference to #doDelete |

If the dataName property is provided, the 'data', 'fetched', and 'loading' properties will be capitalized and prefixed
by the dataName , while the 'doCreate', 'doRead', 'doUpdate' and 'doDelete' properties will be suffixed with the dataName.

e.g. with dataName of 'message', the property names would be messageData, messageFetched, messageLoading, doCreateMessage, doReadMessage...


# Fetching from multiple sources
You may need to fetch data from multiple sources. You can do so by composing a component of multiple react-sync elements
with different dataNames.

e.g. :

    var React = require('react');
    var ReactDOM = require('react-dom');
    var reactSync = React.createFactory(require('react-sync'));
    ReactDOM.render(reactSync({
        rootUrl: 'myrestfulresource',
        dataName: 'resourceOne'
    }, reactSync({
        rootUrl: 'otherresource',
        dataName: 'resourceTwo'
    }, ...)), document.getElementById('app'));
