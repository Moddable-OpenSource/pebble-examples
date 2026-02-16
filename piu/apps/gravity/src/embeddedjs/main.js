/*
 * Copyright (c) 2016-2023 Moddable Tech, Inc.
 *
 *   This file is part of the Moddable SDK.
 * 
 *   This work is licensed under the
 *       Creative Commons Attribution 4.0 International License.
 *   To view a copy of this license, visit
 *       <http://creativecommons.org/licenses/by/4.0>
 *   or send a letter to Creative Commons, PO Box 1866,
 *   Mountain View, CA 94042, USA.
 *
 */

import {} from "piu/MC";
import Accelerometer from "embedded:sensor/Accelerometer"

const backgroundSkin = new Skin({ fill:screen.color ? "#5555AA" : "gray" });
const gridColor = screen.color ? "#000055" : "black";
const gridTexture = new Texture("grid.png");

class TestBehavior extends Behavior {
	onCreate(application, $) {
		this.data = $;
		this.accelerometer = new Accelerometer({});
	}
	onDisplaying(application) {
		application.interval = 50;
		application.start();
	}
	onTimeChanged(application) {
		let data = this.data;
		let sample = this.accelerometer.sample();
		if ((data.x != sample.x) || (data.y != sample.y)) {
			data.x = sample.x;
			data.y = sample.y;
			application.distribute("onDataChanged");
		}
	}
}

class StarBehavior extends Behavior {
	onCreate(star, $) {
		this.data = $;
		this.degree = 0;
	}
	onDisplaying(star) {
		this.vx = 0;
		this.vy = 0;
		this.x = star.x;
		this.y = star.y;
		if (screen.round) {
			this.radius = Math.round((star.container.width - star.width) / 2);
		}
		else {
			this.width = star.container.width - star.width;
			this.height = star.container.height - star.height;
		}
		star.interval = 20;
		star.start();
	}
	onTimeChanged(star) {
		const data = this.data;
		let sx = data.x / 500;
		let sy = data.y / 500;
		let delta = data.delta;
		let { x, y, width, height, vx, vy } = this;
		sx = 0 - sx;
		sy = 0 - sy;
		
		let ax = Math.abs(sx);
		if (ax > 1) {
			ax -= 1;
			vx += (Math.sign(sx) * ax);
		}
		else {
			vx = 0;
		}
		let dx = vx * delta;
		x += dx;
		
		let ay = Math.abs(sy);
		if (ay > 1) {
			ay -= 1;
			vy += (Math.sign(sy) * ay);
		}
		else {
			vy = 0;
		}
		let dy = vy * delta;
		y += dy;
		
		if (screen.round) {	
			const r = this.radius;
			x -= r;
			y -= r;
			if ((x**2 + y**2) > r**2) {
				let a = 2 * Math.atan2(y, x);
				let cos = Math.cos(a);
				let sin = Math.sin(a);
				let x0 = x - dx;
				let y0 = y - dy;
				let x1 = cos*x0 + sin*y0;
				let y1 = sin*x0 - cos*y0;
				x = x1 - dx;
				y = y1 - dy;
				vx = -vx;
				vy = -vy;
			}
			x += r;
			y += r;
		}
		else {		
			if (x < 0) {
				x = 0;
				vx = -vx;
			}
			else if (x > width) {
				x = width;
				vx = -vx;
			}
			if (y < 0) {
				y = 0;
				vy = -vy;
			}
			else if (y > height) {
				y = height;
				vy = -vy;
			}
		}
		
		this.vx = vx;
		star.x = this.x = x;

		this.vy = vy;
		star.y = this.y = y;
		
		let degree = this.degree + 1;
		if (degree > 360)
			degree -= 360;
		this.degree = degree;
		star.r = (this.degree / 180) * Math.PI;
	}
	onUndisplaying(star) {
		star.stop();
	}
}

class GridBehavior extends Behavior {
	onCreate(port, $) {
		this.data = $;
	}
	onDataChanged(port) {
		port.invalidate();
	}
	onDraw(port) {
		const w = port.width;
		const h = port.height;
		let gx = (this.data.x) / 4000;
		let gy = (this.data.y) / 4000;
		let dx = (gx * 40) / w;
		let dy = (gy * 40) / h;		
		let sx = -gx;
		for (let x = 0; x < w; x += 20) {
			let sy = -gy;
			for (let y = 0; y < h; y += 20) {
				let v = 20 * (5 + Math.round(2.5 * (sx + sy)));
				port.drawTexture(gridTexture, gridColor, x, y, v, 0, 20, 20);
				sy += dy;
			}
			sx += dx;
		}
	}
}

let TestApplication = Application.template($ => ({
	skin:backgroundSkin, Behavior:TestBehavior,
	contents: [
		Port($, { width:screen.width - screen.width % 20, height:screen.height - screen.height % 20, Behavior:GridBehavior }),
		SVGImage($, { left:(screen.width - 80) >> 1, width:80, top:(screen.height - 80) >> 1, height:80, path:`star.pdc`, Behavior:StarBehavior }),
	]
}));

export default new TestApplication(
	{ x:0, y:0, delta:0.2 }, 
	{ commandListLength:4000, displayListLength:4000, touchCount:0, pixels: screen.width * 4 }
);
