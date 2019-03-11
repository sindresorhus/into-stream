/// <reference types="node"/>
import {Readable as ReadableStream} from 'stream';

export type Input =
	| Buffer
	| NodeJS.TypedArray
	| ArrayBuffer
	| string
	| Iterable<Buffer | string>;

export type InputObject =
	| {[key: string]: unknown}
	| Iterable<{[key: string]: unknown}>;

declare const intoStream: {
	/**
	 * Convert `input` into a stream. Adheres to the requested chunk size, except for `array` where each element will be a chunk.
	 *
	 * @param input - The input to convert to a stream.
	 * @returns A [readable stream](https://nodejs.org/api/stream.html#stream_class_stream_readable).
	 */
	(input: Input | Promise<Input>): ReadableStream;

	/**
	 * Convert object `input` into a stream.
	 *
	 * @param input - The object input to convert to a stream.
	 * @returns A [readable object stream](https://nodejs.org/api/stream.html#stream_object_mode).
	 */
	obj(input: InputObject | Promise<InputObject>): ReadableStream;
};

export default intoStream;
