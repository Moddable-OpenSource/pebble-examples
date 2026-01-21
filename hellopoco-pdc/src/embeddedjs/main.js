import Poco from "commodetto/Poco";

console.log("Hello, PDC.");

const render = new Poco(screen);

const gray = render.makeColor(128, 128, 128);

let index = 0;
setInterval(() => {
	index = (index + 1) % 5;
	const dci = new Poco.PebbleDrawCommandImage(1 + index);
	render.begin();
	render.fillRectangle(gray, 0, 0, render.width, render.height);
	render.drawDCI(dci, (render.width - dci.width) / 2, (render.height - dci.height) / 2);
	render.end();
}, 250);
