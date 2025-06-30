import HTTPClient from "embedded:network/http/client";

setTimeout(() => {
	const http = new HTTPClient({
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
			trace(`Status ${status}: ${statusText}\n`);
			headers.forEach((value, key) => {
				trace(`${key}: ${value}\n`);
			});
		},
		onReadable(count) {
			try {
				for (let offset = 0, step = 80; offset < count; offset += step) {
					const buffer = this.read(step);
					trace(String.fromArrayBuffer(buffer));
				}
			}
			catch (e) {
				trace("read error: " + e);
			}
		}
	});
}, 1000);
