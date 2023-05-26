import {Readable as ReadableStream} from 'node:stream';
import {Buffer} from 'node:buffer';

function baseIntoStream(isObjectMode, input) {
	async function * reader() {
		let value = await input;

		if (!value) {
			return;
		}

		if (Array.isArray(value)) {
			value = [...value];
		}

		if (
			!isObjectMode
			&& (
				value instanceof ArrayBuffer
				|| (ArrayBuffer.isView(value) && !Buffer.isBuffer(value))
			)
		) {
			value = Buffer.from(value);
		}

		// We don't iterate on strings and buffers since yielding them is ~7x faster.
		if (typeof value !== 'string' && !Buffer.isBuffer(value) && value?.[Symbol.iterator]) {
			for (const element of value) {
				yield element;
			}

			return;
		}

		if (value?.[Symbol.asyncIterator]) {
			for await (const element of value) {
				yield await element;
			}

			return;
		}

		yield value;
	}

	return ReadableStream.from(reader(), {objectMode: isObjectMode});
}

const intoStream = baseIntoStream.bind(undefined, false);

export default intoStream;

intoStream.object = baseIntoStream.bind(undefined, true);
