const async = require('async');
const request = require('request');
const _ = require('lodash');

class SonOfABatch {
  
  constructor(opts) {
    this.opts = opts || {};

    // if the middleware is passed an explict host and port to default to, set it up.
    this.defaultServiceUrl = this.opts.serviceUrl;
    if (!this.defaultServiceUrl) {
      this.defaultServiceUrl = `${this.opts.protocol||'http'}://127.0.0.1`;
      if (this.opts.port) {
        this.defaultServiceUrl += `:${this.opts.port}`;
      }
    }

    _.bindAll(this, 'call');
  }

  call(req, res) {
    let execution = req.body.execution || 'parallel';
    let requests  = req.body.requests;
    // the serviceUrl can be passed at the top-level of the request and apply to all calls.
    let globalServiceUrl = req.body.serviceUrl;

    async.map(requests,
      (r, mapCb) => {
        let serviceUrl = r.serviceUrl
          ? r.serviceUrl
          : globalServiceUrl || this.defaultServiceUrl;

        let headers = r.headers;
        if (this.opts.mergeHeaders) {
          let headersToMerge = this.opts.mergeHeaders.split(',');
          headers = Object.assign({}, _.pick(req.headers, headersToMerge), r.headers);
        }

        let opts = {
          url     : `${serviceUrl}${r.path}`,
          method  : r.method,
          headers : headers,
          json    : true
        };

        if (r.query) {
          opts.qs = r.query;
        }
        if (r.body) {
          opts.body = r.body;
        }

        if (process.env.DEBUG) {
          console.log(JSON.stringify(opts,null,'\t'));
        }

        let composedCb = (callback) => {
          request(opts, (err, response, body) => {
            callback(err, body);
          });
        };
        
        mapCb(null, composedCb);
    },
    (err, calls) => {
      if (err) return res.sendStatus(500);

      async[execution](calls, (err, results) => {
        if (err) return res.sendStatus(500);

        res.send(results);
      })
    });
  }

}

module.exports = SonOfABatch;