var test = require('tape');
var pressure = require('../');


test("can do exactly as many things as i expect",function(t){
  t.plan(4);

  var c = 0,q = [];
  var s = pressure(function(data,cb){
    q.push(function(){
      cb(false,data);
    });
  },{min:2,max:3});
  
  s.write(1)
  s.write(2)
  s.write(3)
  t.ok(s.paused,'hit highWaterMark should be paused');
  s.once('data',function(i){
    t.equals(i,1,'should be the first event');
  })
  q.shift()();
  t.ok(!s.paused,'hit lowWaterMark should resume');
  s.once('data',function(i){
    t.equals(i,2,'should be the second event');
  })
  q.shift()();
});




