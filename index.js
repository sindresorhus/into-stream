'use strict';
const from = require('from2');
const pIsPromise = require('p-is-promise');

module.exports = input => {
	if (Array.isArray(input)) {
		input = input.slice();
	}

	let promise;
	let iterator;

	prepare(input);

	function prepare(value) {
		input = value;
		// Convert other buffer types to Buffer
		input = input instanceof ArrayBuffer ? Buffer.from(input) : input;
		input = !Buffer.isBuffer(input) && ArrayBuffer.isView(input) ? Buffer.from(input) : input;
		promise = pIsPromise(input) ? input : null;
		// We don't iterate on strings and buffers since slicing them is ~7x faster
		const shouldIterate = !promise && input[Symbol.iterator] && typeof input !== 'string' && !Buffer.isBuffer(input);
		iterator = shouldIterate ? input[Symbol.iterator]() : null;
	}

	return from(function reader(size, cb) {
		if (promise) {
			promise.then(prepare).then(() => reader.call(this, size, cb), cb);
			return;
		}

		if (iterator) {
			const obj = iterator.next();
			setImmediate(cb, null, obj.done ? null : obj.value);
			return;
		}

		if (input.length === 0) {
			setImmediate(cb, null, null);
			return;
		}

		const chunk = input.slice(0, size);
		input = input.slice(size);

		setImmediate(cb, null, chunk);
	});
};

module.exports.obj = input => {
	if (Array.isArray(input)) {
		input = input.slice();
	}

	let promise;
	let iterator;

	prepare(input);

	function prepare(value) {
		input = value;
		promise = pIsPromise(input) ? input : null;
		iterator = !promise && input[Symbol.iterator] ? input[Symbol.iterator]() : null;
	}

	return from.obj(function reader(size, cb) {
		if (promise) {
			promise.then(prepare).then(() => reader.call(this, size, cb), cb);
			return;
		}

		if (iterator) {
			const obj = iterator.next();
			setImmediate(cb, null, obj.done ? null : obj.value);
			return;
		}

		this.push(input);

		setImmediate(cb, null, null);
	});
};
