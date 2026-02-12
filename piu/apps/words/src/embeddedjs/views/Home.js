import Timeline from "piu/Timeline";
import View from "piu/View";
import assets from "assets";

const digits = [
	"zero",
	"one",
	"two",
	"three",
	"four",
	"five",
	"six",
	"seven",
	"eight",
	"nine",
	"ten",
	"eleven",
	"twelve",
	"thirteen",
	"fourteen",
	"fifteen",
	"sixteen",
	"seventeen",
	"eighteen",
	"nineteen",
	"twenty",
	"twenty-one",
	"twenty-two",
	"twenty-three",
	"twenty-four",
	"twenty-five",
	"twenty-six",
	"twenty-seven",
	"twenty-eight",
	"twenty-nine",
	"thirty",
	"thirty-one",
	"thirty-two",
	"thirty-three",
	"thirty-four",
	"thirty-five",
	"thirty-six",
	"thirty-seven",
	"thirty-eight",
	"thirty-nine",
	"forty",
	"forty-one",
	"forty-two",
	"forty-three",
	"forty-four",
	"forty-five",
	"forty-six",
	"forty-seven",
	"forty-eight",
	"forty-nine",
	"fifty",
	"fifty-one",
	"fifty-two",
	"fifty-three",
	"fifty-four",
	"fifty-five",
	"fifty-six",
	"fifty-seven",
	"fifty-eight",
	"fifty-nine",
];

class HomeBehavior extends View.Behavior {
	onCreate(container, $) {
		super.onCreate(container, $);
		container.skin = new Skin({ fill:controller.background });
		container.style = new Style({ font:assets.fonts[controller.fontIndex], color:controller.foreground })
	}
	onDisplaying(container) {
		this.onClockChanged(container, controller.clock);
	}
	onPressSelect(container) {
		controller.goWith(controller.model.settings);
	}
	onTap(application, direction) {
		controller.goWith(controller.model.settings);
	}
	onClockChanged(container, clock) {
		let hours = clock.hours;
		let minutes = clock.minutes;
		let words = ["it's"];
		if (minutes == 0) {
		}
		else if (minutes == 15) {
			words.push("a quarter");
			words.push("past");
		}
		else if (minutes < 30) {
			words.push(digits[minutes]);
			if (minutes == 1) {
				words.push("minute");
			}
			else if (minutes % 5) {
				words.push("minutes");
			}
			words.push("past");
		}
		else if (minutes == 30) {
			words.push("half");
			words.push("past");
		}
		else if (minutes == 45) {
			words.push("a quarter");
			words.push("to");
			hours++;
		}
		else {
			minutes = 60 - minutes;
			words.push(digits[minutes]);
			if (minutes == 1) {
				words.push("minute");
			}
			else if (minutes % 5) {
				words.push("minutes");
			}
			words.push("to");
			hours++;
		}
		hours %=24;
		if (hours == 0) {
			words.push("midnight");
		}
		else if (hours == 12) {
			words.push("noon");
		}
		else {
			words.push(digits[hours % 12]);
			if (minutes == 0) {
				words.push("o'clock");
			}
		}
		container.replace(container.first, new ClockColumn(words));
		container.container.purge();
	}
}

let ClockColumn = Column.template($ => ({
	contents: [
		$.map(($$, index) => new ClockLabel($$))
	],
}));

let ClockLabel = Label.template($ => ({
	height:44, string:$
}));


const HomeContainer = Container.template($ => ({
	Behavior:$.constructor.Behavior,
	contents: [
		Content($, {}),
	]
}));

class HomeTimeline extends Timeline {
	constructor(screen, view, other, direction) {
		super();
		this.duration = 250;
		this.simultaneous = true;
	}
}

export default class extends View {
	static get Behavior() { return HomeBehavior }
	
	constructor(data) {
		super(data);
	}
	get Template() { return HomeContainer }
	get Timeline() { return HomeTimeline; }
};
