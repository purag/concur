# concur
A user-level threading library for JavaScript

## try it out
```
node concur.js
```

You can try running `concur.js` a few times and see different results each time as it context switches on a timer!

## how it works
Currently, each thread is just a generator function which `yield`s at any point (between any two statements). we drop back into a thread manager which checks how much time elapsed, and if it's beyond the threshold of 1ms, we context switch. threads are scheduled in FIFO order. additionally, once a thread finishes (returns from the function rather than yield), we stop scheduling it (duh).

## caveats
Technically this is non-preemptive scheduling, since if we had no `yield`s the threads would run in full. But the plan is to write a compiler that will look for specific directives and spit out a file with yields following every statement/expression, allowing for random context switches at any time.

## TODO
* implement `join`
* implement `fork`
* remove the need to call `thread.manager()`
* implement `finish`
* better scheduling algo!
* write a compiler from js to concur-ready js

## why?
I'm currently taking an operating systems class at UC San Diego where we learned about user- and kernel-level threads. I wanted to try my hand at user-level threads in JavaScript, since it could probably be pretty useful.
