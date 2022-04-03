const path = require('path');
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');

const { term } = require('./term')();
const exitTimeout = require('./exitTimeout')();

const hostId = process.env.TERM_HOST_ID;

const app = express();
const server = createServer(app);
const io = new Server(server, { path: `/${hostId}/socket.io/` });
let log = '';

app.use('/:id', express.static(path.join(__dirname, '/../client/dist')));

app.get('/:id', (req, res) => {
	res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

term.onData(function (data) {
	log += data;
});

io.on('connection', socket => {
	exitTimeout.stop();
	socket.emit('termData', log);

	socket.on('disconnect', async () => {
		// Close the server once everyone has disconnected
		let sockets = await io.fetchSockets();
		if (sockets.length === 0) {
			exitTimeout.start();
		}
	});

	socket.on('termData', data => {
		term.write(data);
	});
});

let buffer = [];
let sender = null;
let length = 0;

term.onData(data => {
	buffer.push(data);
	length += data.length;

	if (!sender) {
		sender = setTimeout(() => {
			io.emit('termData', Buffer.concat(buffer, length));
			buffer = [];
			sender = null;
			length = 0;
		}, 5);
	}
});

app.post('/:id/size', (req, res) => {
	const cols = parseInt(req.query.cols);
	const rows = parseInt(req.query.rows);

	term.resize(cols, rows);
	res.end();
});

server.listen(3000, '0.0.0.0');