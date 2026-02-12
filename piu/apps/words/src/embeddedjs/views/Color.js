import View from "piu/View";
import assets from "assets";

const colors = [
	[ "#000000", "#550000", "#AA0000", "#FF0000" ],
	[ "#000000", "#005500", "#00AA00", "#00FF00" ],
	[ "#000000", "#000055", "#0000AA", "#0000FF" ],
];

class ColorPickerBehavior extends View.Behavior {
	onCreate(container, $) {
		super.onCreate(container, $);
		const color = controller[$.data.property];
		const r = parseInt(color.substring(1,3), 16);
		const g = parseInt(color.substring(3, 5), 16);
		const b = parseInt(color.substring(5, 7), 16);
		this.componentIndex = 0;
		this.componentValues = [r / 0x55, g / 0x55, b / 0x55];
		container.distribute("onIndexChanged", this.componentIndex);
		container.distribute("onValueChanged", this.componentValues);
	}
	onChangeIndex(container, direction) {
		this.componentIndex += direction;
		container.distribute("onIndexChanged", this.componentIndex);
	}
	onChangeValue(container, direction) {
		let componentValue = this.componentValues[this.componentIndex];
		componentValue += direction;
		if ((componentValue < 0) || (3 < componentValue))
			return;
		this.componentValues[this.componentIndex] = componentValue;	
		container.distribute("onValueChanged", this.componentValues);
	}
	onPressBack(container) {
		if (this.componentIndex == 0)
			return super.onPressBack(container);
		this.onChangeIndex(container, -1);
		return true;
	}
	onPressSelect(container) {
		if (this.componentIndex == 2) {
			const color = this.componentValues.reduce((result, value) => result + (value * 0x55).toString(16).padStart(2, "0"), "#");
			controller[this.view.data.property] = color;
			controller.goBack(2);
		}
		this.onChangeIndex(container, 1);
		return true;
	}
	onPressDown(container) {
		this.onChangeValue(container, -1);
		return true;
	}
	onPressUp(container) {
		this.onChangeValue(container, 1);
		return true;
	}
};

class ColorPortBehavior extends Behavior {
	onCreate(port) {
		this.color = 0;
	}
	onDraw(port) {
		port.fillColor(this.color, 0, 0, port.width, port.height);
	}
	onValueChanged(port, componentValues) {
		const r = componentValues[0];
		const g = componentValues[1];
		const b = componentValues[2];
		this.color = rgb(components[r], components[g], components[b]);
		port.invalidate();
	}
}

class ColorLabelBehavior extends Behavior {
	onCreate(label, $) {
		this.background = $.data.property == "background";
		label.skin = new Skin({ fill:controller.background });
		label.style = new Style({ font:assets.fonts[controller.fontIndex], color:controller.foreground });
		this.onClockChanged(label, controller.clock);
	}
	onClockChanged(label, clock) {
		let hours = clock.hours;
		let minutes = clock.minutes;
		let string = "";
		string += Math.idiv(hours, 10);
		string += hours % 10;
		string += ':';
		string += Math.idiv(minutes, 10);
		string += minutes % 10;
		label.string = string;
	}
	onValueChanged(label, componentValues) {
		const r = componentValues[0];
		const g = componentValues[1];
		const b = componentValues[2];
		const color = rgb(components[r], components[g], components[b]);
		if (this.background)
			label.skin = new Skin({ fill:color });
		else
			label.style = new Style({ font:assets.fonts[controller.fontIndex], color });
	}
}

class ComponentPortBehavior extends Behavior {
	onCreate(port, $) {
		this.reds = new Array(7).fill(0);
		this.greens = new Array(7).fill(0);
		this.blues = new Array(7).fill(0);
		this.componentIndex = 0;
		this.componentValues = [0, 0, 0];
		this.texture = new Texture(`disk.png`);
		this.skin = new Skin({ texture:this.texture, x:44, y:0, width:52, height:80, top:30, bottom:30, color:assets.colors.WHITE });
	}
	onDraw(port) {
		let componentValues = this.componentValues;
		let y = 8;
		for (let j = 3; j >= 0; j--) {
			let x = 32;
			for (let i = 0; i < 3; i++) {
				port.drawTexture(this.texture, colors[i][j], x, y, 4, 0, 36, 36);
				if (j == componentValues[i]) {
					port.drawTexture(this.texture, assets.colors.WHITE, x - 4, y - 4, 0, 36, 44, 44);
				}
				x += 52;
			}
			y += 44;
		}
		port.drawSkin(this.skin, 24 + (this.componentIndex * 52), 0, 52, 184);
	}
	onIndexChanged(port, componentIndex) {
		this.componentIndex = componentIndex;
		port.invalidate();
	}
	onValueChanged(port, componentValues) {
		this.componentValues = componentValues;
		port.invalidate();
	}
}
const components = [ 0x00, 0x55, 0xAA, 0xFF ];

const ColorContainer = Container.template($ => ({
	skin:assets.skins.black, Behavior:$.constructor.Behavior,
	contents: [
		Label($, { left:0, right:0, top:0, height:42, Behavior:ColorLabelBehavior }),
		Port(0, { left:0, right:0, top:44, height:184, Behavior:ComponentPortBehavior }),
	]
}));

export default class extends View {
	static get Behavior() { return ColorPickerBehavior }
	
	constructor(data) {
		super(data);
	}
	get Template() { return ColorContainer }
};
