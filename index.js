'use strict';
const from = require('from2');
const isIterable = require('is-iterable');

module.exports = x => {
	let iterator;

	if (Array.isArray(x)) {
		x = x.slice();
	} else if (!(x && x.slice) && isIterable(x)) {
		iterator = x[Symbol.iterator]();
	}

	return from((size, cb) => {
		if (iterator) {
			let obj = iterator.next();
			cb(null, obj.done ? null : obj.value);
			return;
		}

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
	let iterator;

	if (Array.isArray(x)) {
		x = x.slice();
	} else if (isIterable(x)) {
		iterator = x[Symbol.iterator]();
	}

	return from.obj(function (size, cb) {
		if (iterator) {
			let obj = iterator.next();
			cb(null, obj.done ? null : obj.value);
			return;
		}

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
