import Accelerometer from "embedded:sensor/Accelerometer"
import Controller from "piu/Controller";
import KV from "embedded:storage/key-value"
import assets from "assets";

const model = {
	data: {
		background: "#FFFFFF",
		foreground: "#000000",
		fontIndex: 0,
	},
	home: {
		View: "Home",
	},
	settings: {
		View: "Settings",
		items: [
			{
				title: "Invert",
			},
			{
				title: "Select Font",
				View: "Font",
				items: [
					{
						fontIndex: 0,
					},
					{
						fontIndex: 1,
					},
					{
						fontIndex: 2,
					},
					{
						fontIndex: 3,
					},
					{
						fontIndex: 4,
					},
				],
			},
			{
				title: "Set Background Color",
				View: "Color",
				property: "background",
			},
			{
				title: "Set Foreground Color",
				View: "Color",
				property: "foreground",
			},
		],
	},
};

class TestController extends Controller {
	onCreate(application, model) {
		super.onCreate(application, model);
		this.accelerometer = new Accelerometer({
			onTap: (direction) => {
				if (this.going)
					return;
				const target = application.first;
				if (target)
					target.defer("onTap", direction);
			}
		});
		this.storage = KV.open({path: "words", format: "string"});
		const background = this.storage.read("background")
		const foreground = this.storage.read("foreground")
		const font = this.storage.read("font")
		if (background !== undefined)
			model.data.background = background;
		if (foreground !== undefined)
			model.data.foreground = foreground;
		if (font !== undefined)
			model.data.fontIndex = parseInt(font);
	}
	get background() {
		return model.data.background;
	}
	set background(it) {
		model.data.background = it;
		this.storage.write("background", it);
	}
	get foreground() {
		return model.data.foreground;
	}
	set foreground(it) {
		model.data.foreground = it;
		this.storage.write("foreground", it);
	}
	get fontIndex() {
		return model.data.fontIndex;
	}
	set fontIndex(it) {
		model.data.fontIndex = it;
		this.storage.write("font", it);
	}
}

globalThis.controller = new TestController;

const TestApplication = Application.template($ => ({
	behavior:globalThis.controller,
}));

const application = new TestApplication(model, { commandListLength:2048, displayListLength:2048, touchCount:0, pixels: screen.width * 4,  });

export default application;
