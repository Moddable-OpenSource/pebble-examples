const graySkin = new Skin({ fill:"gray" });

class ClockBehavior extends Behavior {
	onDisplaying(image) {
		image.start();
	}
	onFinished(image) {
		image.time = 0;
		image.start();
	}
	onTimeChanged(image) {
		let fraction = image.fraction;
		if (fraction < 0.5)
			fraction = 1 + fraction;
		else
			fraction = 2 - fraction;
		image.sx = image.sy = fraction;
	}
};

class TestApplicationBehavior {
}

const TestApplication = Application.template($ => ({
	Behavior:TestApplicationBehavior, skin:graySkin,
	contents: [
		SVGImage($, { bottom:20, path:`clock_sequence.pdc`, Behavior: ClockBehavior }),
	]
}));

export default new TestApplication({}, { displayListLength:2048, touchCount:0, pixels: screen.width * 4,  });
