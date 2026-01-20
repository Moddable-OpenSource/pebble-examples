const moddableProxy = require("@moddable/pebbleproxy");
Pebble.addEventListener('appmessage', function (e) {
	if (moddableProxy.eventReceived(e))
		return;

	// This is not a Moddable proxy event. Handle the event here. 
});
