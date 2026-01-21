import Poco from "commodetto/Poco";

console.log("Hello, PDC Rotate.");

const render = new Poco(screen);

const gray = render.makeColor(128, 128, 128);

let dci = new Poco.PebbleDrawCommandImage(1);
console.log(`dimensions ${dci.width} x ${dci.height}`);

let angle = 0;
setInterval(() => {
	render.begin();
	render.fillRectangle(gray, 0, 0, render.width, render.height);
	render.drawDCI(dci.clone().rotate(angle, dci.width >> 1, dci.height >> 1), (render.width - dci.width) / 2, (render.height - dci.height) / 2);
	angle += Math.PI / 30;
	render.end();
}, 17);
