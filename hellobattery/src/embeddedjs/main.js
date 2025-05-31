import Battery from "embedded:sensor/Battery"

console.log("hello, battery started");
console.log("  > rebble emu-battery --percent 20 --charging --qemu localhost:12344");

const battery = new Battery({
	onSample() {
		const sample = this.sample();
		output(sample);
	}
});
output(battery.sample());

function output(sample) {
	console.log(`battery ${sample.percent}%, charging ${sample.charging}, plugged-in ${sample.plugged}\n`);
}
