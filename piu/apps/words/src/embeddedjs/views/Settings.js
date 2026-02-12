import View from "ActionMenu";
import assets from "assets";

class SettingsBehavior extends View.Behavior {
	onSelect(container, index, item) {
		if (index > 0)
			return super.onSelect(container, index, item);
		const color = controller.background;
		controller.background = controller.foreground;
		controller.foreground = color;
		controller.goBack();
	}
}

export default class extends View {
	static get Behavior() { return SettingsBehavior }
	constructor(data) {
		super(data);
	}
};
