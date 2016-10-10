'use strict';
const from = require('from2');

module.exports = x => {
	if (Array.isArray(x)) {
		x = x.slice();
	}

	// We don't iterate on strings and buffers since slicing them is ~7x faster
	const shouldIterate = x[Symbol.iterator] && typeof x !== 'string' && !Buffer.isBuffer(x);
	const iterator = shouldIterate ? x[Symbol.iterator]() : null;

	return from((size, cb) => {
		if (shouldIterate) {
			const obj = iterator.next();
			setImmediate(cb, null, obj.done ? null : obj.value);
			return;
		}

		if (x.length === 0) {
			setImmediate(cb, null, null);
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
			setImmediate(cb, null, obj.done ? null : obj.value);
			return;
		}

		this.push(x);

		setImmediate(cb, null, null);
	});
};
