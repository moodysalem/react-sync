'use strict';

var React = require('react');
var rs = React.createFactory(require('./index.js'));
var rtu = require('react-addons-test-utils');
var assert = require('assert');

var renderer = rtu.createRenderer();
var d = React.DOM;

var SOME_API_URL = 'http://localhost:3000';
var SOME_OTHER_API_URL = 'http://localhost:3001';

it('passes the appropriate props to the child component', function () {
  renderer.render(rs({
    rootUrl: SOME_API_URL,
    notRecognized: 'notused'
  }, d.div({ abc: 'test' }, 'hello')));
  var out = renderer.getRenderOutput();

  assert(out.type === 'div');
  assert(out.props.children === 'hello');
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
  renderer.render(rs({
    rootUrl: SOME_API_URL,
    notRecognized: 'notused',
    dataName: 'client'
  }, d.div({ abc: 'test' }, 'hello')));
  var out = renderer.getRenderOutput();

  assert(out.type === 'div');
  assert(out.props.children === 'hello');
  assert(out.props.abc === 'test');
  assert(out.props.notRecognized === 'notused');
  assert(out.props.clientData === null);
  assert(out.props.clientFetched === false);
  assert(out.props.clientLoading=== false);
  assert(typeof out.props.doCreateClient === 'function');
  assert(typeof out.props.doReadClient === 'function');
  assert(typeof out.props.doUpdateClient === 'function');
  assert(typeof out.props.doDeleteClient === 'function');
});

it('should be nestable', function () {
  renderer.render(rs({
    rootUrl: SOME_API_URL,
    notRecognized: 'notused',
    dataName: 'client'
  }, rs({
    rootUrl: SOME_OTHER_API_URL,
    otherProp: 'not prop',
    dataName: 'message'
  }, d.div({ abc: 'test' }, 'hello'))));
  var out = renderer.getRenderOutput();

  // it's hard to make accurate assertions here because the test utils currently only go one level deep
});