/*
 * Copyright (c) 2016-2020 Moddable Tech, Inc.
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

import {} from "piu/MC";
import Compass from "embedded:sensor/Compass"

const backgroundSkin = new Skin({ fill:screen.color ? "#AAAAFF" : "white"  });
const letterStyle = new Style({ font:"bold 24px Gothic", color:"white" });
const letterSkin = new Skin({ texture:new Texture("dot.png"), width:24, height:24, color:screen.color ? "#0000AA" : "black" });

class CompassBehavior {
	onCreate(image) {
		this.heading = 0;
		this.compass = new Compass({
			onSample: () => {
				let sample = this.compass.sample();
// 				console.log(sample.heading);
				if (this.heading != sample.heading) {
					this.heading = sample.heading;
					this.onHeadingChanged(image);
				}
			}
		});
	}
	onDisplaying(image) {
		let screen = image.container;
		this.radius = (Math.min(screen.width, screen.height) - image.next.width) >> 1;
		console.log(`#### ${ screen.width } ${ screen.height } ${ this.radius }`);
		image.s = this.radius / (image.width >> 1);
		this.onHeadingChanged(image);
	}
	onHeadingChanged(image) {
		let rotation = (this.heading / 180) * Math.PI;
		image.r = rotation;
		
		const screen = image.container;
		const north = image.next;
		const south = north.next;
		const east = south.next;
		const west = east.next;
		const { width, height } = screen;
		
		rotation += Math.PI / 2;
		const radius = this.radius;
		const cos =  Math.round(radius * Math.cos(rotation))
		const sin =  Math.round(radius * Math.sin(rotation))
		console.log(`#### ${ this.radius } ${ cos } ${ sin }`);
		
		north.x = ((width - north.width) >> 1) + cos;
		north.y = ((height - north.height) >> 1) - sin;
		south.x = ((width - south.width) >> 1) - cos;
		south.y = ((height - south.height) >> 1) + sin;
		east.x = ((width - east.width) >> 1) + sin;
		east.y = ((height - east.height) >> 1) + cos;
		west.x = ((width - west.width) >> 1) - sin;
		west.y = ((height - west.height) >> 1) - cos;
	}
}

let TestApplication = Application.template($ => ({
	skin:backgroundSkin, style:letterStyle,
	contents: [
		SVGImage(6, { path:`compass.pdc`, Behavior:CompassBehavior }),
		Label($, { left:0, width:24, top:0, height:24, string:"N", skin:letterSkin }),
		Label($, { left:0, width:24, top:0, height:24, string:"S", skin:letterSkin }),
		Label($, { left:0, width:24, top:0, height:24, string:"E", skin:letterSkin }),
		Label($, { left:0, width:24, top:0, height:24, string:"W", skin:letterSkin }),
	]
}));

export default new TestApplication(null, { displayListLength:4096, touchCount:0, pixels: screen.width * 4 });
