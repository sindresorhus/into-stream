'use strict';
var from = require('from2');

module.exports = function (x) {
	return from(function (size, next) {
		if (x.length === 0) {
			this.push(null);
			return;
		}

		if (Array.isArray(x)) {
			next(null, x.shift());
			return;
		}

		var chunk = x.slice(0, size);
		x = x.slice(size);
		next(null, chunk);
	});
};

module.exports.obj = function (x) {
	return from.obj(function (size, next) {
		if (Array.isArray(x)) {
			if (x.length === 0) {
				this.push(null);
				return;
			}

			next(null, x.shift());
			return;
		}

		this.push(x);
		next(null, null);
	});
};
