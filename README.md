sonofabatch
===========
Quickly add a batch endpoint to your ExpressJS app.

###usage

Attach the batch endpoint.
`````
var express    = require('express'),
    router     = express.Router(),
    Batch      = require('sonofabatch'),
    batch      = new Batch(8080);

router.post('/batch', batch.call); // make sure you use .post()
``````

All other endpoints can now be called via the /batch endpoint by posting to it with a body such as the following
``````
{ requests : 
    [
      {
        method : "GET",
        body : { hello : "world" },
        path :  "/accounts"
      },
      {
        method : "POST",
        body   : { name : "Important Account" },
        path   : "/accounts"
      }
    ]
};
``````
You should always expect the response to return the results in the order which they were requested.


#### control flow

By default the calls with execute on the server in parallel.  However, if the calls need to be run in order an additional param is supported called 'execution'.

``````
{ 
  execution : "series", // defaults to "parallel"
  requests : 
  [
    {
      method : "GET",
      body : { hello : "world" },
      path :  "/accounts"
    },
    {
      method : "POST",
      body   : { name : "Important Account" },
      path   : "/accounts"
    }
  ]
};
``````

### TODO
- add tests
- header support
- more meaningful error messaging