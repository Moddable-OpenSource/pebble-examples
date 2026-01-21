import Poco from "commodetto/Poco";

console.log("Hello, GBitmap.");

const render = new Poco(screen);

const black = render.makeColor(0, 0, 0);
const white = render.makeColor(255, 255, 255);

let bitmap = new Poco.PebbleBitmap(1);
let index = 0;
setInterval(() => {
	index = (index + 1) % 4;
	bitmap = new Poco.PebbleBitmap(1 + index);
	render.begin();
	render.fillRectangle(black, 0, 0, render.width, render.height);	
	render.drawBitmap(bitmap, (render.width - bitmap.width) / 2, (render.height - bitmap.height) / 2);
	render.end();
}, 250);
