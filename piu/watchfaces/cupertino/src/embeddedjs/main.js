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
		content.cx = 10;
		content.cy = 10;
		content.s = scale;
		content.x = (screen.width >> 1) - content.cx;
		content.y = (screen.height >> 1) - content.cy;
	}
	onClockChanged(content, clock) {
		this.onFractionChanged(content, (clock.hours % 12 + clock.minutes / 60) / 12);
	}
}

class FaceMinutesBehavior extends FaceHandBehavior {
	onDisplaying(content) {
		content.cx = 10;
		content.cy = 10;
		content.s = scale;
		content.x = (screen.width >> 1) - content.cx;
		content.y = (screen.height >> 1) - content.cy;
	}
	onClockChanged(content, clock) {
		this.onFractionChanged(content, clock.minutes / 60);
	}
}

const FaceApplication = Application.template($ => ({
	Behavior:FaceApplicationBehavior,
	contents: [
		Content($, { skin: new Skin({ texture: new Texture(`dial.png`), width:screen.width, height:screen.height }) }),
		SVGImage($, { left:65, width:14, top:62, height:120,  path:`minutes.pdc`, Behavior:FaceMinutesBehavior }),
		SVGImage($, { left:65, width:14, top:62, height:87, path:`hours.pdc`, Behavior:FaceHoursBehavior }),
	]
}));

export default new FaceApplication(null, { 
	displayListLength:2048, 
	touchCount:0, 
	pixels: screen.width * 4,
});
