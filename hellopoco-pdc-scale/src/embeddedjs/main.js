import Poco from "commodetto/Poco";

console.log("Hello, PDC Scale.");

const render = new Poco(screen);

const gray = render.makeColor(128, 128, 128);

let dci = new Poco.PebbleDrawCommandImage(1);
console.log(`dimensions ${dci.width} x ${dci.height}`);

const start = Date.now();
setInterval(() => {
	const scale = Math.elasticEaseOut(((Date.now() - start) % 1500) / 1500);
	const cx = (render.width - dci.width * scale) / 2, cy = (render.height - dci.height * scale) / 2;
	render.begin();
	render.fillRectangle(gray, 0, 0, render.width, render.height);
	render.drawDCI(dci.clone().scale(scale), cx, cy);
	render.end();
}, 17);
