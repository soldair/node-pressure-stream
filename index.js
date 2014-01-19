var through = require('through');

// call an async function. manage concurrency as backpressure.

module.exports = function(fn,opts){
  opts = opts||{};
  var highWaterMark = opts.max||opts.highWaterMark||100;
  var lowWaterMark = opts.min||opts.lowWaterMark||0;

  var s = through(function(data){
    var z = this;
    z.pressure++;
    checkp();
    fn(data,function(err,data){
      if(err) z.emit('error',err);
      if(data) z.queue(data);
      z.pressure--;
      checkp();
    });
  });

  var checkp = function(){
    if(s.paused) {
      if(s.pressure <= lowWaterMark){
        s.resume();
      }
    } else if(s.pressure >= highWaterMark){
      s.pause();
    }
    return true;
  }

  s.pressure = 0;

  return s;
}



