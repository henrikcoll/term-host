const express = require('express');
const expressWs = require('express-ws');
const path = require('path');

const os = require('os');
const pty = require('node-pty');

const app = express();
expressWs(app);

app.use('/:id/vendor/xterm', express.static(path.join(__dirname, '/../node_modules/xterm')));
app.use('/:id/vendor/xterm-addon-attach', express.static(path.join(__dirname, '/../node_modules/xterm-addon-attach')));
app.use('/:id', express.static(path.join(__dirname, '/../client')));

app.get('/:id', (req, res) => {
	res.sendFile(path.join(__dirname, '../client/index.html'));
});

const env = Object.assign({}, process.env);
env['COLORTERM'] = 'truecolor';

const term = pty.spawn('su', ['-', 'user'], {
	name: 'xterm-256color',
	cols: 80,
	rows: 24,
	env: env,
	encoding: null,

});
let log = '';

term.on('data', function (data) {
	log += data;
});

term.onExit(() => {
	console.log('exit');

	setTimeout(() => {
		process.exit(0);
	}, 500);
});

app.post('/:id/size', (req, res) => {
	const cols = parseInt(req.query.cols);
	const rows = parseInt(req.query.rows);

	term.resize(cols, rows);
	console.log('Resized terminal to ' + cols + ' cols and ' + rows + ' rows.');
	res.end();
});

app.ws('/:id/ws', function (ws, req) {
	console.log('Connected to terminal ' + term.pid);
	ws.send(log);

	term.onData((data) => {
		try {
			let buffer = [];
			let sender = null;
			let length = 0;

			buffer.push(data);
			length += data.length;
			if (!sender) {
				sender = setTimeout(() => {
					ws.send(Buffer.concat(buffer, length));
					buffer = [];
					sender = null;
					length = 0;
				}, 5);
			}
		} catch (ex) {
			// The WebSocket is not open, ignore
		}
	});

	ws.on('message', function (msg) {
		term.write(msg);
	});
});

app.listen(3000, '0.0.0.0');