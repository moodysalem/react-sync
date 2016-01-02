'use strict';

var React = require('react');
var rs = React.createFactory(require('./index.js'));
var rtu = require('react-addons-test-utils');

var assert = require('assert');

var renderer = rtu.createRenderer();
var d = React.DOM;

var GMAP_API = 'https://maps.googleapis.com/maps/api/geocode/json?address=Oxford%20University,%20uk&sensor=false';

describe('#render()', function () {
  it('should just render the child component', function () {
    renderer.render(
      rs({
        rootUrl: GMAP_API
      }, React.createElement(React.createClass({
        displayName: 'Display Info',

        render: function () {
          return d.div({}, 'some text');
        }
      }))));
    var out = renderer.getRenderOutput();
    assert(typeof out.props === 'object');
  });
});