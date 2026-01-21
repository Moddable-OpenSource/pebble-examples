import Poco from "commodetto/Poco";

console.log("Hello, PDC Sequence.");

const render = new Poco(screen);

const gray = render.makeColor(128, 128, 128);

const dcs = new Poco.PebbleDrawCommandSequence(1);
console.log(`dimensions ${dcs.width} x ${dcs.height}`);
console.log(`duration ${dcs.duration} ms`);

let time = 0;

function draw() {
	render.begin();
	render.fillRectangle(gray, 0, 0, render.width, render.height);	
	render.drawDCI(dcs, (render.width - dcs.width) >> 1, (render.height - dcs.height) >> 1);
	render.end();

	const frameDuration = dcs.frameDuration;
	dcs.time += frameDuration;
	setTimeout(draw, frameDuration);
}
draw();
