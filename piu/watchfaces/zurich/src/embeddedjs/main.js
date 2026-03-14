const backgroundSkin = new Skin({ fill:"gray" });

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

class FaceMinutesBehavior extends FaceHandBehavior {
	onDisplaying(content) {
		content.cx = 7;
		content.cy = 22;
		content.s = scale;
		this.onClockResized(content);
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
		content.duration = 60000;
		this.onClockResized(content);
	}
	onClockChanged(content, clock) {
		this.onFractionChanged(content, clock.seconds / 60);
	}
}

const FaceApplication = Application.template($ => ({
	skin:backgroundSkin, Behavior:FaceApplicationBehavior,
	contents: [
		Content($, { skin: new Skin({ texture: new Texture(`dial.png`), width:screen.width, height:screen.width }) }),
		SVGImage($, { left:0, width:14, top:0, height:87, path:`hours.pdc`, Behavior:FaceHoursBehavior }),
		SVGImage($, { left:0, width:14, top:0, height:120,  path:`minutes.pdc`, Behavior:FaceMinutesBehavior }),
		screen.color ? SVGImage($, { left:60, width:24, top:54, height:104,  path:`seconds.pdc`, Behavior:FaceSecondsBehavior }) : null,
	]
}));

export default new FaceApplication(null, { 
	displayListLength:2048, 
	touchCount:0, 
	pixels: screen.width * 4,
});
