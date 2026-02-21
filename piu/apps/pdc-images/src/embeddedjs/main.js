const graySkin = new Skin({ fill:"gray" });

class ImageBehavior extends Behavior {
	onAnimate(image) {
		image.duration = 1500;
		image.time = 0;
		image.start();
	}
	onDisplaying(image) {
		this.delta = (image.container.width >> 1) + image.width;
		image.tx = this.delta;
	}
	onFinished(image) {
		image.r = 0;
		image.tx = this.delta;
		let next = image.next ?? image.container.first;
		next.delegate("onAnimate");
	}
	onTimeChanged(image) {
		let fraction = image.fraction;
		if (fraction < 0.4) {
			fraction = Math.quadEaseOut(0.4 - fraction);
			image.r = fraction * Math.PI;
			image.tx = this.delta * fraction;
		}
		else if (fraction > 0.6) {
			fraction = Math.quadEaseOut(0.6 - fraction);
			image.r = fraction * Math.PI;
			image.tx = this.delta * fraction;
		}
		else {
			image.r = 0;
			image.tx = 0;
		}
	}
};

class TestApplicationBehavior {
	onDisplaying(application) {
		application.duration = 1000;
		application.first.delegate("onAnimate");
	}
}

const TestApplication = Application.template($ => ({
	Behavior:TestApplicationBehavior, skin:graySkin,
	contents: [
		SVGImage(6, { path:`Pebble_80x80_Incoming_call_centered.pdc`, Behavior: ImageBehavior }),
		SVGImage(5, { path:`Pebble_80x80_Scheduled_event.pdc`, Behavior: ImageBehavior }),
		SVGImage(4, { path:`Pebble_80x80_Outgoing_call.pdc`, Behavior: ImageBehavior }),
		SVGImage(3, { path:`Pebble_80x80_Pay_bill.pdc`, Behavior: ImageBehavior }),
		SVGImage(3, { path:`Pebble_80x80_Stocks_event.pdc`, Behavior: ImageBehavior }),
	]
}));

export default new TestApplication({}, { displayListLength:4096, touchCount:0, pixels: screen.width * 4,  });
