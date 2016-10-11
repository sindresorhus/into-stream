import test from 'ava';
import getStream from 'get-stream';
import bufferEquals from 'buffer-equals';
import m from './';

const fixture = 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium.';

function iterableFrom(arr) {
	return {
		[Symbol.iterator]: function * () {
			let i = 0;
			while (i < arr.length) {
				yield arr[i++];
			}
		}
	};
}

test('string', async t => {
	t.is(await getStream(m(fixture)), fixture);
});

test('buffer', async t => {
	const f = new Buffer(fixture);
	t.true(bufferEquals(await getStream.buffer(m(f)), f));
});

test('array', async t => {
	t.is(await getStream(m(fixture.split(''))), fixture);
});

test('iterable', async t => {
	const iterable = iterableFrom(fixture.split(''));
	t.is(await getStream(m(iterable)), fixture);
});

test('promise', async t => {
	const promise = new Promise(resolve => {
		setImmediate(resolve.bind(null, fixture));
	});
	t.is(await getStream(m(promise)), fixture);
});

test('promise resolving to iterable', async t => {
	const promise = new Promise(resolve => {
		setImmediate(resolve.bind(null, iterableFrom(fixture.split(''))));
	});
	t.is(await getStream(m(promise)), fixture);
});

test('stream errors when promise rejects', async t => {
	const promise = new Promise((resolve, reject) => {
		setImmediate(reject.bind(null, new Error('test error')));
	});
	await t.throws(getStream(m(promise)), 'test error');
});

test('object mode', async t => {
	const f = {foo: true};
	t.deepEqual(await getStream.array(m.obj(f)), [f]);

	const f2 = [{foo: true}, {bar: true}];
	t.deepEqual(await getStream.array(m.obj(f2)), f2);
});

test('object mode from iterable', async t => {
	const values = [{foo: true}, {bar: true}];
	const iterable = iterableFrom(values);
	t.deepEqual(await getStream.array(m.obj(iterable)), values);
});

test('object mode from promise', async t => {
	const f = {foo: true};
	const promise = new Promise(resolve => {
		setImmediate(resolve.bind(null, f));
	});
	t.deepEqual(await getStream.array(m.obj(promise)), [f]);

	const f2 = [{foo: true}, {bar: true}];
	const promise2 = new Promise(resolve => {
		setImmediate(resolve.bind(null, f2));
	});
	t.deepEqual(await getStream.array(m.obj(promise2)), f2);
});

test('object mode from promise resolving to iterable', async t => {
	const values = [{foo: true}, {bar: true}];
	const promise = new Promise(resolve => {
		setImmediate(resolve.bind(null, iterableFrom([{foo: true}, {bar: true}])));
	});
	t.deepEqual(await getStream.array(m.obj(promise)), values);
});

test('object mode errors when promise rejects', async t => {
	const promise = new Promise((resolve, reject) => {
		setImmediate(reject.bind(null, new Error('test error')));
	});
	await t.throws(getStream.array(m.obj(promise)), 'test error');
});

test.cb('pushes chunk on next tick', t => {
	let flag = false;

	setImmediate(() => {
		flag = true;
	});

	m(new Buffer(fixture)).on('data', () => {
		t.true(flag);
		t.end();
	});
});
