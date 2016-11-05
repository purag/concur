function thread (f) {
  f = f();
  var waiting;
  var status;
  thread.ready.push(this);

  this.run = (function* () {
    while (1) {
      var status = f.next();
      if (status.done) break;
      yield
    }
  })();

  this.join = function () {
    if (status == "finished") return;
    waiting = thread.current;
    thread.current = null;
  };

  this.finish = function () {
    if (waiting) thread.ready.push(waiting);
    thread.current = null;
    status = "finished";
  };
}

thread.ready = [];
thread.current = null;
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
      thread.current.finish();
      if (!thread.ready.length) break;
    }

    if (end - st >= 1 || !thread.current) {
      c_switch = true;
    }
  }
};

module.exports = thread;
