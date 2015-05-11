# wait for it..
A simple module for parallel execution with a shared complete callback.

You can use it basically any time you have more than one events that need to
happen before you take action, where it is not important which event happens
first.

Examples:
- doing more than one database call where the results don't depend on each other
- reading multiple files from disk
- doing two web requests at the same time

Note: It should work in the browser as well, but hasn't been packaged yet for easy
usage, nor has it been tested very thoroughly.

### Usage:

Install using:
```
npm install waitforit
```

Start two async calls that can run in parallel:
```javascript
var waitforit = require('waitforit');

var wait = waitforit(function(err) {
    console.log("Complete called");
});

var first = wait();
setTimeout(function() {
    first();
}, Math.random() * 1000);

var second = wait();
setTimeout(function() {
    second();
}, Math.random() * 1000);
```

Have the callbacks return results:
```javascript
var wait = waitforit(function(err, results) {
    console.log("Complete called with results: ", results);
    // results will be {"key 1": "value 1", "key 2": "value 2"}
});

var first = wait('key 1');
setTimeout(function() {
    first('value 1');
}, Math.random() * 1000);

var second = wait('key 2');
setTimeout(function() {
    second('value 2');
}, Math.random() * 1000);
```

Sometimes you might not have generated all the async handlers right away, or you want to have
the handlers called multiple times (with the last result overriding the previous) you can
control whether or not you're done by returning a boolean for whether or not it's done in the
complete callback.
```javascript
var wait = waitforit(function(err, results) {
    if (!results.key1 || !results.key2) {
        return false;
    }
    // do something with the results
});
```

In many cases you can just pass the async handlers straight into async calls, eg. with reading
files, you can do something like:
```javascript
var fs = require('fs'),
    waitforit = require('waitforit');

var wait = waitforit(function(err, files) {
    if (err) {
        throw new Error("couldn't really read any files");
    }
    // do something with files.file1, files.file2
});

fs.readFile('file1.txt', 'utf-8', wait('file1'));
fs.readFile('file2.txt', 'utf-8', wait('file2'));
```

Note that the final callback will be called immediately if any of the async handlers get passed
an error.

### License
MIT

### TODO:
- maybe support cancelling?
