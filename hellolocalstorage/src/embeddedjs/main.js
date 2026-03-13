console.log("hello, localstorage");

let counter = Number(localStorage.getItem("counter"));
if (null === counter) {
	console.log("initializing counter");
	counter = 1;
}
else
	counter = Number(counter) + 1;

if (counter < 5) {
	console.log(`save counter value ${counter}`);
	localStorage.setItem("counter", counter.toString());
}
else {
	console.log(`reset counter`);
	localStorage.remove("counter");
}
