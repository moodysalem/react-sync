import { PropTypes } from 'react';

export const types = {
  // The base URL without any query parameters
  url: PropTypes.string.isRequired,

  ///////////////////// OPTIONAL //////////////////////////////

  // The headers to include in all requests
  headers: PropTypes.object,

  // The accept header sent in all requests
  accept: PropTypes.string,

  // The query parameters to include in GET requests
  params: PropTypes.object,

  // The content-type used for request bodies in POST and PUT requests
  contentType: PropTypes.string
};

export const defaults = {
  primaryKey: 'id',
  headers: null,
  accept: 'json',
  params: null,
  contentType: 'json'
};
