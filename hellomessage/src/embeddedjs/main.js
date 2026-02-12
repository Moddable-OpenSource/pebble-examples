import Message from "pebble/message";

console.log("hello, message");

const message = new Message({
	keys: ["RANDOM", "DATE", "COUNTER"],
	onReadable() {
		console.log("on readable");
		const msg = this.read();
		msg.forEach((value, key) => {
			console.log(`  ${key}: ${value}`);
		});
	},
	onWritable() {
		console.log("on writable");
		if (this.once)
			return;

		this.once = true;
		const m = new Map;
		m.set("COUNTER", 1000);
		this.write(m);
		console.log("wrote!");
	},
	onSuspend() {
		console.log("suspended")
	}
});
