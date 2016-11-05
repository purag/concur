var thread = require("./concur.js");

var main = new thread(function * () {
  var ping = new thread(function* () {
    var i = 0;                yield
    while (i < 50) {          yield
      console.log("== ping"); yield
      i++;                    yield
    }
  }); yield

  var pong = new thread(function* () {
    var i = 0;                yield
    while (i < 50) {          yield
      console.log("pong =="); yield
      i++;                    yield
    }
  }); yield

  ping.join(); yield
  pong.join(); yield

  console.log("all finished!");
});

thread.manager();
