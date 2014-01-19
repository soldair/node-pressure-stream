pressure-stream
====================

call an async function for each data event into through stream. manage concurrency as back pressure.


```js
var pressure = require('pressure-stream');
var split = require('split');
var request = require('request');

process.stdin.pipe(split())
.pipe(pressure(function(url,cb){
  
  request(url)
},{max:100})).pipe(process.stdout);


```
