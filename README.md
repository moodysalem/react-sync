# [react-sync](http://moodysalem.github.io/react-sync)
A declarative approach to fetching data via jQuery's $.ajax function inspired by Backbone Models and Collections.

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
| fetchOnMount | Boolean | No | True | Whether the component does a GET to refresh its data at the URL when mounted. |
| fetchOnNewProps | Boolean | No | True | Whether the component does another GET to refresh its data when properties change that would cause the URL to change |
| params | Object | No | null | Query parameters to be passed when fetching the resource. |
| traditionalParams | Boolean | No | True | Pass true to do traditional serialization of the query parameters. |
| count | Number | No | null | Pass count to indicate the number of results to return. The name of the query parameter comes from the next property. |
| countParam | String | No | count | The name of the query parameter that is used to tell the server how many records to fetch. |
| start | Number | No | null | Pass start to indicate the number of the record to retrieve to the server. |
| startParam | String | No | start | The name of the parameter that is used to tell the server the first record to fetch. |
| sorts | Array of Object | No | null | A list of sorts that should be applied to the collection when fetched from the server. |
| sortInfoSeparator | String | No | Pipe | The character used to separate the sort direction (A or D) from the sort attribute |
| sortParam | String | No | sort | The name of the query parameter that is used to tell the server the sort orders. |
| onCreate | Function | No | null | A function to be called when a POST request is successful |
| onRead | Function | No | null | A function to be called when a GET request is successful |
| onUpdate | Function | No | null | A function to be called when a PUT request is successful |
| onDelete | Function | No | null | A function to be called when a DELETE request is successful |
| onError | Function | No | null | A function to be called when any request fails |
| ajaxOptions | Object | No | null | An object to pass to the $.ajax call. Success and error methods are overridden. |


### Methods
#### fetch()
Triggers the component to fetch the data. Useful when fetchOnMount or fetchOnNewProps are not set to true.

#### doDelete()
Trigger a delete request on the endpoint

#### doSave()
Trigger a POST or PUT depending on whether the ID property is set

### Child Properties

The child of this component receives the following properties:

| Property | Type | Description |
| -------- | ---- | ----------- |
| data | Any | The data received from the server |
| fetched | Boolean | Whether the data has ever been fetched from the server. |
| loading | Boolean | Whether a request is being processed. |

### Child Callbacks
The child also receives the following callbacks to trigger actions on its parent.

onSave: onSave
onDelete: doDelete

# Nesting
If you need a child component to fetch data from multiple sources, you should compose the components with custom components
to pass down the properties data, fetched, loading, etc. using different property names. E.g. one component would take
data and pass it to its child as todoData, and another would pass it down as userData.