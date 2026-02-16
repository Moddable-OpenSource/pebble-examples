const backgroundSkin = new Skin({ fill:"gray" });

class FaceApplicationBehavior {
	onCreate(application, $) {
		this.clock = {};
	}
	onDisplaying(application) {
		watch.addEventListener('minutechange', () => this.onTimeChanged(application));
	}
	onTimeChanged(application) {
		const date = new Date();
		this.clock.hours = date.getHours();
		this.clock.minutes = date.getMinutes();
		this.clock.seconds = date.getSeconds();
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
		content.cx = 7;
		content.cy = 22;
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
		content.cx = 7;
		content.cy = 22;
		content.s = scale;
		content.x = (screen.width >> 1) - content.cx;
		content.y = (screen.height >> 1) - content.cy;
	}
	onClockChanged(content, clock) {
		this.onFractionChanged(content, clock.minutes / 60);
	}
}

class FaceSecondsBehavior extends FaceHandBehavior {
	onDisplaying(content) {
		content.cx = 12;
		content.cy = 30;
		content.s = scale;
		content.x = (screen.width >> 1) - content.cx;
		content.y = (screen.height >> 1) - content.cy;
		content.duration = 60000;
	}
	onClockChanged(content, clock) {
		content.stop();
		content.time = clock.seconds * 1000;
		content.start();
	}
	onTimeChanged(content) {
		this.onFractionChanged(content, content.fraction);
	}
}

const FaceApplication = Application.template($ => ({
	left:0, right:0, top:0, bottom:0, skin:backgroundSkin, Behavior:FaceApplicationBehavior,
	contents: [
		Content($, { skin: new Skin({ texture: new Texture(`dial.png`), width:screen.width, height:screen.width }) }),
		SVGImage($, { left:65, width:14, top:62, height:87, path:`hours.pdc`, Behavior:FaceHoursBehavior }),
		SVGImage($, { left:65, width:14, top:62, height:120,  path:`minutes.pdc`, Behavior:FaceMinutesBehavior }),
		screen.color ? SVGImage($, { left:60, width:24, top:54, height:104,  path:`seconds.pdc`, Behavior:FaceSecondsBehavior }) : null,
	]
}));

export default new FaceApplication(null, { 
	displayListLength:2048, 
	touchCount:0, 
	pixels: screen.width * 4,
});
