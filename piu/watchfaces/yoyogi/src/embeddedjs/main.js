class FaceApplicationBehavior {
	onDisplaying(application) {
		watch.addEventListener('secondchange', (clock) => {
			const date = clock.date;
			application.distribute("onClockChanged", {
				date,
				hours: date.getHours(),
				minutes: date.getMinutes(),
				seconds: date.getSeconds(),
			});
		});
	}
	onResize(application, fraction) {
		application.distribute("onClockResized", fraction);
	}
}

class FaceBlinkBehavior extends Behavior {
	onClockChanged(content, clock) {
		const container = content.container;
		if (container.height == screen.height)
			content.visible = !content.visible;
		else
			content.visible = false;
		const seconds = clock.seconds;
		const delta = 5;
		if (seconds < 15) {
			content.x = container.x + container.width - content.width - delta;
			content.y = container.y + delta;
		}
		else if (seconds < 30) {
			content.x = container.x + container.width - content.width - delta;
			content.y = container.y + container.height - content.height - delta;
		}
		else if (seconds < 45) {
			content.x = container.x + delta;
			content.y = container.y + container.height - content.height - delta;
		}
		else {
			content.x = container.x + delta;
			content.y = container.y + delta;
		}
	}
}

class FaceHandBehavior {
	onFractionChanged(content, fraction) {
		const angle = ((-fraction * 2) - 1) * Math.PI;
		content.r = angle;
	}
	onClockResized(content) {
		const container = content.container;
		content.x = (container.width >> 1) - content.cx;
		content.y = (container.height >> 1) - content.cy;
	}
}

const scale = Math.min(screen.width, screen.height) / 240;

class FaceHoursBehavior extends FaceHandBehavior {
	onDisplaying(content) {
		content.cx = 7;
		content.cy = 22;
		content.s = scale;
		this.onClockResized(content);
	}
	onClockChanged(content, clock) {
		this.onFractionChanged(content, (clock.hours % 12 + clock.minutes / 60) / 12);
	}
}

class FaceHoursShadowBehavior extends FaceHoursBehavior {
	onClockResized(content) {
		super.onClockResized(content);
		content.x += 3;
		content.y += 3;
	}
}

class FaceMinutesBehavior extends FaceHandBehavior {
	onDisplaying(content) {
		content.cx = 7;
		content.cy = 24;
		content.s = scale;
		this.onClockResized(content);
	}
	onClockChanged(content, clock) {
		this.onFractionChanged(content, clock.minutes / 60);
	}
}

class FaceMinutesShadowBehavior extends FaceMinutesBehavior {
	onClockResized(content) {
		super.onClockResized(content);
		content.x += 2;
		content.y += 2;
	}
}

const FaceApplication = Application.template($ => ({
	Behavior:FaceApplicationBehavior,
	contents: [
		Content($, { skin: new Skin({ texture: new Texture(`dial.png`), width:screen.width, height:screen.height }) }),
		Content($, { visible:false, left:0, top:0, skin: new Skin({ texture: new Texture(`blink.png`), width:20, height:20 }), Behavior:FaceBlinkBehavior }),
		SVGImage($, { left:0, width:14, top:0, height:87, path:`hours-shadow.pdc`, Behavior:FaceHoursShadowBehavior }),
		SVGImage($, { left:0, width:14, top:0, height:87, path:`hours.pdc`, Behavior:FaceHoursBehavior }),
		SVGImage($, { left:0, width:14, top:0, height:120,  path:`minutes-shadow.pdc`, Behavior:FaceMinutesShadowBehavior }),
		SVGImage($, { left:0, width:14, top:0, height:120,  path:`minutes.pdc`, Behavior:FaceMinutesBehavior }),
		Content($, { skin: new Skin({ texture: new Texture(`center.png`), width:10, height:10 }) }),
	]
}));

export default new FaceApplication(null, { 
	displayListLength:2048, 
	touchCount:0, 
	pixels: screen.width * 4,
});
