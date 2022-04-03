export class AttachAddon {
	#socket;
	#bidirectional;
	#disposables = [];

	constructor(socket, options) {
		this.#socket = socket;
		// always set binary type to arraybuffer, we do not handle blobs
		this.#socket.binaryType = 'arraybuffer';
		this.#bidirectional = !(options && options.bidirectional === false);
	}

	activate(terminal) {
		this.#socket.on('termData', (data) => {
			terminal.write(typeof data === 'string' ? data : new Uint8Array(data));
		});

		if (this.#bidirectional) {
			this.#disposables.push(terminal.onData(data => this._sendData(data)));
			this.#disposables.push(terminal.onBinary(data => this._sendBinary(data)));
		}
	}
	dispose() {
		this.#socket.removeAllListeners('termData');
	}

	_sendData(data) {
		// TODO: do something better than just swallowing
		// the data if the socket is not in a working condition
		this.#socket.emit('termData', data);
	}

	_sendBinary(data) {
		const buffer = new Uint8Array(data.length);
		for (let i = 0; i < data.length; ++i) {
			buffer[i] = data.charCodeAt(i) & 255;
		}
		this.#socket.emit('termData', buffer);
	}
}