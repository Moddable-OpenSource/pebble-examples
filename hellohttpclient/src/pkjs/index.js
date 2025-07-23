console.log("hellohttpclient proxy running");

const requests = new Map();

Pebble.addEventListener('ready', function (e) {
  console.log("httpclientproxy ready");
  request = {};
});
Pebble.addEventListener('appmessage', function (e) {
	console.log("httpclientproxy appmessage received");

	const id = e.payload[1];
	console.log("   connection: " + id);
	
	if (!requests.has(id))
		requests.set(id, {id, state: "configure"});
	const request = requests.get(id);
	
	switch (request.state) {
		case "configure": {
			const [protocol, method, host, port, path, bufferSize, headersMask] = arrayToString(e.payload[2]).split(":");
			request.bufferSize = parseInt(bufferSize);
			if ("/" === path)
				request.path = "";
			else
				request.path = path || "";
			request.port = port;
			request.host = host;
			request.protocol = protocol;
			request.method = method;
			request.headersMask = headersMask ? headersMask.split(",") : "*";

			request.state = "recieveHeaders";  
			request.headers = "";
			} break;

		case "recieveHeaders":
			if (e.payload[3]) {
				request.headers += arrayToString(e.payload[3]);
				break;
			}
			request.requestBody = new Uint8Array(0);
			request.state = "receiveBody";  
			// deliberate fall through

		case "receiveBody":
			if (e.payload[4]) {
				const fragment = arrayToUint8Array(e.payload[4]);
				const requestBody = new Uint8Array(fragment.length + request.requestBody.length);
				requestBody.set(request.requestBody);
				requestBody.set(fragment, request.requestBody.length);;
				request.requestBody = requestBody; 
				break;
			}
			request.state = "makeRequest";  
			// deliberate fall through

		case "makeRequest": {
			if (!e.payload[5])
				throw new Error("expected property missing");

			console.log("make the request")
			console.log(`  method: ${request.method}`);  
			console.log(`  protocol: ${request.protocol}`);  
			console.log(`  host: ${request.host}`);  
			console.log(`  port: ${request.port}`);  
			console.log(`  path: ${request.path}`);  
			console.log(`  bufferSize: ${request.bufferSize}`);
			console.log(`  headersMask: ${request.headersMask}`);
			console.log(`  requestBody: ${request.requestBody.length} bytes`);
			request.headers.split("\n").forEach(line => console.log("  " + line));

			request.xhr = new XMLHttpRequest;
			const url = `${request.protocol}://${request.host}${request.port ? ":" + request.port : ""}/${request.path}`;
			console.log(`   url: ${url}`);
			request.xhr.open(request.method, url, true);
			request.xhr.responseType = 'arraybuffer';

			request.headers.split("\n").forEach(line => {
				const [key, value] = line.split(":");
				request.xhr.setRequestHeader(key, value);
			});

			request.xhr.onload = function () {
				request.messages = [];

				request.messages.push({
					[1]: request.id,
					[6]: request.xhr.status,
					[11]: request.xhr.statusText
				});

				const headers = request.xhr.getAllResponseHeaders().split("\r\n").filter(header => {
					if ("*" === request.headersMask)
						return true;			// no mask, return all
					header = header.split(":");
					return request.headersMask.includes(header[0].trim().toLowerCase());
				}).map(header => {
					header = header.split(":");
					header[0] = header[0].trim().toLowerCase();
					header[1] = header[1].trim();
					return header.join(":");
				}).join("\n");
				for (let position = 0, fragmentSize = request.bufferSize - 32 /* @@ */; position < headers.length; position += fragmentSize) {
					const fragment = headers.slice(position, position + fragmentSize);
					request.messages.push({
						[1]: request.id,
						[7]: fragment
					});
				}

				for (let position = 0, response = new Uint8Array(request.xhr.response), fragmentSize = request.bufferSize - 32 /* @@ */; position < response.byteLength; position += fragmentSize) {
					const fragment = response.slice(position, position + fragmentSize);
					request.messages.push({
						[1]: request.id,
						[8]: Array.from(fragment)		// sendAppMessage won't accept ArrayBuffer or Uint8Array. only Array.
					});
				}
				request.messages.push({
					[1]: request.id,
					[9]: 0						// done. success.
				});
				request.state = "sendMessages";
				
				sendRequestMessage(request);
			}
			request.xhr.onerror = function () {
				console.log("ON error!!!!")
				Pebble.sendAppMessage({
					[1]: request.id,
					[9]: -1						// done. failure.
				});
			}
			if (request.requestBody.length)
				request.xhr.send(request.requestBody.buffer);
			else
				request.xhr.send();
			request.state = "waitResponse";  
			} break;

		default:
			console.log("unexpected state " + request.state + "\n");
			break;
	}

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
});

function sendRequestMessage(request) {
	Pebble.sendAppMessage(
		request.messages.shift(),
		function () {
			if (request.messages.length)
				sendRequestMessage(request);
			else
				request.state = "done";
		},
		function () {
			console.log("message send FAILED");

			Pebble.sendAppMessage({
				[1]: request.id,
				[9]: -1						// done. failure.
			});
		}
	);
}

function arrayToString(a) {
	return String.fromCharCode(...a);
}

function arrayToUint8Array(a) {
	return Uint8Array.from(a);
}
