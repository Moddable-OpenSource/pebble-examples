class FaceApplicationBehavior {
	onDisplaying(application) {
		watch.addEventListener('minutechange', (clock) => {
			const date = clock.date;
			application.distribute("onClockChanged", {
				date,
				hours: date.getHours(),
				minutes: date.getMinutes(),
			});
		});
	}
	onResize(application) {
		application.distribute("onClockResized");
	}
}

class FaceHandBehavior {
	onFractionChanged(content, fraction) {
		const angle = ((-fraction * 2) - 1) * Math.PI;
		content.r = angle;
	}
	onClockResized(content) {
		const container = content.container;
		content.x = container.x + (container.width >> 1) - content.cx;
		content.y = container.y + (container.height >> 1) - content.cy;
	}
}

const scale = Math.min(screen.width, screen.height) / 240;

class FaceHoursBehavior extends FaceHandBehavior {
	onDisplaying(content) {
		content.cx = 8.5;
		content.cy = 25.5;
		content.s = scale;
		this.onClockResized(content);
	}
	onClockChanged(content, clock) {
		this.onFractionChanged(content, (clock.hours % 12 + clock.minutes / 60) / 12);
	}
}

class FaceMinutesBehavior extends FaceHandBehavior {
	onDisplaying(content) {
		content.cx = 7;
		content.cy = 27;
		content.s = scale;
		this.onClockResized(content);
	}
	onClockChanged(content, clock) {
		this.onFractionChanged(content, clock.minutes / 60);
	}
}

const FaceApplication = Application.template($ => ({
	Behavior:FaceApplicationBehavior,
	contents: [
		Content($, { bottom:0, skin: new Skin({ texture: new Texture(`dial.png`), width:screen.width, height:screen.height }) }),
		Container($, { 
			left:0, right:0, height:screen.width, bottom:0,
			contents: [
				SVGImage($, { left:0, width:18, top:0, height:84, path:`hours.pdc`, Behavior:FaceHoursBehavior }),
				SVGImage($, { left:0, width:18, top:0, height:136,  path:`minutes.pdc`, Behavior:FaceMinutesBehavior }),
			]
		}),
	]
}));

export default new FaceApplication(null, { 
	displayListLength:2048, 
	touchCount:0, 
	pixels: screen.width * 4,
});
