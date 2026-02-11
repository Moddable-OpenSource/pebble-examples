import Location from "embedded:sensor/Location";

console.log("hello, location");

const location = new Location({
	onSample() {
		console.log("Location : " + JSON.stringify(this.sample()));
		this.close();
	}
});
location.configure({enableHighAccuracy: false});
