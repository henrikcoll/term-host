
module.exports = () => {
	let exitTimeout = null;

	function start() {
		if (exitTimeout)
			return true;
		exitTimeout = setTimeout(() => {
			process.exit(0);
		}, 1000 * 60 * 10);
	}

	function stop() {
		if (exitTimeout) {
			clearTimeout(exitTimeout);
			exitTimeout = null;
		}
	}

	return {
		start,
		stop
	};
};