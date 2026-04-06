const http = new device.network.http.io({
	...device.network.http,
	host: "example.com"
});

http.request({
	path: "/",
	headersMask: ["date"],
	headers: new Map([
		["date", (new Date).toString()],
		["user-agent", "pebble test"]
	]),
	onHeaders(status, headers, statusText) {
		console.log(`Status ${status}: ${statusText}`);
		headers.forEach((value, key) => {
			console.log(`${key}: ${value}`);
		});
	},
	onReadable(count) {
		try {
			for (let offset = 0, step = 80; offset < count; offset += step) {
				const buffer = this.read(step);
				console.log(String.fromArrayBuffer(buffer));
			}
		}
		catch (e) {
			console.log("read error: " + e);
		}
	}
});
