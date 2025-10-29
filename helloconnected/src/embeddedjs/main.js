console.log("hello, connected");

function logConnected() {
	console.log(`App connected: ${Pebble.connected.app}`);
	console.log(`PebbleKitJS connected: ${Pebble.connected.pebblekit}`);
}

Pebble.addEventListener('connected', logConnected);

logConnected();
