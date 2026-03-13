const appid = 'YOUR_API_KEY';

const url = new URL("http://api.openweathermap.org/data/2.5/weather");
url.search = (new URLSearchParams({
	appid,
	lat: 37.4419,
	lon: -122.1430,
	cnt: 1
})).toString();

const response = await fetch(url);
const json = await response.json();
console.log(`${json.name} is ${(json.main.temp - 273.15) | 0} Celsius`);

export {}