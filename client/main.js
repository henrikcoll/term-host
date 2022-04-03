const hostId = window.location.pathname.split('/')[1];

const term = new Terminal({
	fontFamily: 'Jetbrains Mono, Fira Code, courier-new, courier, monospace',
	theme: {
		background: '#1D1F28'
	}
});

window.term = term;

term.open(document.getElementById('terminal-container'));

term.onResize((size) => {
	const cols = size.cols;
	const rows = size.rows;
	const url = '/' + hostId + '/size?cols=' + cols + '&rows=' + rows;

	fetch(url, { method: 'POST' });
});

const protocol = location.protocol === 'https:' ? 'wss://' : 'ws://';
const socketURL = `${protocol}${location.hostname}${location.port ? `:${location.port}` : ''}/${hostId}/ws`;

term.focus();

const socket = new WebSocket(socketURL);
const attachAddon = new AttachAddon.AttachAddon(socket);

term.loadAddon(attachAddon);