import WakeUp from "pebble/wakeup"

console.log("hello, wakeup!");

console.log(`Launch reason ${watch.launch.reason}, arguments ${watch.launch.arguments}`);
if (watch.wake) {
	console.log(`Launch wake ID ${watch.wake.id}, cookie ${watch.wake.cookie}`);
	
	localStorage.removeItem("wakeid");
	WakeUp.cancel(watch.wake.id);
}

if (localStorage.getItem("wakeid")) {
	const id = localStorage.getItem("wakeid")
	const wakeup = WakeUp.query(id);
	if (!wakeup) {
		console.log(`Forget lost wakeup id ${id}`);
		localStorage.removeItem("wakeid");
	}
	else if (wakeup.time < Date.now()) {
		console.log(`Cancel stale wakeup id ${id}`);
		WakeUp.cancel(id);
		localStorage.removeItem("wakeid");
	}
}	

if (!localStorage.getItem("wakeid")) {
	const id = WakeUp.schedule(Date.now() + 3000, 12345678, false);		// 3 seconds in the future
	console.log(`Scheduled WakeUp id ${id}`);
	localStorage.setItem("wakeid", id);
}

watch.addEventListener("wakeup", wake => {
	console.log(`wakeup id ${wake.id} occurred while running`);
	localStorage.removeItem("wakeid");
	WakeUp.cancel(wake.id);
});
