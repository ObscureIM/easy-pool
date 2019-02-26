var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};

app.use(allowCrossDomain)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"))
//Initialize the app


var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  })

var url = 'http://pool.obscure.im'
app.get('/stats',function(req,res) {
  var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

  var request = new XMLHttpRequest()
  url2 = url + '/stats'
  request.open('GET', url2 , true);
  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      // Success!
      var data = JSON.parse(request.responseText);
      res.send(data)
    } else {
      // We reached our target server, but it returned an error
      console.log("fail")
    }
  };
  request.send()
})
app.get('/stats_address',function(req,res) {
  //make a capp to /stats?address =
  var address = req.query.address
  var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
  var request = new XMLHttpRequest()
  url2 = url + '/stats_address?address=' + address
  request.open('GET', url2 , true);
  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      // Success!
      var data = JSON.parse(request.responseText);
      res.send(data)
    } else {
      // We reached our target server, but it returned an error
      console.log("fail")
    }
  };
  request.send()
})

app.get('/get_payments',function(req,res) {
  var time = req.query.time
  var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
  var request = new XMLHttpRequest()
  url2 = url + '/get_payments?time=' + time
  request.open('GET', url2 , true);
  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      // Success!
      var data = JSON.parse(request.responseText);
      res.send(data)
    } else {
      // We reached our target server, but it returned an error
      console.log("fail")
    }
  };
  request.send()
})

app.get('/get_miner_payout_level',function(req,res) {
  var address = req.query.addressError
  var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
  var request = new XMLHttpRequest()
  url2 = url + '/get_miner_payout_level?address=' + address
  request.open('GET', url2 , true);
  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      // Success!
      var data = JSON.parse(request.responseText);
      res.send(data)
    } else {
      // We reached our target server, but it returned an error
      console.log("fail")
    }
  };
  request.send()
})
