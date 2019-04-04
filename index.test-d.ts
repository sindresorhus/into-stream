import intoStream = require('.');

const unicornArray = 'unicorn'.split('');

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
	process.stdout
);
intoStream(Promise.resolve(Buffer.from('unicorn'))).pipe(process.stdout);
intoStream(Promise.resolve(Buffer.from('unicorn').buffer)).pipe(process.stdout);
intoStream(Promise.resolve(new Uint8Array(Buffer.from('unicorn').buffer))).pipe(
	process.stdout
);

const object = {foo: true};
const objectArray = new Set([object, {bar: true}]);
const objectIterable = new Set(objectArray);

intoStream.object(object).pipe(process.stdout);
intoStream.object(objectArray).pipe(process.stdout);
intoStream.object(objectIterable).pipe(process.stdout);
intoStream.object(Promise.resolve(object)).pipe(process.stdout);
intoStream.object(Promise.resolve(objectArray)).pipe(process.stdout);
intoStream.object(Promise.resolve(objectIterable)).pipe(process.stdout);
