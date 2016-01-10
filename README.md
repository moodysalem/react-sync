# [react-sync](http://moodysalem.github.io/react-sync)
[![Build Status](https://travis-ci.org/moodysalem/react-sync.svg)](https://travis-ci.org/moodysalem/react-sync)
[![npm version](https://img.shields.io/npm/v/react-sync.svg)](https://www.npmjs.com/package/react-sync)

A declarative approach to fetching data via [superagent](https://github.com/visionmedia/superagent)

# Install
    npm install --save react-sync

# Stability
The API for this component is still undergoing change, but is nearly final. Some remaining questions are:

* Should there be options to use this component in such a way that the child can control query parameters,
sorting and pagination?
* Should the host property be separate from the path?

# Size
The distributed build includes several polyfills, e.g. for Promise and Object.assign and weighs in at ~25kb.

# Component Usage

### Code
    var React = require('react');
    var ReactDOM = require('react-dom');
    var reactSync = React.createFactory(require('react-sync'));
    ReactDOM.render(reactSync({
        url: 'myrestfulresource'
    }, myComponentThatNeedsData({ aProp: 'example' })), document.getElementById('app'));

### Properties

The properties can be thematically split into three categories: parameters that you'll customize per API, parameters
that you'll customize for each resource, and parameters that you'll customize per instance.

You should use wrapper components to create this hierarchy.

#### API level properties

| Property | Type | Required | Default | Usage |
| -------- | ---- | -------- | ------- | ----- |
| countParam | String | No | 'count' | The name of the query parameter that is used to tell the server how many records to fetch. |
| startParam | String | No | 'start' | The name of the parameter that is used to tell the server the first record to fetch. |
| sortParam | String | No | 'sort' | The name of the query parameter that is used to tell the server the sort orders. |
| ascendingText | String | No | 'A' | How ascending is represented in the sort query parameter |
| descendingText | String | No | 'D' | How descending is represented in the sort query parameter |
| sortInfoSeparator | String | No | '\|' | The character used to separate the sort direction (A or D) from the sort attribute |


#### Resource level properties

| Property | Type | Required | Default | Usage |
| -------- | ---- | -------- | ------- | ----- |
| dataName | String | No | null | Pass a name for the data, that will be used to get the names of the properties passed to the child component. |
| primaryKey | String | No | 'id' | The object attribute that uniquely identifies a record in the data set. |
| beforeCreate | Function | No | no-op | A function that is called to modify any POST request before it is made |
| beforeRead | Function | No | no-op | A function that is called to modify any GET request before it is made |
| beforeUpdate | Function | No | no-op | A function that is called to modify any PUT request before it is made |
| beforeDelete | Function | No | no-op | A function that is called to modify any DELETE request before it is made |

#### Instance level properties

| Property | Type | Required | Default | Usage |
| -------- | ---- | -------- | ------- | ----- |
| url  | String | Yes | None | Pass the URL of the resource used for all requests |
| initialData | Any | No | null | The data before any successful fetches occur |
| readOnMount | Boolean | No | true | Whether the component does a GET to refresh its data at the URL when mounted. |
| readOnUpdate | Boolean | No | true | Whether the component does another GET to refresh its data when properties change that would cause the URL or query parameters to change |
| params | Object | No | null | Query parameters to be passed when fetching the resource. |
| headers | Object | No | null | The headers to use in all requests |
| contentType | String | No | 'json' | How to serialize data in PUTs and POSTs |
| accept | String | No | 'json' | The accept header used in all requests |
| count | Number | No | null | Pass count to indicate the number of results to return. The name of the query parameter comes from the next property. |
| start | Number | No | null | Pass start to indicate the number of the record to retrieve to the server. |
| sorts | Array of Object | No | null | A list of sorts that should be applied to the collection when fetched from the server. |
| onCreate | Function | No | no-op | A function to be called when a POST request is successful |
| onRead | Function | No | no-op | A function to be called when a GET request is successful |
| onUpdate | Function | No | no-op | A function to be called when a PUT request is successful |
| onDelete | Function | No | no-op | A function to be called when a DELETE request is successful |
| onError | Function | No | no-op | A function to be called when any request fails |

### Methods
#### Promise doRead()
Triggers a new GET request to refresh the data from the URL.

Returns a promise that resolves to superagent's response object, and rejects with the error object.

#### Promise doCreate(data)
Trigger a POST to the URL with the data in the request body. The component does not use the response data. If you would
like to update the collection in response to a create event, you should trigger a read.

Returns a promise that resolves to superagent's response object, and rejects with the error object.

#### Promise doSave(data, \[primaryKey\])
Trigger a PUT to the URL with the data in the request body. If the primary key is specified, it will be joined to the
URL. In addition, if the primary key is specified, the response data will replace the object in the component's data.

Returns a promise that resolves to superagent's response object, and rejects with the error object.

#### Promise doDelete(\[primarKey\])
Trigger a DELETE to the URL with the data in the request body. If the primary key is specified, it will be joined to the
URL. On success, the appropriate data will be removed (the data corresponding to the primary key if specified, otherwise
all the component data.)

Returns a promise that resolves to superagent's response object, and rejects with the error object.

### Child Properties

The child of this component receives the following properties.

| Property | Type | Description |
| -------- | ---- | ----------- |
| [dataName]data | Any | The data received from the server |
| [dataName]fetched | Boolean | Whether the data has ever been fetched from the server. |
| [dataName]loading | Boolean | Whether a request is being processed. |
| doCreate[dataName] | Function | A reference to #doCreate |
| doRead[dataName] | Function | A reference to #doRead |
| doUpdate[dataName] | Function | A reference to #doUpdate |
| doDelete[dataName] | Function | A reference to #doDelete |

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
        url: 'myrestfulresource',
        dataName: 'resourceOne'
    }, reactSync({
        url: 'otherresource',
        dataName: 'resourceTwo'
    }, myComponentThatNeedsData({ aProp: 'example' }))), document.getElementById('app'));


## Suggested Architecture
You can use [react-default-props](https://www.npmjs.com/package/react-default-props) to easily create new components
from ReactSync with defaults depending on the API you're accessing.

For data caching, you'll likely want to use [Service Workers](https://jakearchibald.github.io/isserviceworkerready/).