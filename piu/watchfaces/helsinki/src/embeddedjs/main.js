const skins = Pebble.color
? {
	background:new Skin({ fill:"#005500" }),
	bar:new Skin({ fill:"#AAFFAA" }),
	digits:new Skin({ texture: new Texture(`digits.png`), width:24, height:40, variants:24, color:"#55FF55" }),
}
: {
	background:new Skin({ fill:"black" }),
	bar:new Skin({ fill:"white" }),
	digits:new Skin({ texture: new Texture(`digits.png`), width:24, height:40, variants:24, color:"white" }),
}
const dateStyle = new Style({ font:"bold 14px Gothic", color:"black" });
const days = Object.freeze([ "SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT" ]); 

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
	left:0, right:0, top:0, bottom:0, skin:$.background, Behavior:FaceApplicationBehavior,
	contents: [
		Content($, { left:6, skin:$.digits }),
		Content($, { left:36, skin:$.digits }),
		Content($, { left:60, skin:$.digits, variant:10 }),
		Content($, { left:84, skin:$.digits }),
		Content($, { left:114, skin:$.digits }),
		Label($, { left:0, right:0, top:0, skin:$.bar, style:dateStyle, string:"WEDNESDAY" }),
		Label($, { left:0, right:0, bottom:0, skin:$.bar, style:dateStyle, string:"2025-06-11" }),
	]
}));

export default new FaceApplication(skins, { 
	displayListLength:2048, 
	touchCount:0, 
	pixels: screen.width * 4,
});
