const dateStyle = new Style({ font:"bold 18px Gothic", color:"white" });

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
		application.last.string = date.toDateString();
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
		content.cx = 7;
		content.cy = 14;
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
		content.cx = 5;
		content.cy = 20;
		content.s = scale;
		content.x = container.x + (container.width >> 1) - content.cx;
		content.y = container.y + (container.height >> 1) - content.cy;
	}
	onClockChanged(content, clock) {
		this.onFractionChanged(content, clock.minutes / 60);
	}
}

class FaceSecondsBehavior extends FaceHandBehavior {
	onDisplaying(content) {
		const container = content.container;
		content.cx = 1;
		content.cy = 1;
		content.s = scale;
		content.x = container.x + (container.width >> 1) - content.cx;
		content.y = container.y + (container.height >> 1) - content.cy;
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
	Behavior:FaceApplicationBehavior,
	contents: [
		Content($, { skin: new Skin({ texture: new Texture(`dial.png`), width:screen.width, height:screen.height }) }),
		Container($, { 
			left:0, right:0, bottom:0, height:screen.width,
			contents: [
				SVGImage($, { left:0, width:14, top:0, height:79, path:`hours.pdc`, Behavior:FaceHoursBehavior }),
				SVGImage($, { left:0, width:10, top:0, height:100,  path:`minutes.pdc`, Behavior:FaceMinutesBehavior }),
				SVGImage($, { left:0, width:2, top:0, height:82,  path:`seconds.pdc`, Behavior:FaceSecondsBehavior }),
			]
		}),
		Label($, { left:0, right:0, top:4, height:24, style:dateStyle }),
	]
}));

export default new FaceApplication(null, { 
	displayListLength:2048, 
	touchCount:0, 
	pixels: screen.width * 4,
});
