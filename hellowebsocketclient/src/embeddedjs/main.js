import WebSocketClient from "embedded:network/websocket/client";

let counter = 0;

const ws = new WebSocketClient({
	...device.network.ws,
	host: "websockets.chilkat.io",
	path: "/wsChilkatEcho.ashx",
	onReadable(count, options) {
		console.log(`onReadable ${count} bytes, binary ${options.binary}, more ${options.more}`);
		const data = this.read();
		console.log(String.fromArrayBuffer(data));
	},
	onWritable(count) {
		console.log(`onWritable ${count}`);
		this.write(ArrayBuffer.fromString(`tick ${++counter}`), {binary: false});
	},
	onControl() {	// unused on Pebble
		console.log("** onControl **");
	},
	onClose() {
		console.log("** Connection Closed **");
	},
	onError() {
		console.log("** Connection Error **");
	}
});
