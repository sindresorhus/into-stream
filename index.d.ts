import {type Readable as ReadableStream} from 'node:stream';

export type Input =
	| Uint8Array
	| NodeJS.TypedArray
	| ArrayBuffer
	| string
	| Iterable<string | Uint8Array | NodeJS.TypedArray>
	| AsyncIterable<string | Uint8Array | NodeJS.TypedArray>;

/* eslint-disable @typescript-eslint/no-restricted-types */
export type ObjectInput =
	| object
	| Iterable<object>
	| AsyncIterable<object>;
/* eslint-enable @typescript-eslint/no-restricted-types */

declare const intoStream: {
	/**
	Convert `input` into a stream. Adheres to the requested chunk size, except for `array` where each element will be a chunk.

	@param input - The input to convert to a stream.
	@returns A [readable stream](https://nodejs.org/api/stream.html#class-streamreadable).

	@example
	```
	import intoStream from 'into-stream';

	intoStream('unicorn').pipe(process.stdout);
	//=> 'unicorn'
	```
	*/
	(input: Input | Promise<Input>): ReadableStream;

	/**
	Convert object `input` into a stream.

	@param input - The object input to convert to a stream.
	@returns A [readable object stream](https://nodejs.org/api/stream.html#object-mode).
	*/
	object: (input: ObjectInput | Promise<ObjectInput>) => ReadableStream;
};

export default intoStream;
