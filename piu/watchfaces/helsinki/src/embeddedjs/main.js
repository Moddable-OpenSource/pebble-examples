const blackSkin = new Skin({ fill:"black" });
const digitsSkin = new Skin({ texture: new Texture(`digits.png`), width:24, height:40, variants:24 });
const dateStyle = new Style({ font:"bold 14px Gothic", color:"black" });
const days = Object.freeze([ "SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT" ]); 
const whiteSkin = new Skin({ fill:"white" });

class FaceApplicationBehavior {
	onCreate(application, $) {
		this.clock = {};
		this.$ = $;
	}
	onDisplaying(application) {
		this.onTimeChanged(application);
		application.interval = 500;
		application.start();
	}
	onTimeChanged(application) {
		const date = new Date();
		const hours = date.getHours();
		const minutes = date.getMinutes();
		let content = application.first;
		content.variant = Math.idiv(hours, 10);
		content = content.next;
		content.variant = hours % 10;
		content = content.next;
		content.visible = !content.visible;
		content = content.next;
		content.variant = Math.idiv(minutes, 10);
		content = content.next;
		content.variant = minutes % 10;
		content = content.next;
		content.string = days[date.getDay()];
		content = content.next;
		content.string = date.toISOString().slice(0, 10);
	}
}

const FaceApplication = Application.template($ => ({
	Behavior:FaceApplicationBehavior, skin:blackSkin,
	contents: [
		Content($, { left:6, skin:digitsSkin }),
		Content($, { left:36, skin:digitsSkin }),
		Content($, { left:60, skin:digitsSkin, variant:10 }),
		Content($, { left:84, skin:digitsSkin }),
		Content($, { left:114, skin:digitsSkin }),
		Label($, { left:0, right:0, top:0, skin:whiteSkin, style:dateStyle, string:"WEDNESDAY" }),
		Label($, { left:0, right:0, bottom:0, skin:whiteSkin, style:dateStyle, string:"2025-06-11" }),
	]
}));

export default new FaceApplication({}, { displayListLength:2048, touchCount:0, pixels: screen.width * 4,  });
