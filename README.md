# concur
A user-level threading library for JavaScript

## try it out
```
node test.js
```

You can try running `test.js` a few times and see different results each time as it context switches on a timer!

## how it works
Currently, each thread is just a generator function which `yield`s at any point (between any two statements). we drop back into a thread manager which checks how much time elapsed, and if it's beyond the threshold of 1ms, we context switch. threads are scheduled in FIFO order. additionally, once a thread finishes (returns from the function rather than yield), we stop scheduling it (duh).

## caveats
Technically this is non-preemptive scheduling, since if we had no `yield`s the threads would run in full. But the plan is to write a compiler that will look for specific directives and spit out a file with yields following every statement/expression, allowing for random context switches at any time.

## TODO
* ~~implement `join`~~
* implement `fork`
* remove the need to call `thread.manager()`
 * concur now stipulates that there be a main thread from which all other threads fork. it makes the code a bit nicer, and I may streamline the creation of the main thread in the future (so that it is more of a specialized thread than a normal one), which should take care of the call to `thread.manager()`.
* ~~implement `finish`~~
* better scheduling algo!
* write a compiler from js to concur-ready js

### ideas?
* implement `concur(context, func[, func[, ...func]])` to execute the argument functions concurrently. `context` is the shared context between the functions. each `func` takes a context as its sole argument.

## why?
I'm currently taking an operating systems class at UC San Diego where we learned about user- and kernel-level threads. I wanted to try my hand at user-level threads in JavaScript, since it could probably be pretty useful.
