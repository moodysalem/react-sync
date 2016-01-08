'use strict';
var assert = require('assert');

var React = require('react');
var ReactSync = React.createFactory(require('./index.js'));

var d = React.DOM;

describe('property behavior and naming', function () {
  var ReactTestUtils = require('react-addons-test-utils');
  var renderer = ReactTestUtils.createRenderer();

  var SOME_API_URL = '/api/test';

  it('passes the appropriate props to the child component', function () {
    renderer.render(ReactSync({
      rootUrl: SOME_API_URL,
      readOnMount: false,
      readOnUpdate: false,
      notRecognized: 'notused'
    }, d.div({ abc: 'test' })));
    var out = renderer.getRenderOutput();

    assert(out.type === 'div');
    assert(out.props.abc === 'test');
    assert(out.props.notRecognized === 'notused');
    assert(out.props.data === null);
    assert(out.props.fetched === false);
    assert(out.props.loading === false);
    assert(typeof out.props.doCreate === 'function');
    assert(typeof out.props.doRead === 'function');
    assert(typeof out.props.doUpdate === 'function');
    assert(typeof out.props.doDelete === 'function');
  });

  it('should use the dataName property', function () {
    renderer.render(ReactSync({
      rootUrl: SOME_API_URL,
      readOnMount: false,
      readOnUpdate: false,
      dataName: 'client'
    }, d.div({})));
    var out = renderer.getRenderOutput();

    assert(out.type === 'div');
    assert(out.props.clientData === null);
    assert(out.props.clientFetched === false);
    assert(out.props.clientLoading === false);
    assert(typeof out.props.doCreateClient === 'function');
    assert(typeof out.props.doReadClient === 'function');
    assert(typeof out.props.doUpdateClient === 'function');
    assert(typeof out.props.doDeleteClient === 'function');
  });
});


describe('fetching behavior', function () {

  it('should fetch data', function (done) {

    done();
  });

});