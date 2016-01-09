'use strict';
var assert = require('assert');

var React = require('react');
var portfinder = require('portfinder');
var request = require('superagent');
var joinUrl = require('url-join');
var d = React.DOM;
var ReactSync = React.createFactory(require('./index.js'));

// create a json server to use for the tests
var jsonServer = require('json-server');

// logger, static, cors and no-cache
var apiServer = jsonServer.create();
apiServer.use(jsonServer.defaults());

// use the test-db file for the db
var router = jsonServer.router('test-db.json');
apiServer.use(router);

describe('ReactSync', function () {

  var API_URL, POSTS_URL;
  var servceInstance;

  before(function (done) {
    // find an open port
    portfinder.getPort(function (err, port) {
      if (err) {
        throw Error('could not find open port');
      }

      // start the server
      servceInstance = apiServer.listen(port);
      API_URL = 'http://localhost:' + port;
      POSTS_URL = joinUrl(API_URL, 'posts');
      console.log('listening on ' + API_URL);
      done();
    });
  });

  after(function (done) {
    console.log('stopping server');
    servceInstance.close();
    done();
  });


  describe('the json-server API', function  () {

    it('should have posts resource', function (done) {
      console.log('fetching', API_URL +'/posts');
      request.get(API_URL +'/posts', function (err, res) {
        if (err) {
          throw Error('Failed to get response');
        } else {
          assert(res.body && res.body.length > 0);
          done();
        }
      });
    });

  });

  describe('property behavior and naming', function () {
    var ReactTestUtils = require('react-addons-test-utils');
    var renderer = ReactTestUtils.createRenderer();

    it('passes the appropriate props to the child component', function () {
      renderer.render(ReactSync({
        url: POSTS_URL,
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
        url: POSTS_URL,
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

});
