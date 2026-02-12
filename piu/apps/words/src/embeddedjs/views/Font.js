import View from "Menu";
import assets from "assets";

class FontBehavior extends View.Behavior {
	onCreate(container, $) {
		super.onCreate(container, $);
		this.onClockChanged(container, controller.clock);
	}
	onClockChanged(container, clock) {
		let hours = clock.hours;
		let minutes = clock.minutes;
		let string = "";
		string += Math.idiv(hours, 10);
		string += hours % 10;
		string += ':';
		string += Math.idiv(minutes, 10);
		string += minutes % 10;
		container.distribute("onStringChanged", string);
	}
	onSelect(container, index, item) {
		controller.fontIndex = index;
		controller.goBack(2);
	}
}

class FontItemBehavior extends View.ItemBehavior {
	onStringChanged(row, string) {
		row.first.string = string;
	}
}

const FontItemRow = Container.template($ => ({
	left:0, right:0, height:44, Behavior:FontItemBehavior,
	contents: [
		Label($, { left:6, right:0, style:new Style({ font:assets.fonts[$.fontIndex] }) }),
	],
}));

export default class extends View {
	static get Behavior() { return FontBehavior }
	static get Item() { return FontItemRow }
	constructor(data) {
		super(data);
		this.selection = controller.fontIndex;
	}
};
