import { PropTypes } from "react";
import queryStringFunction from "./query-string";

export const types = {
  // the name of the prop passed down to the child
  propName: PropTypes.string,

  resource: PropTypes.shape({
    // The base URL without any query parameters
    url: PropTypes.string.isRequired,

    // The headers to include
    headers: PropTypes.object,

    // The query parameters to include in GET requests
    params: PropTypes.object
  }).isRequired,

  fetchConfig: PropTypes.shape({
    // converts an object to a query string for the url
    queryStringFunction: PropTypes.func.isRequired,

    // takes a fetch response and returns a promise that resolves to the data in the response
    // also deals with handling invalid responses
    toData: PropTypes.func.isRequired
  })
};

export const defaults = {
  propName: 'sync',

  fetchConfig: {
    queryStringFunction,
    toData: response => {
      if (response.status === 200) {
        return response.json();
      }

      return Promise.reject(new Error(`Received response status ${response.status}!`));
    }
  }
};
