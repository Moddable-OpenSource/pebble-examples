import Poco from "commodetto/Poco";

console.log("Hello, PDC Process.");

const render = new Poco(screen);

const gray = render.makeColor(128, 128, 128);
const black = render.makeColor("black");
const white = render.makeColor("white");
const opaque = 0b11000000;

let index = 0;
setInterval(() => {
	index = (index + 1) % 5;
	let dci = new Poco.PebbleDrawCommandImage(1 + index);
	const {width, height} = dci;
	render.begin();
	render.fillRectangle(gray, 0, 0, render.width, render.height);
	const stroke = Math.irandom(63) | opaque;
	const fill = Math.irandom(63) | opaque;
	dci = dci.clone().process(command => {
		if (black === command.stroke)
			command.stroke = stroke;
		if (white === command.fill)
			command.fill = fill;
	});
	render.drawDCI(dci, (render.width - width) / 2, (render.height - height) / 2);
	render.end();
}, 250);
