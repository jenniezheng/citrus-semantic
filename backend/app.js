var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var spawn = require('child_process').spawn
var index = require('./routes/index');
var http = require('http')


// const Combinator = require('./combinator.js')
// const combinator = new Combinator()
// console.log(combinator.combine("water", "grape", 6))


// view engine setup

var server = http.createServer(function (req, res) {

  var headers = {};
  headers["Access-Control-Allow-Origin"] = "*";
  headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
  headers["Access-Control-Allow-Credentials"] = true;
  headers["Access-Control-Max-Age"] = '86400'; // 24 hours
  headers["Access-Control-Allow-Headers"] = "X-Requested-With, Access-Control-Allow-Origin, X-HTTP-Method-Override, Content-Type, Authorization, Accept";
  res.writeHead(200, headers);
  res.end();
});

var io = require('socket.io')(server);


var numcons = 0;
var py = spawn('python', ['python/analogy.py']);
console.log("Hi!\n");
py.stdin.setEncoding('utf-8');

io.sockets.on('connection', function (socket) {
  numcons++;
  console.log("connection" , numcons);
  socket.on('calculateWord', function (res) {
    console.log("calculating")
    console.log(res)
    py.stdin.write(res['pos']+'\n');
    py.stdin.write(res['neg']+'\n');
  });
  py.stdout.on('end', function(){
    console.log("Exited")
  });
  py.stderr.on('data', function(data){
    result=data.toString();
    console.log("error: "+result);
  });
  py.stdout.on('data', function(data){
    result=data.toString();
    console.log("result: "+result);
    socket.emit('wordResult', result);
  });
  socket.on('disconnect', function () {
    numcons--;
    console.log("closed connection, curr: ", numcons)
  });
});



server.listen(process.env.PORT, process.env.IP,function(){
  console.log("App started on localhost:"+process.env.PORT);
});
