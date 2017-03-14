var test = require('tape');
var pressure = require('../');


test("can do exactly as many things as i expect",function(t){
  t.plan(2);

  var c = 0,q = [];
  var s = pressure(function(data,cb){
    q.push(function(){
      cb(false,data);
    });
  },{low:2,high:3});
  
  s.write(1)
  s.write(2)
  s.write(3)
  //t.ok(s.paused,'hit highWaterMark should be paused');
  s.once('data',function(i){
    t.equals(i,1,'should be the first event');
  })
  q.shift()();
  //t.ok(!s.paused,'hit lowWaterMark should resume');
  s.once('data',function(i){
    t.equals(i,2,'should be the second event');
  })
  q.shift()();
});

test("does enforce max",function(t){
  var calls = 0,q = [];

  var s = pressure(function(data,cb){
    console.log('-->got data',data)
    calls++;
    q.push(function(){
      console.log('-->calling ',4)
      cb(false,data);
    });
  },{max:3});

  s.write(1); 
  s.write(2);
  s.write(3);
  s.write(4);
  s.write(5);
  s.write(6);
  s.write(7);
  s.write(8);

  t.equals(calls,3,"must have only sent 3 data events");

  // complete a single job.
  q.shift()();

  // should get one more event.
  t.equals(calls,4,"must have only sent 4 data events");

  console.log(q.length)
  // complete a single job.
  q.shift()();

  // should get one more event.
  t.equals(calls,5,"must have sent 5 data events");
  t.end();


})





