import Poco from "commodetto/Poco";

console.log("Hello, Poco Pebble Text.");

const render = new Poco(screen);

const black = render.makeColor(0, 0, 0);
const white = render.makeColor(255, 255, 255);

const fonts = {
	gothicRegular: new render.Font("Gothic-Regular", 18),
	bithamBlack: new render.Font("Bitham-Black", 30),
	robotoCondensed: new render.Font("Roboto-Condensed", 21),
};

render.begin(0, 0, render.width, render.height);
	render.fillRectangle(white, 0, 0, render.width, render.height);

	drawTextCentered("Hello, Gothic!", fonts.gothicRegular, black, 4);
	drawTextCentered("Bitham", fonts.bithamBlack, black, (render.height - fonts.bithamBlack.height) >> 1);
	drawTextCentered("Roboto", fonts.robotoCondensed, black, render.height - fonts.robotoCondensed.height - 4);;
render.end();

function drawTextCentered(msg, font, color, y) {
	const w = render.getTextWidth(msg, font);
	render.drawText(msg, font, color, (render.width - w) >> 1, y);
}
