const ws = new WebSocket("ws://websockets.chilkat.io/wsChilkatEcho.ashx");
ws.binaryType = "arraybuffer";
ws.addEventListener("open", event => {
	ws.send("Hello".repeat(100));
	ws.send(Uint8Array.of(0, 1, 2, 3, 4, 5, 6, 7));
	ws.send("Goodbye");
	console.log(`bufferedAmount ${ws.bufferedAmount}`);
});
ws.addEventListener("message", event => {
	let data = event.data;
	if (data instanceof ArrayBuffer) {
		console.log(`onmessage binary data `);
		data = new Uint8Array(data);
	}
	else {
		console.log(`onmessage string: ${data}`);
		if (data == "Goodbye")
			ws.close(1000, "Done");
	}
});
ws.addEventListener("close", event => {
	console.log(`onclose ${event.code} ${event.reason}`);
});
