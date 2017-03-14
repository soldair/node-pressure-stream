pressure-stream
====================

call an async function for each data event into through stream. manage concurrency as back pressure.


```js
var pressure = require('pressure-stream');
var split = require('split2');
var request = require('request');


var concurrency = 100  // never ever do more than 100 requests at a time.

process.stdin.pipe(split())
.pipe(pressure(function(data,cb){
  request(data,function(err,res,body){
    cb(err,body)
  });
},concurrency)).pipe(process.stdout);


```



API
===

pressure(fn,opts)
-----------------
  - fn is the data handler it is always called with 2 arguments
    - fn(data,cb)
  - when you are done with the the handler call cb(err,data)
    - if err is passed back with cb "error" will be emitted on the stream
    - data passed back on this stream will be emited as data


options
-------
  - concurrency
    - the maximum number of concurrent data handlers the stream will execute.
    - defaults to 10
