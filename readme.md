# into-stream

> Convert a string/promise/array/iterable/asynciterable/buffer/typedarray/arraybuffer/object into a stream

Correctly handles backpressure.

## Install

```sh
npm install into-stream
```

## Usage

```js
import intoStream from 'into-stream';

intoStream('unicorn').pipe(process.stdout);
//=> 'unicorn'
```

## API

### intoStream(input)

Type: `Buffer | TypedArray | ArrayBuffer | string | Iterable<Buffer | string | TypedArray> | AsyncIterable<Buffer | string | TypedArray> | Promise`\
Returns: [Readable stream](https://nodejs.org/api/stream.html#class-streamreadable)

### intoStream.object(input)

Type: `object | Iterable<object> | AsyncIterable<object> | Promise`\
Returns: [Readable object stream](https://nodejs.org/api/stream.html#object-mode)

## Limitations

The streams returned by this package cannot be used with the `stdio` option of Node.js [`child_process`](https://nodejs.org/api/child_process.html) methods. Use [`fs.createReadStream()`](https://nodejs.org/api/fs.html#fscreatereadstreampath-options) instead.

## Related

- [to-readable-stream](https://github.com/sindresorhus/to-readable-stream) - Simpler version of this package
- [get-stream](https://github.com/sindresorhus/get-stream) - The opposite of this package
