console.log("hellowebsocketclient proxy running");

const requests = new Map();

Pebble.addEventListener('ready', function (e) {
  console.log("websocketclient proxy ready");
  request = {};
});
Pebble.addEventListener('appmessage', function (e) {
	console.log("websocketclient proxy appmessage received");

	const id = e.payload[1];
	console.log("   connection: " + id);

	if (!requests.has(id))
		requests.set(id, {id, state: "configure"});
	const request = requests.get(id);
	
	switch (request.state) {
		case "configure": {
			const [protocol, subprotocol, host, port, path, bufferSize] = arrayToString(e.payload[2]).split(":");
			request.bufferSize = parseInt(bufferSize);
			if ("/" === path)
				request.path = "";
			else
				request.path = path || "";
			request.port = port;
			request.host = host;
			request.protocol = protocol;
			request.subprotocol = subprotocol ? subprotocol.split(",") : [];
			
			request.state = "waitHandshake";  
			request.headers = "";		//@@ to do
			}

			// deliberate fall through

		case "connecting": {
			console.log("websocket connect")
			console.log(`  protocol: ${request.protocol}`);  
			console.log(`  host: ${request.host}`);  
			console.log(`  port: ${request.port}`);  
			console.log(`  path: ${request.path}`);  
			console.log(`  subprotocol: ${request.subprotocol}`);  
			console.log(`  bufferSize: ${request.bufferSize}`);

			const url = `${request.protocol}://${request.host}${request.port ? ":" + request.port : ""}/${request.path}`;
			console.log(`   url: ${url}`);

//@@ use of subprotocol gives exception in pypkjs	request.ws = request.subprotocol ? new WebSocket(url, request.subprotocol) : new WebSocket(url);
			request.ws = new WebSocket(url);
			request.ws.binaryType = "arraybuffer";

			request.ws.onopen = event => {
				console.log("websocket connected to host");
				request.state = "connected";
				request.messages = [];
				request.messages.sending = false;
				Pebble.sendAppMessage({
					[1]: request.id,
					[2]: 0						// connected. success.
				});
			};
			request.ws.onerror = event => {
				console.log("websocket connection failed");
				request.state = "error";
				Pebble.sendAppMessage({
					[1]: request.id,
					[3]: -1						// disconnected error.
				});
			};
			request.ws.onclose = event => {
				console.log("websocket connection closed");
				request.state = "closed";
				let reason = event.reason ? stringToArray(event.reason) : [];
				let bytes = new Uint8Array(2 + reason.length);
				let code = event.code ? event.code : 0;
				bytes[0] = event.code >> 8;
				bytes[1] = event.code;
				console.log(`close code ${code} reason ${arrayToString(reason)}`);
				if (reason.byteLength)
					bytes.set(arrayToUint8Array(reason.slice(2)), 2);
				Pebble.sendAppMessage({
					[1]: request.id,
					[3]: 0,						// disconnected clean.
					[10]: Array.from(bytes)		// sendAppMessage wants an Array
				});
			};
			request.ws.onmessage = event => {
				let data = event.data;		// either ArrayBuffer or String
				if (data instanceof ArrayBuffer)
					data = new Uint8Array(data);
				const binary = "string" !== typeof data;
				if  (binary)
					data = Array.from(data);	// sendAppMessage wants an Array
				else
					data = stringToArray(data);		// sendAppMessage wants an Array

				for (let position = 0, fragmentSize = request.bufferSize - 64 /* @@ */; position < data.length; position += fragmentSize) {
					const fragment = data.slice(position, position + fragmentSize);
					const more = (position + fragment.length) < data.length;
					const part = (binary ? 4 : 6) + (more ? 1 : 0);

					request.messages.push({
						[1]: request.id,
						[part]: data
					});
				}
				
				if (!request.messages.sending)
					sendRequestMessage(request);
			};
			} break;

		case "connected": {
			let binary;
			if (!request.pendingWrite)
				request.pendingWrite = [];
	
			if (e.payload[4]) {	// binary no more
				request.pendingWrite.push(e.payload[4]);
				binary = true;
			}
			else if (e.payload[5])	// binary more
				request.pendingWrite.push(e.payload[5]);
			else if (e.payload[6]) {	// text no more
				request.pendingWrite.push(e.payload[6]);
				binary = false;
			}
			else if (e.payload[7])	// text more
				request.pendingWrite.push(e.payload[7]);
			else if (e.payload[8]) {	// close
				request.state = "closing";
				const bytes = arrayToUint8Array(e.payload[8]);
				let code, reason;
				if (bytes.byteLength >= 2) {
					code = (new DataView(bytes.buffer)).getInt16(0, false);
					console.log(`code ${code}`);
					if (bytes.byteLength > 2) {
						reason = arrayToString(e.payload[8].slice(2));
						console.log(`reason ${reason}`);
					}
				}
//				if (undefined === code)
					request.ws.close();
//				else if (undefined === reason)
//					request.ws.close(code);
//				else
//					request.ws.close(code, reason);
				return;
			}
			else {
				console.log("no payload found!");
				throw new Error("surrender");
			}

			if (undefined !== binary) {
				let total = 0;
				request.pendingWrite.forEach(fragment => total += fragment.length);
				let msg = new Uint8Array(total);
				for (let i = 0, offset = 0; i < request.pendingWrite.length; offset += request.pendingWrite[i++].length)
					msg.set(arrayToUint8Array(request.pendingWrite[i]), offset);
				if (binary)
					request.ws.send(msg);
				else
					request.ws.send(arrayToString(msg));
				delete request.pendingWrite;
			}
			} break;

		default:
			console.log("unexpected state " + request.state + "\n");
			break;
	}

	if (0) {
		for (let key in e.payload) {
			console.log(key);
			let value = e.payload[key];
			if (Array.isArray(value)) { 
				let tt = Uint8Array.from(value);
				tt = String.fromCharCode(...tt);
				console.log("binary: " + tt);
			}
			else
				console.log((typeof value) + ": " + value);
		}
	}
});

function sendRequestMessage(request) {
	Pebble.sendAppMessage(
		request.messages.shift(),
		function () {
			if (request.messages.length)
				sendRequestMessage(request);
			else
				request.messages.sending = false;
		},
		function (e) {
			console.log("message send FAILED " + JSON.stringify(e));

			Pebble.sendAppMessage({
				[1]: request.id,
				[3]: -1						// done. failure.
			});
		}
	);
	request.messages.sending = true;
}

function arrayToString(a) {
	return String.fromCharCode(...a);
}

function arrayToUint8Array(a) {
	return Uint8Array.from(a);
}

function stringToArray(str) {
	const result = [];

	for (let i = 0; i < str.length; i++) {
		const charCode = str.charCodeAt(i);

		if (charCode < 0x80)
			result.push(charCode);
		else if (charCode < 0x800)
			result.push(	0xc0 | (charCode >> 6),
							0x80 | (charCode & 0x3f));
		else if (charCode < 0xd800 || charCode >= 0xe000)
			result.push(	0xe0 | (charCode >> 12),
							0x80 | ((charCode >> 6) & 0x3f),
							0x80 | (charCode & 0x3f));
		else {
			i++;
			if (i >= str.length)
				throw new Error('Unmatched surrogate pair');

			const surrogate1 = charCode, surrogate2 = str.charCodeAt(i);
			const codePoint = 0x10000 + ((surrogate1 - 0xd800) << 10) + (surrogate2 - 0xdc00);

			result.push(	0xf0 | (codePoint >> 18),
							0x80 | ((codePoint >> 12) & 0x3f),
							0x80 | ((codePoint >> 6) & 0x3f),
							0x80 | (codePoint & 0x3f));
		}
	}

	return result;
}
