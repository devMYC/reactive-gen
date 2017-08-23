'use strict';
exports.__esModule = true;
var Observable_1 = require("rxjs/Observable");
exports["default"] = function (genFn) { return function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return new Observable_1.Observable(function (observer$) {
        if (typeof genFn !== 'function' || !isGenerator(genFn())) {
            return observer$.error(new Error("Expecting generator function, but instead got \"" + (JSON.stringify(genFn) || String(genFn)) + "\""));
        }
        next(genFn.apply(void 0, args), observer$);
    });
}; };
var next = function (gen, observer$, data) {
    if (data === void 0) { data = undefined; }
    try {
        var _a = gen.next(data), done = _a.done, value_1 = _a.value;
        if (done) {
            observer$.complete();
            observer$.dispose();
        }
        if (isPromise(value_1)) {
            value_1
                .then(function (v) {
                observer$.next(v);
                setImmediate(function () { return next(gen, observer$, v); });
            })["catch"](function (e) { return observer$.error(e); });
        }
        else {
            observer$.next(value_1);
            setImmediate(function () { return next(gen, observer$, value_1); });
        }
    }
    catch (e) {
        observer$.error(e);
    }
};
var isGenerator = function (obj) {
    return Boolean(obj) &&
        typeof obj.next === 'function' &&
        typeof obj["return"] === 'function' &&
        typeof obj["throw"] === 'function';
};
var isPromise = function (obj) {
    return Boolean(obj) &&
        typeof obj.then === 'function' &&
        typeof obj["catch"] === 'function';
};
