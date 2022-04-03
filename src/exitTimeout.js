
module.exports = () => {
	let exitTimeout = null;

	function start() {
		exitTimeout = setTimeout(() => {
			process.exit(0);
		}, 1000 * 60 * 10);
	}

	function stop() {
		if (exitTimeout) {
			clearTimeout(exitTimeout);
		}
	}

	return {
		start,
		stop
	};
};