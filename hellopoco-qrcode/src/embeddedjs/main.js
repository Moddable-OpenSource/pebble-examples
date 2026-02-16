import Poco from "commodetto/Poco";
import Bitmap from "commodetto/Bitmap";
import qrCode from "qrcode";

console.log("Hello, Poco QRCode.");

const render = new Poco(screen);

const black = render.makeColor(0, 0, 0);
const white = render.makeColor(255, 255, 255);

const code = qrCode({
	input: `Welcome to Alloy, the Moddable SDK on Pebble OS @ ${(new Date).toTimeString().slice(0, 8)}`,
	bitmap: 32,
	fit: Math.min(render.width, render.height) - 10
});

const bitmap = new Bitmap(code.size, code.size, Bitmap.MonochromeAligned, code, 0);
render.begin();
	render.fillRectangle(white, 0, 0, render.width, render.height);
	render.drawMonochrome(bitmap, black, white, (render.width - bitmap.width) >> 1, (render.height - bitmap.height) >> 1);
render.end();
