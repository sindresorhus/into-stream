import process from 'node:process';
import {Buffer} from 'node:buffer';
import intoStream from './index.js';

const unicornArray = [...'unicorn'];

function asyncGeneratorFrom<T>(array: T[]) {
	return async function * () {
		yield array[0];
	};
}

function asyncIterableFrom<T>(array: T[]) {
	return {
		[Symbol.asyncIterator]: asyncGeneratorFrom(array),
	};
}

intoStream('unicorn').pipe(process.stdout);
intoStream(unicornArray).pipe(process.stdout);
intoStream(new Set(unicornArray)).pipe(process.stdout);
intoStream(new Set([Buffer.from('unicorn')])).pipe(process.stdout);
intoStream(Buffer.from('unicorn')).pipe(process.stdout);
intoStream(Buffer.from('unicorn').buffer).pipe(process.stdout);
intoStream(new Uint8Array(Buffer.from('unicorn').buffer)).pipe(process.stdout);

intoStream(Promise.resolve('unicorn')).pipe(process.stdout);
intoStream(Promise.resolve(unicornArray)).pipe(process.stdout);
intoStream(Promise.resolve(new Set(unicornArray))).pipe(process.stdout);
intoStream(Promise.resolve(new Set([Buffer.from('unicorn')]))).pipe(
	process.stdout,
);
intoStream(Promise.resolve(Buffer.from('unicorn'))).pipe(process.stdout);
intoStream(Promise.resolve(Buffer.from('unicorn').buffer)).pipe(process.stdout);
intoStream(Promise.resolve(new Uint8Array(Buffer.from('unicorn').buffer))).pipe(
	process.stdout,
);

intoStream(asyncGeneratorFrom(unicornArray)()).pipe(process.stdout);
intoStream(asyncIterableFrom(unicornArray)).pipe(process.stdout);
intoStream(Promise.resolve(asyncIterableFrom(unicornArray))).pipe(process.stdout);

const object = {foo: true};
const objectArray = [object, {bar: true}];
const objectIterable = new Set(objectArray);
const arrayOfArrays = [[object]];

intoStream.object(object).pipe(process.stdout);
intoStream.object(objectArray).pipe(process.stdout);
intoStream.object(objectIterable).pipe(process.stdout);
intoStream.object(arrayOfArrays).pipe(process.stdout);
intoStream.object(Promise.resolve(object)).pipe(process.stdout);
intoStream.object(Promise.resolve(objectArray)).pipe(process.stdout);
intoStream.object(Promise.resolve(objectIterable)).pipe(process.stdout);
intoStream.object(Promise.resolve(arrayOfArrays)).pipe(process.stdout);
intoStream.object(asyncGeneratorFrom(objectArray)()).pipe(process.stdout);
intoStream.object(asyncIterableFrom(objectArray)).pipe(process.stdout);
intoStream.object(Promise.resolve(asyncIterableFrom(objectArray))).pipe(process.stdout);
