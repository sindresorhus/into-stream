import test from 'ava';
import getStream from 'get-stream';
import bufferEquals from 'buffer-equals';
import m from './';

const fixture = 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium.';

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

test('object mode', async t => {
	const f = {foo: true};
	t.deepEqual(await getStream.array(m.obj(f)), [f]);

	const f2 = [{foo: true}, {bar: true}];
	t.deepEqual(await getStream.array(m.obj(f2)), f2);
});

test.cb('pushes chunk on next frame', t => {
	const f = new Buffer(fixture);
	let flag = false;

	setImmediate(() => {
		flag = true;
	});

	m(f).on('data', function () {
		t.truthy(flag);
		t.end();
	});
});
