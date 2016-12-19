import qs from "../src/query-string";
import assert from "assert";

describe('qs', () => {
  it('returns empty strings when appropriate', () => {
    assert.equal(qs(null), '');
    assert.equal(qs('string'), '');
    assert.equal(qs(1), '');
    assert.equal(qs({}), '');
  });

  it('stringifies objects', () => {
    assert.equal(qs({ abc: '123' }), 'abc=123');
    assert.equal(qs({ abc: '123', def: 'green' }), 'abc=123&def=green');
  });

  it('encodes keys and values', () => {
    const val = '12&!@%(!%)(*^';
    assert.equal(qs({ [val]: val }), `${encodeURIComponent(val)}=${encodeURIComponent(val)}`);
  });

  it('repeats keys for array values', () => {
    assert.equal(qs({ arr: [ 1, 2, 3 ] }), `arr=1&arr=2&arr=3`);
  });
});