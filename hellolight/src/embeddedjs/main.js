console.log("hello, light!");

let phase = 0;
const interval = setInterval(() => {
	if (phase < 10) {
		const enable = 0 == (phase & 1);
		console.log(`light ${enable ? "on" : "off"}`);
		watch.light(enable);
	}
	else {
		clearInterval(interval);
		console.log(`"user interaction" turns light on temporarily`);
		watch.light();
	}
	phase += 1;
}, 300);
