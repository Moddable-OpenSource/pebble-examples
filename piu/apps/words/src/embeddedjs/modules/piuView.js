import Timeline from "piu/Timeline";
const singleTransition = true;

class ViewBehavior extends Behavior {
	onCreate(container, view) {
		this.view = view;
	}
	onDisplayed(container) {
		container.focus();
	}
	onPressBack(container) {
		if (controller.history.length) {
			controller.goBack();
			return true;
		}
	}
	onUndisplaying(container) {
		controller.container.focus();
	}
}

class ViewTimeline extends Timeline {
	constructor(screen, view, other, direction) {
		super();
		if (controller.going != direction)
			this.from(screen, { x:screen.x - screen.width }, 250, Math.quadEaseOut, 0);
		else
			this.from(screen, { x:screen.x + screen.width }, 250, Math.quadEaseIn, 0);
		this.simultaneous = true;
	}
}

class View {
	static get Behavior() { return ViewBehavior }
	constructor(data) {
		this.data = data;
		trace("View\n");
	}
	get historical() {
		return true;
	}
	get Timeline() { 
		return ViewTimeline;
	}
	deleteAnchors(data) {
		var prototype = Content.prototype;
		for (var key in data) {
			var property = data[key];
			if (prototype.isPrototypeOf(property)) {
				//trace("delete anchor " + key + "\n");
				delete data[key];
			}
			else if (Array.prototype.isPrototypeOf(property))
				property.forEach(this.deleteAnchors, this);
			else if (Object.prototype.isPrototypeOf(property))
				this.deleteAnchors(property);
		}
	}
	purge() {
		this.deleteAnchors(this);
	}
	runTransitionBackwards(toView) {
		const container = controller.container;
		container.run(null);
//		container.replace(container.first, new toView.Template(toView));
//		this.purge();
//		return;
		let FromTimeline = this.Timeline;
		let ToTimeline = toView.Timeline;
		controller.container.run(new TimelineTransition(FromTimeline, ToTimeline), container.first, toView.Template, this, toView);
	}
	runTransitionForwards(fromView) {
		const container = controller.container;
		container.run(null);
//		container.replace(container.first, new this.Template(this));
//		fromView.purge();
//		return;
		let FromTimeline = fromView.Timeline;
		let ToTimeline = this.Timeline;
		controller.container.run(new TimelineTransition(FromTimeline, ToTimeline), container.first, this.Template, fromView, this);
	}
}

Object.freeze(View);

export default View;

class TimelineTransition extends Transition {
	constructor(FromTimeline, ToTimeline) {
		super(0);
		this.FromTimeline = FromTimeline;
		this.ToTimeline = ToTimeline;
	}
	onBegin(container, fromScreen, Template, fromView, toView) {
		this.fromScreen = fromScreen;
		const toScreen = this.toScreen = new Template(toView, { left:0, width:screen.width, top:0, height:screen.height });
		if (controller.going < 0)
			container.insert(toScreen, fromScreen);
		else
			container.add(toScreen);
		this.fromTimeline = new this.FromTimeline(fromScreen, fromView, toView, -1);
		this.toTimeline = new this.ToTimeline(toScreen, toView, fromView, 1);
		this.simultaneous = this.fromTimeline.simultaneous && this.toTimeline.simultaneous;
		const fromDuration = this.fromTimeline.duration;
		const toDuration = this.toTimeline.duration;
		let duration;
		if (this.simultaneous) {
			duration = Math.max(fromDuration, toDuration);
			this.fromFraction = fromDuration / duration;
			this.toFraction = (duration - toDuration) / duration;
		}
		else {
			duration = fromDuration + toDuration;
			this.fromFraction = fromDuration / duration;
			this.toFraction = toDuration / duration;
		}
		this.duration = duration;
	}
	onEnd(container, fromScreen, Template, fromView, toView) {
		this.toTimeline = null;
		this.fromTimeline = null;
		container.remove(fromScreen);
		fromView.purge();
// 		application.purge();
	}
	onStep(fraction) {
		if (this.simultaneous) {
			if (fraction < this.fromFraction) {
// 				this.fromScreen.visible = true;
				this.fromTimeline.fraction = (this.fromFraction - fraction) / this.fromFraction;
			}
			else {
// 				this.fromScreen.visible = false;
				this.fromTimeline.fraction = 0;
			}
			if (fraction > this.toFraction) {
// 				this.toScreen.visible = true;
				this.toTimeline.fraction = (fraction - this.toFraction) / (1 - this.toFraction);
			}
			else {
// 				this.toScreen.visible = false;
				this.toTimeline.fraction = 0;
			}
// 			trace(`${ this.fromTimeline.fraction } ${ this.toTimeline.fraction }\n`);
		}
		else {
			if (fraction < this.fromFraction) {
				this.fromScreen.visible = true
				this.fromTimeline.fraction = (this.fromFraction - fraction) / this.fromFraction;
				this.toScreen.visible = false
				this.toTimeline.fraction = 0;
			}
			else {
				this.fromScreen.visible = false
				this.fromTimeline.fraction = 0;
				this.toScreen.visible = true
				this.toTimeline.fraction = (fraction - this.fromFraction) / this.toFraction;
			}
		}
	}
};
