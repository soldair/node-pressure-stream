pressure-stream
====================

call an async function for each data event into through stream. manage concurrency as back pressure.


```js
var pressure = require('pressure-stream');
var split = require('split');
var request = require('request');


// reading urls from stdin only do 2 requests at a time

process.stdin.pipe(split())
.pipe(pressure(function(data,cb){
  request(data,function(err,res,body){
    cb(err,body)
  });
},{max:2})).pipe(process.stdout);


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
  - max
    - the maximum number of concurrent data handlers the stream will execute.
    - defaults to no limit
  - high
    - the number of concurrent data handlers in progress before the stream will emit pause
  - low
    - the number of data handlers in progress the stream will wait for before resuming.
    - defaults to the same value as high
