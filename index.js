var async   = require('async'),
    request = require('request'),
    qs      = require('querystring'),
    _       = require('lodash');


function SonOfABatch(port) {
  this.hostAndPort = '://127.0.0.1:' + port;

  _.bindAll(this);
  return this;
};

SonOfABatch.prototype.call = function(req, res) {
  var _this     = this;
      execution = req.body.execution || 'parallel',
      requests  = req.body.requests;

  async.map(requests,
   function(r, mapCb) {
      var opts = {
        url    : req.protocol + _this.hostAndPort + r.path,
        method : r.method,
        qs     : r.body,
        body   : r.body,
        json   : true
      };

      var composedCb = function(callback) {
        request(opts, function(err, response, body) {
          callback(err, body);
        });
      };
      
      mapCb(null, composedCb);
   },
   function(err, calls){
    if (err) return res.send(500);

    async[execution](calls, function(err, results) {
      if (err) return res.send(500);

      res.send(results);
    })
  });
};

exports = module.exports = SonOfABatch;