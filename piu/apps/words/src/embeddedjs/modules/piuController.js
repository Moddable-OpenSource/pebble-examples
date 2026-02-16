class Controller extends Behavior {
	constructor() {
		super();
		this.forgottenHistory = 0;
		this.going = 0;
		this.history = [];
		this.view = null;
	}
	display(container, view, backwards) {
		if (this.view) {
			this.onScreenUndisplaying(container, this.view);
			if (backwards)
				this.view.runTransitionBackwards(view);
			else {
				if (this.view.historical)
					this.history.push(this.view);
				view.runTransitionForwards(this.view);
			}
		}
		else {
			this.container.add(new view.Template(view, { left:0, width:container.width, top:0, height:container.height }));
			this.going = 0;
			this.onScreenDisplayed(container, view);
		}
		this.view = view;
		if (this.forgottenHistory) {
			this.history.length = this.forgottenHistory;
			this.forgottenHistory = 0;
		}
		trace("HISTORY:");
		this.history.forEach(view => trace(" " + view.id));
		trace("\n");
	}
	forgetHistory(forgottenHistory = 1) {
		this.forgottenHistory = forgottenHistory;
	}
	goBack(count = 1) {
		if (this.history.length) {
			let view;
			while (count) {
				view = this.history.pop();
				count--;
			}
			this.going = -1;
			this.container.defer("display", view, true);
		}
	}
	goHome() {
		if (this.history.length) {
			let view = this.history[0];
			this.history.length = 0;
			this.going = -1;
			this.container.defer("display", view, true);
		}
	}
	goTo(id) {
		let View = importNow(id).default;
		if (View) {
			let view = new View();
			view.id = id;
			view.model = this.model;
			this.going = 1;
			this.container.defer("display", view, false);
		}
	}
	goWith(data) {
		let id = data.View;
		let View = importNow(id).default;
		if (View) {
			let view = new View(data);
			view.id = id;
			view.model = this.model;
			this.going = 1;
			this.container.defer("display", view, false);
		}
	}
	onBubble(container, id, param) {
		if (container.first.delegate(id, param))
			return true;
		let view = this.view;
		let method = view[id];
		if (method && method.call(view, container, param))
			return true;
		let c = this.history.length;
		for (let i = this.history.length - 1; i >= 0; i--) {
			view = this.history[i];
			method = view[id];
			if (method && method.call(view, container, param))
				return true;
		}
	}
	onCreate(container, $) {
		this.container = container;
		this.model = $;
		this.clock = {};
		watch.addEventListener('minutechange', () => this.onTimeChanged(container));
	}
	onDisplaying(container) {
		let history = [];
		const home = this.model.home;
		const View = importNow(home.View).default;
		let view = new View(home);
		view.id = home.View;
		view.model = this.model;
		this.history = history;
		this.display(container, view, false);
	}
	onFinished(container) {
		container.distribute("onTimeout");
	}
	onScreenDisplayed(container, view) {
		container.first.distribute("onDisplayed");
	}
	onScreenUndisplaying(container, view) {
		container.first.distribute("onUndisplaying");
	}
	onTimeChanged(container) {
		const date = new Date();
		this.clock.year = date.getFullYear();
		this.clock.month = date.getMonth();
		this.clock.date = date.getDate();
		this.clock.day = date.getDay();
		this.clock.hours = date.getHours();
		this.clock.minutes = date.getMinutes();
		container.distribute("onClockChanged", this.clock);
	}
	onTransitionEnded(container) {
		container.purge();
		this.going = 0;
		this.onScreenDisplayed(container, this.view);
		this.updateScreen();
	}
	redisplay() {
		this.onScreenUndisplaying(application, this.view);
		this.container.replace(this.container.first, new this.view.Template(this.view));
		this.onScreenDisplayed(application, this.view);
	}
	updateScreen() {
		if (this.going)
			return;
		let container = this.container.last;
		if (container)
			container.distribute("onUpdate");
	}
}

export default Controller;
