import toQueryString from './toQueryString';
import * as React from 'react';


/**
 * This is the object that is passed down to the children function
 */
export interface StateType<TData> {
  promise: Promise<TData> | null;
  data: TData | null;
  error: Error | null
}

/**
 * This is the interface of the react-sync component
 */
export interface ReactSyncPropTypes<TData> {
  children: React.ComponentType<StateType<TData>>;
  url: string;
  headers?: HeadersInit;
  params?: object;
  toQueryString: (params: any) => string;
  toData: (response: Response) => Promise<TData>;
}

export const defaultProps: Pick<ReactSyncPropTypes<any>, 'toQueryString' | 'toData'> = {
  toQueryString,
  toData: response => {
    if (response.status === 200) {
      return response.json();
    }

    return Promise.reject(new Error(`Received response status ${response.status}!`));
  }
};
