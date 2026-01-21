const model = Pebble.color
? {
	background:"#FFAA00",
	frame:"#AA5500",
	face:"#FFFFFF",
	hours:"#550000",
	minutes:"#550000",
}
: {
	background:"gray",
	frame:"black",
	face:"white",
	hours:"black",
	minutes:"black",
}

class FaceApplicationBehavior {
	onCreate(application, $) {
		this.clock = {};
	}
	onDisplaying(application) {
		Pebble.addEventListener('minutechange', () => this.onTimeChanged(application));
	}
	onTimeChanged(application) {
		const date = new Date();
		this.clock.year = date.getFullYear();
		this.clock.month = date.getMonth();
		this.clock.date = date.getDate();
		this.clock.day = date.getDay();
		this.clock.hours = date.getHours();
		this.clock.minutes = date.getMinutes();
		application.distribute("onClockChanged", this.clock);
	}
}

class FaceHandBehavior {
	onIndexChanged(content, index) {
		const data = this.data;
		index *= 6;
		const x = data[index];
		const y = data[index+1];
		const sw = data[index+2];
		const sh = data[index+3];
		const sx = data[index+4];
		const sy = data[index+5];
		content.skin = new Skin({ texture:this.texture, x:sx, y:sy, width:sw, height:sh, color:this.color });
		const container = content.container;
		content.x = container.x + (container.width >> 1) - x;
		content.y = container.y + (container.height >> 1) - y;
		content.width = sw;
		content.height = sh;
	}
}

class FaceHoursBehavior extends FaceHandBehavior {
	onCreate(content, $) {
		this.data = new Int16Array(new Resource("hours.data"));
		this.color = $.hours;
		this.texture = new Texture(`hours.png`);
	}
	onClockChanged(content, clock) {
		this.onIndexChanged(content, ((clock.hours % 12) * 5) + Math.idiv(clock.minutes, 12));
	}
}

class FaceMinutesBehavior extends FaceHandBehavior {
	onCreate(content, $) {
		this.data = new Int16Array(new Resource("minutes.data"));
		this.color = $.minutes;
		this.texture = new Texture(`minutes.png`);
	}
	onClockChanged(content, clock) {
		this.onIndexChanged(content, clock.minutes);
	}
}

const FaceApplication = Application.template($ => ({
	left:0, right:0, top:0, bottom:0, skin:new Skin({ fill:$.background }), Behavior:FaceApplicationBehavior,
	contents: [
		Content($, { skin: new Skin({ fill:$.face }), width:144, height:144 }),
		Content($, { skin: new Skin({ texture: new Texture(`frame.png`), color:$.frame, width:144, height:144 }) }),
		Content($, { Behavior: FaceHoursBehavior, left:0, width:144, top:0, height:168 }),
		Content($, { Behavior: FaceMinutesBehavior, left:0, width:144, top:0, height:168 }),
	]
}));

export default new FaceApplication(model, { 
	displayListLength:2048, 
	touchCount:0, 
	pixels: screen.width * 4,
});
