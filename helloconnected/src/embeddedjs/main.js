console.log("hello, connected");

function logConnected() {
	console.log(`App connected: ${watch.connected.app}`);
	console.log(`PebbleKitJS connected: ${watch.connected.pebblekit}`);
}

watch.addEventListener('connected', logConnected);

logConnected();

console.log(`Note:
    Pebble OS can take 15 to 30 seconds to notify applications
    when the connection is dropped. This is noticable when
    working in QEMU and issuing commands to connect and disconnect:
    
      pebble emu-bt-connection --connected no
      pebble emu-bt-connection --connected yes

   Please be patient.
`);
