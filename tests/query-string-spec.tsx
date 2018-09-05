import { describe, it } from 'mocha';
import toQueryString from '../src/toQueryString';
import { expect } from 'chai';

describe('toQueryString', () => {
  it('returns empty strings with empty inputs', () => {
    expect(toQueryString(null)).to.eq('');
    expect(toQueryString('string')).to.eq('');
    expect(toQueryString(1)).to.eq('');
    expect(toQueryString({})).to.eq('');
  });

  it('stringifies objects', () => {
    expect(toQueryString({ abc: '123' })).to.eq('abc=123');
    expect(toQueryString({ abc: '123', def: 'green' })).to.eq('abc=123&def=green');
  });

  it('encodes keys and values', () => {
    const val = '12&!@%(!%)(*^';
    expect(toQueryString({ [ val ]: val })).to.eq(`${encodeURIComponent(val)}=${encodeURIComponent(val)}`);
  });

  it('repeats keys for array values', () => {
    expect(toQueryString({ arr: [ 1, 2, 3 ], blue: 123 })).to.eq(`arr=1&arr=2&arr=3&blue=123`);
  });
});