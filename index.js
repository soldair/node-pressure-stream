var once = require('once')
var t2 = require('through2')


module.exports = function(handler,concurrency){
  if(typeof concurrency == 'object' && concurrency){
    concurrency = concurrency.high||concurrency.max
  }
  concurrency = concurrency||5

  var active = 0
  var blocked = false
  var s = t2.obj(function(chunk,enc,cb){
    active++
    if(active >= concurrency) {
      if(blocked) {
        console.warn('[WARNING] pressure-stream forced to do more work than allowed! '+active+' jobs')
        cb()
      } else blocked = cb
    } else {
      cb()
    }

    handler(chunk,once(function(err,data){
      if(err) s.emit('error'.err)
      if(data) s.push(data)

      active--
      if(active < concurrency && blocked) {
        var b = blocked
        blocked = false
        b()
      }
    }))
  })

  return s
}


