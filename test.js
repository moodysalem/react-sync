'use strict';

var React = require('react');
var rs = React.createFactory(require('./index.js'));
var rtu = require('react-addons-test-utils');

var assert = require('assert');

var renderer = rtu.createRenderer();
var d = React.DOM;

describe('#render()', function () {
  it('should just render the child component', function () {
    renderer.render(rs({}, d.div({}, 'Some Text')));
    var out = renderer.getRenderOutput();
    assert(out.type === 'div');
    assert(typeof out.props === 'object');
  });
});