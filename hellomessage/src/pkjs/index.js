console.log("hellomessage proxy running");

let counter = 0;

function send() {
  Pebble.sendAppMessage({
    RANDOM: (Math.random() * 1000000) | 0,
    DATE: Date(),
    COUNTER: ++counter
    });
}

Pebble.addEventListener('ready', function (e) {
  console.log("hellomessage ready");
  send();
});
Pebble.addEventListener('appmessage', function (e) {
	console.log("appmessage received");

	counter = e.payload.COUNTER;
	console.log("  e.payload.COUNTER = " + counter);
	send();
});
