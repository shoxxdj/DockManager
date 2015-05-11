var nextTick = (process && process.nextTick) ? process.nextTick : function(cb) {
    setTimeout(cb, 0);
};

module.exports = function(complete) {
    var generated = [],
        called = {},
        args = {},
        completeCalled = false,
        ids = 0;

    return function(key) {
        var index = ids++;
        generated.push(index);

        return function(err, value) {
            if (completeCalled) return;

            if (err) {
                complete.call(complete, err);
                completeCalled = true;
                return;
            }
            called[index] = true;

            if (key !== undefined) {
                args[key] = value;
            }

            nextTick(function() {
                if (completeCalled || !allCalled(generated, called)) {
                    return;
                }

                var result = complete.call(complete, null, args);
                completeCalled = result === undefined ? true : result;
            });
        };
    };
};

function allCalled(generated, called) {
    for (var i = 0, l = generated.length; i < l; i++) {
        if (!called[generated[i]]) {
            return false;
        }
    }
    return true;
}

