import HTTPClient from "embedded:network/http/client";

const msg = "key1=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa&key2=bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb&key3=cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc&key4=dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd";
let position = 0;
setTimeout(() => {
	const http = new HTTPClient({
		host: "httpbin.org"
	});

	http.request({
		method: "PUT",
		path: "/put",
		headers: new Map([
			["date", (new Date).toString()],
			["user-agent", "pebble test"],
			["content-length", msg.length],
			['Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8']
		]),
		onHeaders(status, headers) {
			trace(`Status ${status}\n`);
			headers.forEach((value, key) => {
				trace(`${key}: ${value}\n`);
			});
		},
		onWritable(count) {
			let use = msg.length - position;
			if (use > count) use = count;
			this.write(ArrayBuffer.fromString(msg.slice(position, position + use)));
			position += use;
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
