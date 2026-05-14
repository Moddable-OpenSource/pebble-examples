import Vibes from "pebble/vibes"

console.log("hello, vibes!");

let phase = 0;
setInterval(() => {
	switch (phase++) {
		case 0:
			console.log("shortPulse");
			Vibes.shortPulse();
			break;
		case 1:
			console.log("longPulse");
			Vibes.longPulse();
			break;
		case 2:
			console.log("doublePulse");
			Vibes.doublePulse();
			break;
		case 3:
			console.log("pattern");
			Vibes.pattern([100, 100, 150, 50, 50, 150, 1000]);
			break;
		case 4:
			console.log("cancel");
			Vibes.cancel();
			break;
	}
}, 1000);
