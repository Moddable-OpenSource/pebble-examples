class FaceApplicationBehavior {
	onCreate(application, $) {
		this.clock = {};
	}
	onDisplaying(application) {
		watch.addEventListener('minutechange', () => this.onTimeChanged(application));
	}
	onTimeChanged(application) {
		const date = new Date();
		this.clock.day = date.getDay();
		this.clock.hours = date.getHours();
		this.clock.minutes = date.getMinutes();
		application.distribute("onClockChanged", this.clock);
	}
}

class FaceHandBehavior {
	onFractionChanged(content, fraction) {
		const angle = ((-fraction * 2) - 1) * Math.PI;
		content.r = angle;
	}
}

const scale = Math.min(screen.width, screen.height) / 240;

class FaceHoursBehavior extends FaceHandBehavior {
	onDisplaying(content) {
		const container = content.container;
		content.cx = 8.5;
		content.cy = 25.5;
		content.s = scale;
		content.x = container.x + (container.width >> 1) - content.cx;
		content.y = container.y + (container.height >> 1) - content.cy;
	}
	onClockChanged(content, clock) {
		this.onFractionChanged(content, (clock.hours % 12 + clock.minutes / 60) / 12);
	}
}

class FaceMinutesBehavior extends FaceHandBehavior {
	onDisplaying(content) {
		const container = content.container;
		content.cx = 7;
		content.cy = 27;
		content.s = scale;
		content.x = container.x + (container.width >> 1) - content.cx;
		content.y = container.y + (container.height >> 1) - content.cy;
	}
	onClockChanged(content, clock) {
		this.onFractionChanged(content, clock.minutes / 60);
	}
}

const FaceApplication = Application.template($ => ({
	Behavior:FaceApplicationBehavior,
	contents: [
		Content($, { skin: new Skin({ texture: new Texture(`dial.png`), width:screen.width, height:screen.height }) }),
		Container($, { 
			left:0, right:0, bottom:0, height:screen.width,
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
