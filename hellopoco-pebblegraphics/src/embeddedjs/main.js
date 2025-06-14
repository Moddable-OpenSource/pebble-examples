import Poco from "commodetto/Poco";

console.log("Hello, Poco Pebble Graphics.");

const render = new Poco(screen);

const black = render.makeColor(0, 0, 0);
const darkGray = render.makeColor(0, 64, 64);
const gray = render.makeColor(128, 128, 128);
const lightGray = render.makeColor(0x80, 0xc0, 0xc0);
const white = render.makeColor(255, 255, 255);

let angle = 0;

setInterval(() => {
	render.begin(0, 0, render.width, render.height);
		render.fillRectangle(white, 0, 0, render.width, render.height);

		render.drawLine(0, 0, render.width, render.height, gray, 4);
		render.drawLine(0, render.height, render.width, 0, gray, 4);
		
		let margin = 30, radius = 8
		render.drawRoundRect(margin, margin, render.width - (margin * 2), render.height - (margin * 2), black, radius, 0b011);
		margin = 40;
		render.drawRoundRect(margin, margin, render.width - (margin * 2), render.height - (margin * 2), white, radius, 0b1100);
		margin = 50;
		render.drawRoundRect(margin, margin, render.width - (margin * 2), render.height - (margin * 2), darkGray, radius);
		margin = 66;
		render.drawCircle(lightGray, render.width >> 1, render.height>> 1, 15, angle, angle + 270);

		margin = 10;
		render.frameRoundRect(lightGray, margin, render.width - (margin * 2), render.height - (margin * 2), black);
	render.end();
	
	angle += 10;
}, 30);
