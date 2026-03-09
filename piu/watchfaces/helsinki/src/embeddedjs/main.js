import Layout from "layout";

const days = Object.freeze([ "SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT" ]); 

class FaceApplicationBehavior {
	onDisplaying(application) {
		watch.addEventListener('secondchange', (clock) => {
			application.distribute("onClockChanged", clock);
		});
	}
	onClockChanged(application, clock) {
		const date = clock.date;
		const hours = date.getHours();
		const minutes = date.getMinutes();
		let content = application.first.first;
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
	Behavior:FaceApplicationBehavior,
	contents: [
		Layout($),
	]
}));

export default new FaceApplication(null, { 
	displayListLength:2048, 
	touchCount:0, 
	pixels: screen.width * 4,
});
