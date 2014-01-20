var through = require('through');

// call an async function. manage concurrency as backpressure.

module.exports = function(fn,opts){
  opts = opts||{};
  var max = opts.max;
  var q = [];
  var highWaterMark = opts.high||opts.highWaterMark||Infinity;
  var lowWaterMark = opts.low||opts.lowWaterMark||highWaterMark;

  if(highWaterMark > max) highWaterMark = max;

  var s;
  var runfn = function(){
    if(!q.length) return;
    var data = q.shift();
    s.pressure++;
    checkp();
    fn(data,function(err,data){
      if(err) s.emit('error',err);
      if(data) s.queue(data);
      s.pressure--;
      checkp();
    });
    return true;
  }

  s = through(function(data){
    var z = this;
    q.push(data);
    if(z.pressure < max) runfn();
  });

  s.maxq = q;

  var checkp = function(){
    if(s.paused) {
      if(s.pressure <= lowWaterMark){
        s.resume();
        while(!s.paused && runfn()); 
      }
    } else if(s.pressure >= highWaterMark){
      s.pause();
    }
  }

  s.pressure = 0;

  return s;
}
