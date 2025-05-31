import KV from "embedded:storage/key-value"

console.log("hello, key-value");

const store = KV.open({path: "examplesettings", format: "string"});

let counter = store.read("counter");
if (undefined === counter) {
	console.log("initializing counter");
	counter = 1;
}
else
	counter = Number(counter) + 1;

if (counter < 5) {
	console.log(`save counter value ${counter}`);
	store.write("counter", counter);
}
else {
	console.log(`reset counter`);
	store.delete("counter");
}

store.close();
