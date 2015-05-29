'use strict';
var test = require('ava');
var concatStream = require('concat-stream');
var bufferEquals = require('buffer-equals');
var intoStream = require('./');

var fixture = 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium.';

test('string', function (t) {
	t.plan(1);

	intoStream(fixture).pipe(concatStream(function (data) {
		t.assert(data.toString() === fixture);
	}));
});

test('buffer', function (t) {
	t.plan(1);

	var f = new Buffer(fixture);

	intoStream(f).pipe(concatStream(function (data) {
		t.assert(bufferEquals(data, f));
	}));
});

test('array', function (t) {
	t.plan(1);

	intoStream(fixture.split(''))
	.pipe(concatStream(function (data) {
		t.assert(data.toString() === fixture);
	}));
});

test('object mode', function (t) {
	t.plan(2);

	intoStream.obj({foo: true})
	.pipe(concatStream({encoding: 'object'}, function (data) {
		t.assert(data[0].foo);
	}));

	intoStream.obj([{foo: true}, {bar: true}])
	.pipe(concatStream({encoding: 'object'}, function (data) {
		t.assert(data[0].foo);
		t.assert(data[0].bar);
	}));
});
