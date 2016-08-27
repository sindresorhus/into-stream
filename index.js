'use strict';
const from = require('from2');

module.exports = x => {
	if (Array.isArray(x)) {
		x = x.slice();
	}

	return from((size, cb) => {
		if (x.length === 0) {
			cb(null, null);
			return;
		}

		if (Array.isArray(x)) {
			cb(null, x.shift());
			return;
		}

		const chunk = x.slice(0, size);
		x = x.slice(size);

		setImmediate(cb, null, chunk);
	});
};

module.exports.obj = x => {
	if (Array.isArray(x)) {
		x = x.slice();
	}

	return from.obj(function (size, cb) {
		if (Array.isArray(x)) {
			if (x.length === 0) {
				cb(null, null);
				return;
			}

			cb(null, x.shift());
			return;
		}

		this.push(x);

		setImmediate(cb, null, null);
	});
};
