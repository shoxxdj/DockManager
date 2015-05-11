var waitforit = require('../'),
    assert = require('assert'),
    fs = require('fs');

describe('reading files from the filesystem', function() {
    it('should return the contents of those 3 files', function(done) {
        var arr = ['a','b','c'];
        var waiter = waitforit(function(err, results) {
            if (err) {
                console.log(err.stack);
            }
            arr.forEach(function(key) {
                assert(results[key] && results[key].match("text " + key), "Resulsts of file read don't match for " + key);
            });
            done();
        });
        arr.forEach(function(key) {
            fs.readFile('./test/mock/' + key + '.txt', 'utf-8', waiter(key));
        });
    });
});
