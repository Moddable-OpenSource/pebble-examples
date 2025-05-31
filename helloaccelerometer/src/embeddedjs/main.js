import Accelerometer from "embedded:sensor/Accelerometer"

console.log("hello, accelerometer started");

const accel = new Accelerometer({
	onSample() {
		const sample = this.sample();
		console.log(`accel ${sample.x}, ${sample.y}, ${sample.z}`);
	},
	onTap(direction) {
		console.log(`single tap ${direction}`);
	},
	onDoubleTap(direction) {
		console.log(`double tap ${direction}`);
	}
});
accel.configure({hz: 10});

// rebble emu-accel tilt-left --qemu localhost:12344
