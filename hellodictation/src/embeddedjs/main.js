import Dictation from "pebble/dictation"

console.log("hello, dictation");

let dt = new Dictation({
	onReadable() {
		console.log(`Transcription: ${this.read()}`);
		setImmediate(() => {
			console.log("Listening...");
			this.start();
		});
	},
	onError(e) {
		console.log(`Dictation error: ${e}`);
	}
});

console.log("Listening...");
dt.start();
