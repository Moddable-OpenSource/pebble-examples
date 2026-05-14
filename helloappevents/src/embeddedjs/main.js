console.log("hello, app events!");

watch.addEventListener("willFocus", inFocus => {
	console.log(`willFocus with inFocus ${inFocus}`);
});

watch.addEventListener("didFocus", inFocus => {
	console.log(`didFocus with inFocus ${inFocus}`);
});

watch.addEventListener("resize", progress => {
	console.log(`screen resized to ${screen.width} x ${screen.height} at progress ${progress}`);
});
