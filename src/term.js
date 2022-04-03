const pty = require('node-pty');

module.exports = () => {
	const env = Object.assign({}, process.env);
	env['COLORTERM'] = 'truecolor';

	const term = pty.spawn('su', ['-', 'user'], {
		name: 'xterm-256color',
		cols: 80,
		rows: 24,
		env: env,
		encoding: null,

	});

	term.onExit(() => {
		setTimeout(() => {
			process.exit(0);
		}, 500);
	});

	return {
		term
	};
};