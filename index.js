'use strict';
const from = require('from2');
const isPromise = require('is-promise');

module.exports = x => {
	if (Array.isArray(x)) {
		x = x.slice();
	}

	let pendingPromise = isPromise(x) ? x : null;
	let shouldIterate;
	let iterator;

	if (!pendingPromise) {
		decideIteration();
	}

	function decideIteration() {
		// We don't iterate on strings and buffers since slicing them is ~7x faster.
		shouldIterate = x[Symbol.iterator] && typeof x !== 'string' && !Buffer.isBuffer(x);
		iterator = shouldIterate ? x[Symbol.iterator]() : null;
	}

	return from(function reader(size, cb) {
		if (pendingPromise) {
			pendingPromise.then(result => {
				x = result;
				pendingPromise = null;
				decideIteration();
				reader.call(this, size, cb);
			}, cb);
			return;
		}

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

	let pendingPromise = isPromise(x) ? x : null;
	let iterator;

	if (!pendingPromise) {
		decideIteration();
	}

	function decideIteration() {
		iterator = x[Symbol.iterator] ? x[Symbol.iterator]() : null;
	}

	return from.obj(function reader(size, cb) {
		if (pendingPromise) {
			pendingPromise.then(result => {
				x = result;
				pendingPromise = null;
				decideIteration();
				reader.call(this, size, cb);
			}, cb);
			return;
		}

		if (iterator) {
			const obj = iterator.next();
			setImmediate(cb, null, obj.done ? null : obj.value);
			return;
		}

		this.push(x);

		setImmediate(cb, null, null);
	});
};
