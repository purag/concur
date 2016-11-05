/* Constructor for user-level threads */
function thread (f) {
  // Create the generator function
  f = f();

  var waiting;
  var status;

  // fork the thread
  thread.ready.push(this);

  this.run = (function* () {
    while (1) {
      var status = f.next();
      if (status.done) break;
      yield
    }
  })();

  // force the calling thread to wait for this thread to finish
  this.join = function () {
    if (status == "finished") return;
    waiting = thread.current;
    thread.current = null;
  };

  // let the waiting thread be scheduled again and clean up
  this.finish = function () {
    if (waiting) thread.ready.push(waiting);
    thread.current = null;
    status = "finished";
  };
}

// the ready queue
thread.ready = [];

// the currently executing thread
thread.current = null;

// ** where the magic happens **
// the thread manager -- schedules threads in FIFO order and preemptively context switches
// effectively a round-robin scheduler since we let threads for 1ms and then force a
//   context switch.
thread.manager = function () {
  var c_switch = false;
  while (1) {
    // if we need to context switch, or nothing is scheduled
    if (c_switch || !thread.current) {
      // tell the current thread to wait and schedule the next one
      if (thread.current) thread.ready.push(thread.current);
      thread.current = thread.ready.shift();
      c_switch = false;
    }

    // let the thread do some stuff
    var st = new Date();
    var status = thread.current.run.next();
    var end = new Date();

    // if it finished and no threads remain, end it all
    if (status.done) {
      thread.current.finish(); // TODO: thread.current could be null here?
      if (!thread.ready.length) break;
    }

    // otherwise, preempt the current thread if it ran for enough time
    // OR if the thread was forced to sleep somehow (thread.current == null)
    if (end - st >= 1 || !thread.current) {
      c_switch = true;
    }
  }
};

module.exports = thread;
