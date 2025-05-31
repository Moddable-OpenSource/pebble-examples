import Button from "pebble/button"

console.log("hello, button - press a button");
console.log("  press and hold back to exit");

["select", "up", "down", "back"].forEach(type => {
	new Button({
		type,
		onPush(down) {
			console.log(`${down ? "press" : "release"} ${type}`);
		}
	});
});
