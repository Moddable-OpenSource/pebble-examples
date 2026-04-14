/*
 * Copyright (c) 2016-2026  Moddable Tech, Inc.
 *
 *   This file is part of the Moddable SDK.
 * 
 *   This work is licensed under the
 *       Creative Commons Attribution 4.0 International License.
 *   To view a copy of this license, visit
 *       <http://creativecommons.org/licenses/by/4.0>.
 *   or send a letter to Creative Commons, PO Box 1866,
 *   Mountain View, CA 94042, USA.
 *
 */

import parseBMF from "commodetto/parseBMF";
import parseRLE from "commodetto/parseRLE";
import Poco from "commodetto/Poco";
import Resource from "Resource";

const render = new Poco(screen);

const black = render.makeColor(0, 0, 0);
const white = render.makeColor(255, 255, 255);

const font = getFont("OpenSans-Regular", 20);
const background = parseRLE(new Resource("desktop-color.bm4"));
const button = {width: 120, height: 80};

class Dragger {
	anchor = {};
	state = 0;

	constructor(x, y, label, image) {
		this.label = label;
		this.bounds = {x, y, width: image.width, height: image.height >> 1};
		this.update();
	}
	contains(x, y) {
		const bounds = this.bounds;
		return (x >= bounds.x && x < bounds.x + bounds.width && y >= bounds.y && y < bounds.y + bounds.height);
	}
	onTouchBegan(x, y) {
		this.anchor.x = this.bounds.x - x;
		this.anchor.y = this.bounds.y - y;
		this.state = 1;
		this.update();
	}
	onTouchMoved(x, y) {
		this.bounds.x = this.anchor.x + x;
		this.bounds.y = this.anchor.y + y,
		this.update();
	}
	onTouchEnded(x, y) {
		this.state = 0;
		this.onTouchMoved(x, y);
	}
	update() {
		render.begin();

		const label = this.label;
		const {x, y, width, height} = this.bounds
		render.fillPattern(background, 0, 0, render.width, render.height, 0, 0, background.width, background.height);
		render.fillRectangle(render.makeColor(0, 0, 128), x, y, width, height);
		render.drawText(label, font, this.state ? white : black,
			((width - render.getTextWidth(label, font)) >> 1) + x,
			((height - font.height) >> 1) + y
		);

		render.end();
	}
}

const dragger = new Dragger((render.width - button.width) >> 1, (render.height - (button.height >> 1)) >> 1, "Drag Me", button);

const touch = new globalThis.device.sensor.Touch({
	onSample() {
		const points = touch.sample();
		if (!points) return;

		const last = this.points[0];

		if (0 === points.length) {
			if (last) {
				last.target?.onTouchEnded(last.x, last.y);
				this.points[0] = undefined;
			}
			return;
		}

		const {x, y} = points[0];

		if (last) {
			last.x = x;
			last.y = y;
			last.target?.onTouchMoved(x, y);
			return;
		}

		const entry = { x, y };
		this.points[0] = entry;
		entry.target = dragger.contains(x, y) ? dragger : null;
		entry.target?.onTouchBegan(x, y);
	}
});
touch.points = new Array(1);

function getFont(name, size) {
	const font = parseBMF(new Resource(`${name}-${size}.fnt`));
	font.bitmap = parseRLE(new Resource(`${name}-${size}-alpha.bm4`))
	return font;
}
