const dateStyle = new Style({ font:"bold 18px Gothic", color:"white" });

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
	onClockChanged(application, clock) {
		application.last.string = clock.date.toDateString();
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
		content.cx = 7;
		content.cy = 14;
		content.s = scale;
		this.onClockResized(content);
	}
	onClockChanged(content, clock) {
		this.onFractionChanged(content, (clock.hours % 12 + clock.minutes / 60) / 12);
	}
}

class FaceMinutesBehavior extends FaceHandBehavior {
	onDisplaying(content) {
		content.cx = 5;
		content.cy = 20;
		content.s = scale;
		this.onClockResized(content);
	}
	onClockChanged(content, clock) {
		this.onFractionChanged(content, clock.minutes / 60);
	}
}

class FaceSecondsBehavior extends FaceHandBehavior {
	onDisplaying(content) {
		content.cx = 1;
		content.cy = 1;
		content.s = scale;
		content.duration = 60000;
		this.onClockResized(content);
	}
	onClockChanged(content, clock) {
		this.onFractionChanged(content, clock.seconds / 60);
	}
}

const FaceApplication = Application.template($ => ({
	Behavior:FaceApplicationBehavior,
	contents: [
		Content($, { bottom:0, skin: new Skin({ texture: new Texture(`dial.png`), width:screen.width, height:screen.height }) }),
		Container($, { 
			left:0, right:0, height:screen.width, bottom:0,
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
