import test from 'ava';
import concatStream from 'concat-stream';
import bufferEquals from 'buffer-equals';
import m from './';

const fixture = 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium.';

test.cb('string', t => {
	t.plan(1);

	m(fixture).pipe(concatStream(data => {
		t.is(data.toString(), fixture);
		t.end();
	}));
});

test.cb('buffer', t => {
	t.plan(1);

	const f = new Buffer(fixture);

	m(f).pipe(concatStream(data => {
		t.true(bufferEquals(data, f));
		t.end();
	}));
});

test.cb('array', t => {
	t.plan(1);

	m(fixture.split(''))
	.pipe(concatStream(data => {
		t.is(data.toString(), fixture);
		t.end();
	}));
});

test.cb('object mode', t => {
	t.plan(1);

	// m.obj({foo: true})
	// .pipe(concatStream({encoding: 'object'}, data => {
	// 	t.truthy(data[0].foo);
	// 	t.end();
	// }));

	const f = [{foo: true}, {bar: true}];

	m.obj(f)
	.pipe(concatStream({encoding: 'object'}, data => {
		t.deepEqual(data, f);
		t.end();
	}));
});
