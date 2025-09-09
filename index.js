import {Readable as ReadableStream} from 'node:stream';

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

		// Convert ArrayBuffer/TypedArray to Uint8Array
		if (!isObjectMode && (value instanceof ArrayBuffer || ArrayBuffer.isView(value))) {
			value = new Uint8Array(value);
		}

		const convertElement = element => {
			if (isObjectMode) {
				return element;
			}

			if (ArrayBuffer.isView(element)) {
				return new Uint8Array(element);
			}

			if (typeof element === 'number') {
				return new Uint8Array([element]);
			}

			return element;
		};

		// Handle iterables
		if (typeof value !== 'string' && !ArrayBuffer.isView(value) && value?.[Symbol.iterator]) {
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
