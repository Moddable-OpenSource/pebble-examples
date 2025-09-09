console.log("hello, connected");

function logConnected() {
	console.log(`Pebble.connected.app: ${Pebble.connected.app}`);
	console.log(`Pebble.connected.pebblekit: ${Pebble.connected.pebblekit}`);
}

Pebble.addEventListener('connected', logConnected);

logConnected();

