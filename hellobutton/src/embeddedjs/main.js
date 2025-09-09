import Button from "pebble/button"

console.log("hello, button - press a button");
console.log("  press and hold back to exit");

new Button({
	types: ["select", "up", "down", "back"],
	onPush(down, type) {
		console.log(`${down ? "press" : "release"} ${type}`);
	}
});
