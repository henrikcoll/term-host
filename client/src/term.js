import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';

export const term = new Terminal({
	fontFamily: 'Jetbrains Mono, Fira Code, courier-new, courier, monospace',
	theme: {
		background: '#1D1F28'
	}
});

window.term = term;

term.open(document.getElementById('terminal-container'));