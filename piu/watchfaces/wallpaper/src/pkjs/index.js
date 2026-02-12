const moddableProxy = require("@moddable/pebbleproxy");
Pebble.addEventListener('ready', moddableProxy.readyReceived)
Pebble.addEventListener('appmessage', function (e) {
	if (moddableProxy.appMessageReceived(e))
		return;

	// This is not a Moddable proxy event. Handle the event here. 
});
