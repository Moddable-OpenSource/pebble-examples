import Location from "embedded:sensor/Location";

console.log("hello, location");

const location = new Location({
	onSample() {
		console.log("Location : " + JSON.stringify(this.sample()));
		this.close();
	}
});

// calling configure()) is optional.
// if configure() is called it should be immediately after creating the Location instance
location.configure({
	enableHighAccuracy: false,
	timeout: 5000,
	maximumAge: 0
});
