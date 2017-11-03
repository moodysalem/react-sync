import { func, object, shape, string } from 'prop-types';
import toQueryString from './toQueryString';

export const propTypes = {
  // the child that is passed the state of the fetch
  children: func.isRequired,

  // The base URL without any query parameters
  url: string.isRequired,

  // The headers to include
  headers: object,

  // The query parameters to include in GET requests
  params: object,

  // converts an object to a query string for the url
  toQueryString: func.isRequired,

  // takes a fetch response and returns a promise that resolves to the data in the response
  // also deals with handling invalid responses
  toData: func.isRequired,
};

export const defaultProps = {
  toQueryString,
  toData: response => {
    if (response.status === 200) {
      return response.json();
    }

    return Promise.reject(new Error(`Received response status ${response.status}!`));
  }
};
