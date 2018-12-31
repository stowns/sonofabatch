sonofabatch
===========
Quickly add a batch endpoint to your ExpressJS app or provide a batch facade to an existing JSON REST service.

### usage

Attach the batch endpoint.
`````
const express = require('express')
const app = express();
const router = express.Router();
const SonOfABatch = require('sonofabatch');
const batch = new SonOfABatch();
const bodyParser = require('body-parser');

router.post('/batch', batch.call); // make sure you use .post()

app.use(bodyParser.json());
app.use('/', router);

app.listen(3000, () => console.log(`Batch-O-Matic is listening on port 3000!`));
``````

All other endpoints can now be called via the /batch endpoint by posting to it with a body such as the following
``````
{ 
  requests : 
    [
      {
        method : "GET",
        path :  "/accounts",
        query : { hello : "world" }
      },
      {
        method : "POST",
        path   : "/accounts",
        body   : { name : "Important Account" }
      }
    ]
}
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
      path :  "/accounts",
      query : { hello : "world" },
    },
    {
      method : "POST",
      path   : "/accounts",
      body   : { name : "Important Account" }
    }
  ]
};
``````

### as a batch proxy

sonofabatch can be used as batch middleware to proxy calls to existing JSON REST API services.  Below is a diagram of the use-case:
![sonofabatch proxy example](https://github.com/stowns/sonofabatch/blob/master/docs/sonofabatch.jpg?raw=true)

To configure sonofabatch as a batch proxy simply provide a serviceUrl in one of 3 places
  1. on instantiation of the middleware `new SonOfABatch({serviceUrl: 'http://myserviceurl:8080'});`
  2. in the root of the request made to the /batch endpoint. This applies to all calls defined in the request and also overrides 'serviceUrl' passed as a javascript option to `new SonOfABatch();`   
  
    ```
    { 
      serviceUrl: "http://myserviceurl:8080"
      requests : 
        [
          {
            method : "GET",
            path :  "/accounts",
            query : { hello : "world" }
          },
          {
            method : "POST",
            path   : "/accounts",
            body   : { name : "Important Account" }
          }
        ]
    }
    ```
    
  3. in each individual request (overrides `serviceUrl` passed via methods 1 and 2  
  
    ```
    { 
      requests : 
        [
          {
            serviceUrl: "http://myserviceurl1",
            method : "GET",
            path :  "/accounts",
            query : { hello : "world" }
          },
          {
            serviceUrl: "http://myserviceurl2",
            method : "POST",
            path   : "/accounts",
            body   : { name : "Important Account" }
          }
        ]
    }
    ```


### params
- serviceUrl: should include protocol:hostname:port
- mergeHeaders: will take the headers from the batch request and add them to the headers of each request defined in the payload
- protocol: only useful when not passing serviceUrl. will set the protocol used when defaulting to 127.0.0.1
- port: only useful when not passing serviceUrl. will set the port used when defaulting to 127.0.0.1

### TODO
- add tests
- more meaningful error messaging
