var waitforit = require('../'),
    assert = require('assert');

describe('generating a new instance', function() {
    describe('where every callback takes place in the same tick', function() {
        it('should call the complete callback', function(done) {
            var waiter = waitforit(function() {
                done();
            });
            waiter()();
            waiter()();
        });
        it('should only call the complete callback once', function(done) {
            var i = 0;
            var waiter = waitforit(function(obj) {
                i++;
            });
            waiter()();
            waiter()();
            setTimeout(function() {
                assert(i === 1, "Callback called more than once");
                done();
            }, 20);
        });
    });

    describe('where nexts are given names', function() {
        describe('that don\'t get values', function() {
            describe('complete', function() {
                it('should have two keys with undefined', function(done) {
                    var waiter = waitforit(function(err, args) {
                        assert(Object.keys(args).length == 2, "Arguments don't have two keys");
                        assert(args["a"] === undefined && args["b"] === undefined, "Arguments aren't undefined");
                        done();
                    });
                    waiter("a")();
                    waiter("b")();
                });
            });

            describe('complete', function() {
                it('should have two keys with the values 5 & 7 and itself as the context', function(done) {
                    var func;
                    var waiter = waitforit(func = function(err, args) {
                        assert(this === func, "Context is not the funciton itself");
                        assert(Object.keys(args).length == 2, "Arguments don't have two keys");
                        assert(args["a"] === 5 && args["b"] === 7, "Arguments don't have the rigth values");
                        done();
                    });
                    waiter("a")(null, 5);
                    waiter("b")(null, 7);
                });
                it('should get called with an error result on error', function(done) {
                    var waiter = waitforit(function(err, args) {
                        assert(!!err && err instanceof Error, "Callback wasn't called with an error result");
                        done();
                    });
                    waiter("a")(new Error("some error"), 5);
                    waiter("b")(null, 7);
                });
                it('should be able to control when it\'s done with a result value', function(done) {
                    var waiter = waitforit(function(err, args) {
                        if (args.b === 7) {
                            done();
                            return;
                        }
                        return false;
                        done();
                    });
                    waiter("a")(null, 5);
                    setTimeout(function() {
                        waiter("b")(null, 7);
                    }, 20);
                });
            });
        });
    });
});

// TODO: test callbacks in async calls
// TODO: test that the callback's context is itself
