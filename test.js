import test from 'ava';
import getStream from 'get-stream';
import pEvent from 'p-event';
import pImmediate from 'p-immediate';
import intoStream from '.';

const fixture = 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium.';

function generatorFrom(array) {
	return function * () {
		let i = 0;
		while (i < array.length) {
			yield array[i++];
		}
	};
}

function iterableFrom(array) {
	return {
		[Symbol.iterator]: generatorFrom(array)
	};
}

function asyncGeneratorFrom(array) {
	return async function * () {
		let i = 0;
		while (i < array.length) {
			// eslint-disable-next-line no-await-in-loop
			await pImmediate();
			yield array[i++];
		}
	};
}

function asyncIterableFrom(array) {
	return {
		[Symbol.asyncIterator]: asyncGeneratorFrom(array)
	};
}

test('string', async t => {
	t.is(await getStream(intoStream(fixture)), fixture);
});

test('buffer', async t => {
	const f = Buffer.from(fixture);
	t.true((await getStream.buffer(intoStream(f))).equals(f));
});

test('ArrayBuffer', async t => {
	const f = Buffer.from(fixture);
	const view = new Uint8Array(f.length);
	for (const [i, element] of f.entries()) {
		view[i] = element;
	}

	t.true((await getStream.buffer(intoStream(view.buffer))).equals(f));
});

test('ArrayBuffer view', async t => {
	const f = Buffer.from(fixture);
	const view = new Uint8Array(f.length);
	for (const [i, element] of f.entries()) {
		view[i] = element;
	}

	t.true((await getStream.buffer(intoStream(view))).equals(f));
});

test('array', async t => {
	t.is(await getStream(intoStream(fixture.split(''))), fixture);
});

test('iterable', async t => {
	const iterable = iterableFrom(fixture.split(''));
	t.is(await getStream(intoStream(iterable)), fixture);
});

test('generator', async t => {
	const generator = generatorFrom(fixture.split(''));
	t.is(await getStream(intoStream(generator())), fixture);
});

test('async iterable', async t => {
	const iterable = asyncIterableFrom(fixture.split(''));
	t.is(await getStream(intoStream(iterable)), fixture);
});

test('async generator', async t => {
	const generator = asyncGeneratorFrom(fixture.split(''));
	t.is(await getStream(intoStream(generator())), fixture);
});

test('promise', async t => {
	const promise = new Promise(resolve => {
		setImmediate(resolve.bind(null, fixture));
	});
	t.is(await getStream(intoStream(promise)), fixture);
});

test('promise resolving to iterable', async t => {
	const promise = new Promise(resolve => {
		setImmediate(resolve.bind(null, iterableFrom(fixture.split(''))));
	});
	t.is(await getStream(intoStream(promise)), fixture);
});

test('promise resolving to async iterable', async t => {
	const promise = new Promise(resolve => {
		setImmediate(resolve.bind(null, asyncIterableFrom(fixture.split(''))));
	});
	t.is(await getStream(intoStream(promise)), fixture);
});

test('stream errors when promise rejects', async t => {
	const promise = new Promise((resolve, reject) => {
		setImmediate(reject.bind(null, new Error('test error')));
	});
	await t.throwsAsync(getStream(intoStream(promise)), 'test error');
});

test('object mode', async t => {
	const f = {foo: true};
	t.deepEqual(await getStream.array(intoStream.object(f)), [f]);

	const f2 = [{foo: true}, {bar: true}];
	t.deepEqual(await getStream.array(intoStream.object(f2)), f2);
});

test('object mode from iterable', async t => {
	const values = [{foo: true}, {bar: true}];
	const iterable = iterableFrom(values);
	t.deepEqual(await getStream.array(intoStream.object(iterable)), values);
});

test('object mode from async iterable', async t => {
	const values = [{foo: true}, {bar: true}];
	const iterable = asyncIterableFrom(values);
	t.deepEqual(await getStream.array(intoStream.object(iterable)), values);
});

test('object mode from promise', async t => {
	const f = {foo: true};
	const promise = new Promise(resolve => {
		setImmediate(resolve.bind(null, f));
	});
	t.deepEqual(await getStream.array(intoStream.object(promise)), [f]);

	const f2 = [{foo: true}, {bar: true}];
	const promise2 = new Promise(resolve => {
		setImmediate(resolve.bind(null, f2));
	});
	t.deepEqual(await getStream.array(intoStream.object(promise2)), f2);
});

test('object mode from promise resolving to iterable', async t => {
	const values = [{foo: true}, {bar: true}];
	const promise = new Promise(resolve => {
		setImmediate(resolve.bind(null, iterableFrom([{foo: true}, {bar: true}])));
	});
	t.deepEqual(await getStream.array(intoStream.object(promise)), values);
});

test('object mode from promise resolving to async iterable', async t => {
	const values = [{foo: true}, {bar: true}];
	const promise = new Promise(resolve => {
		setImmediate(resolve.bind(null, asyncIterableFrom([{foo: true}, {bar: true}])));
	});
	t.deepEqual(await getStream.array(intoStream.object(promise)), values);
});

test('object mode errors when promise rejects', async t => {
	const promise = new Promise((resolve, reject) => {
		setImmediate(reject.bind(null, new Error('test error')));
	});
	await t.throwsAsync(getStream.array(intoStream.object(promise)), 'test error');
});

test('pushes chunk on next tick', async t => {
	let flag = false;

	setImmediate(() => {
		flag = true;
	});

	await pEvent(intoStream(Buffer.from(fixture)), 'data');

	t.true(flag);
});
