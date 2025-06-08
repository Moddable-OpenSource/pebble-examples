import Poco from "commodetto/Poco";
import parseBMF from "commodetto/parseBMF";
import parseRLE from "commodetto/parseRLE";

console.log("Hello, Poco Text.");

const render = new Poco(screen);

const black = render.makeColor(0, 0, 0);
const white = render.makeColor(255, 255, 255);

const fonts = {
	openSansRegular: getFont("OpenSans-Regular", 21),
	notoSansRegular: getFont("NotoSansJP-Regular", 24),
	radleyItalic: getFont("Radley-Italic", 26),
};

render.begin(0, 0, render.width, render.height);
	render.fillRectangle(white, 0, 0, render.width, render.height);

	drawTextCentered("Hello!", fonts.openSansRegular, black, 4);
	drawTextCentered("新宿出口", fonts.notoSansRegular, black, (render.height - fonts.notoSansRegular.height) >> 1);
	drawTextCentered("Goodbye.", fonts.radleyItalic, black, render.height - fonts.radleyItalic.height - 4);;
render.end();

function getFont(name, size) {
	const font = parseBMF(new Resource(`${name}-${size}.fnt`));
	font.bitmap = parseRLE(new Resource(`${name}-${size}-alpha.bm4`))
	return font;
}

function drawTextCentered(msg, font, color, y) {
	const w = render.getTextWidth(msg, font);
	render.drawText(msg, font, color, (render.width - w) >> 1, y);
}
