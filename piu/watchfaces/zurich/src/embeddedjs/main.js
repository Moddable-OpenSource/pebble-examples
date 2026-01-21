const model = Pebble.color
? {
	background:"gray",
	frame:"black",
	face:"white",
}
: {
	background:"gray",
	frame:"black",
	face:"white",
}

class FaceApplicationBehavior {
	onCreate(application, $) {
		this.clock = {};
	}
	onDisplaying(application) {
		Pebble.addEventListener('minutechange', () => this.onTimeChanged(application));
	}
	onTimeChanged(application) {
		const date = new Date();
		this.clock.year = date.getFullYear();
		this.clock.month = date.getMonth();
		this.clock.date = date.getDate();
		this.clock.day = date.getDay();
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

class FaceHoursBehavior extends FaceHandBehavior {
	onDisplaying(content) {
		content.cx = 7;
		content.cy = 22;
		content.s = 144 / 240;
	}
	onClockChanged(content, clock) {
		this.onFractionChanged(content, (clock.hours % 12 + clock.minutes / 60) / 12);
	}
}

class FaceMinutesBehavior extends FaceHandBehavior {
	onDisplaying(content) {
		content.cx = 7;
		content.cy = 22;
		content.s = 144 / 240;
	}
	onClockChanged(content, clock) {
		this.onFractionChanged(content, clock.minutes / 60);
	}
}

class FaceSecondsBehavior extends FaceHandBehavior {
	onDisplaying(content) {
		content.cx = 12;
		content.cy = 30;
		content.s = 144 / 240;
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
	left:0, right:0, top:0, bottom:0, skin:new Skin({ fill:$.background }), Behavior:FaceApplicationBehavior,
	contents: [
		Content($, { skin: new Skin({ texture: new Texture(`face.png`), width:144, height:144, color:$.face }) }),
		Content($, { skin: new Skin({ texture: new Texture(`frame.png`), width:144, height:144, color:$.frame }) }),
		SVGImage($, { left:65, width:14, top:62, height:87, path:`hours.pdc`, Behavior:FaceHoursBehavior }),
		SVGImage($, { left:65, width:14, top:62, height:120,  path:`minutes.pdc`, Behavior:FaceMinutesBehavior }),
		Pebble.color ? SVGImage($, { left:60, width:24, top:54, height:104,  path:`seconds.pdc`, Behavior:FaceSecondsBehavior }) : null,
	]
}));

export default new FaceApplication(model, { 
	displayListLength:2048, 
	touchCount:0, 
	pixels: screen.width * 4,
});
