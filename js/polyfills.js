(function () {
    'use strict';
    var i;
    if (!Array.prototype.findIndex) {
        Array.prototype.findIndex = function (predicate) {
            if (this === null) {
                throw new TypeError('Array.prototype.findIndex called on null or undefined');
            }
            if (typeof predicate !== 'function') {
                throw new TypeError('predicate must be a function');
            }
            var list = this,
                length = list.length,
                value;
            
            for (i = 0; i < length; i += 1) {
                value = list[i];
                if (predicate.call(this, value, i, list)) {
                    return i;
                }
            }
            return -1;
        };
    }
}());