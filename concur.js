function thread (f) {
  f = f();
  thread.ready.push(this);

  this.run = (function* () {
    while (1) {
      var status = f.next();
      if (status.done) break;
      yield
    }
  })();
}

thread.ready = [];
thread.current = null;
thread.running = false;
thread.manager = function () {
  var c_switch = false;
  while (1) {
    if (c_switch || !thread.current) {
      if (thread.current) thread.ready.push(thread.current);
      thread.current = thread.ready.shift();
      c_switch = false;
    }

    var st = new Date();
    var status = thread.current.run.next();
    var end = new Date();

    if (status.done) {
      thread.current = null;
      if (!thread.ready.length) break;
    }

    if (end - st >= 1) {
      c_switch = true;
    }
  }
};

new thread(function* () {
  var i = 0;                yield
  while (i < 50) {          yield
    console.log("== ping"); yield
    i++;                    yield
  }
});

new thread(function* () {
  var i = 0;                yield
  while (i < 50) {          yield
    console.log("pong =="); yield
    i++;                    yield
  }
});

thread.manager();
