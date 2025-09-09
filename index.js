import {Readable as ReadableStream} from 'node:stream';
import {Buffer} from 'node:buffer';

function baseIntoStream(isObjectMode, input) {
	if (input === undefined || input === null) {
		throw new TypeError('Input should not be undefined or null.');
	}

	async function * reader() {
		let value = await input;

		if (!value) {
			return;
		}

		if (Array.isArray(value)) {
			value = [...value];
		}

		// Convert ArrayBuffer/TypedArray to Buffer
		if (!isObjectMode && (value instanceof ArrayBuffer || (ArrayBuffer.isView(value) && !Buffer.isBuffer(value)))) {
			value = Buffer.from(value);
		}

		const convertElement = element => {
			if (isObjectMode) {
				return element;
			}

			if (ArrayBuffer.isView(element) && !Buffer.isBuffer(element)) {
				return Buffer.from(element);
			}

			if (typeof element === 'number') {
				return Buffer.from([element]);
			}

			return element;
		};

		// Handle iterables
		if (typeof value !== 'string' && !Buffer.isBuffer(value) && value?.[Symbol.iterator]) {
			for (const element of value) {
				yield convertElement(element);
			}

			return;
		}

		// Handle async iterables
		if (value?.[Symbol.asyncIterator]) {
			for await (const element of value) {
				yield convertElement(await element);
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
