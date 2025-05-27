console.log("hello, timer: started");

let counter = 0;

const interval = setInterval(() => {
	console.log(`counter ${++counter}\n`);

	if (10 === counter) {
		console.log("hello, timer: stopped");
		clearInterval(interval);
	}
}, 500);
