import { PropTypes } from "react";
import qs from "./query-string";

export const types = {
  // the name of the prop passed down to the child
  propName: PropTypes.string,

  // The base URL without any query parameters
  url: PropTypes.string.isRequired,

  ///////////////////// OPTIONAL //////////////////////////////

  // The headers to include in all requests
  headers: PropTypes.object,

  // The query parameters to include in GET requests
  params: PropTypes.object,

  // converts an object to a query string for the url
  queryStringFunction: PropTypes.func
};

export const defaults = {
  propName: 'sync',
  headers: null,
  params: null,
  queryStringFunction: qs
};
