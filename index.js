'use strict';
const from = require('from2');

module.exports = x => {
	if (Array.isArray(x)) {
		x = x.slice();
	}

	const iterate = x[Symbol.iterator] && typeof x !== 'string' && !Buffer.isBuffer(x);
	const iterator = iterate ? x[Symbol.iterator]() : null;

	return from((size, cb) => {
		if (iterate) {
			const obj = iterator.next();
			cb(null, obj.done ? null : obj.value);
			return;
		}

		if (x.length === 0) {
			cb(null, null);
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

	const iterator = x[Symbol.iterator] ? x[Symbol.iterator]() : null;

	return from.obj(function (size, cb) {
		if (iterator) {
			const obj = iterator.next();
			cb(null, obj.done ? null : obj.value);
			return;
		}

		this.push(x);

		setImmediate(cb, null, null);
	});
};
