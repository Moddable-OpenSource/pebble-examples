console.log("hello, connected");

function logConnected() {
	console.log(`App connected: ${watch.connected.app}`);
	console.log(`PebbleKitJS connected: ${watch.connected.pebblekit}`);
}

watch.addEventListener('connected', logConnected);

logConnected();
