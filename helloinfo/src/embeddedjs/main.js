console.log("hello, info!");

console.log(`launch reason ${watch.launch.reason}, arguments ${watch.launch.arguments}`);
if (watch.wake)
	console.log(`launch wake ID ${watch.wake.id}, cookie ${watch.wake.cookie}`);

console.log(`screen dimensions ${screen.width} x ${screen.height}`);
console.log(`screen.round ${screen.round}`);
console.log(`screen.color ${screen.color}`);
console.log(`touch available ${device.sensor.Touch ? true : false}`);

console.log(`watch.model ${watch.model}`);
console.log(`watch.firmwareVersion ${watch.firmwareVersion.major}.${watch.firmwareVersion.minor}.${watch.firmwareVersion.patch}`);
console.log(`watch.hour12 ${watch.hour12} (user prefers ${watch.hour12 ? "12" : "24"} hour display)`);

console.log(`date and time: ${new Date}`);
