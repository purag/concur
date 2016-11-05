# concur
A user-level threading library for JavaScript

## try it out
```
node concur.js
```

You can try running `concur.js` a few times and see different results each time as it context switches on a timer!

## caveats
Technically this is non-preemptive scheduling, since if we had no `yield`s the threads would run in full. But the plan is to write a compiler that will look for specific directives and spit out a file with yields following every statement/expression, allowing for random context switches at any time.

## TODO
* implement `join`
* implement `fork`
* remove the need to call `thread.manager()`
* implement `finish`
* better scheduling algo!
* write a compiler from js to concur-ready js
