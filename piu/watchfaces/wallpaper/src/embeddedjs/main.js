import Accelerometer from "embedded:sensor/Accelerometer"
import parseBMP from "commodetto/parseBMP";
import parseRLE from "commodetto/parseRLE";

import config from "config" with { type:"json" };
const jsonName = "clock.json"

const backgroundSkin = new Skin({ fill:"gray" });
const defaultStyle = new Style({ font:config.fonts.large, horizontal:"center", vertical:"top", color:"white" });

class FaceApplicationBehavior {
	onCreate(application, $) {
		this.accelerometer = new Accelerometer({
			onTap: (direction) => {
				application.defer("onTap", direction);
			}
		});
		this.data = new Uint8Array(new SharedArrayBuffer(config.size));
		this.data.set(config.header, 0);
		const bitmap = config.name.endsWith(".bm4") ? parseRLE(this.data.buffer) : parseBMP(this.data.buffer);
		const texture = new Texture(null, null, bitmap);
		const skin = new Skin({ texture, width:texture.width, height:texture.height });
		application.first.skin = skin;
	}
	onDataChanged(application) {
		application.first.visible = false;
		application.first.visible = true;
	}
	onDisplaying(application) {
		this.http = new device.network.http.io({
			...device.network.http,
			host: "localhost",
			port: 8080,
		});
		try {
			const file = device.files.openFile({ path:config.name });
			file.read(this.data, 0);
			file.close();
			this.onDataChanged(application);
		}
		catch {
		}
		try {
			const file = device.files.openFile({ path:jsonName });
			const buffer = file.read(file.status().size, 0);
			file.close();
			this.onStyleChanged(application, buffer);
		}
		catch {
		}
		Pebble.addEventListener('minutechange', e => this.onTimeChanged(application, e.date));
	}
	onStyleChanged(application, buffer) {
		const string = String.fromArrayBuffer(buffer);
		console.log(string);
		const json = JSON.parse(string);
		const color = Pebble.color ? json.color : json.white ? "white" : "black";
		const style = new Style({ font:config.fonts[json.size], horizontal:json.horizontal, vertical:json.vertical, color });
		application.last.style = style;
	}
	onTap(application, direction) {
		let buffer = null;
		this.http.request({
			path: "/" + jsonName,
			headersMask: ["content-length"],
			headers: new Map([
				["user-agent", "pebble test"]
			]),
			onHeaders(status, headers, statusText) {
				console.log("### onHeaders " + status);
			},
			onReadable() {
				if (buffer)
					buffer = buffer.concat(this.read());
				else
					buffer = this.read();
			},
			onDone: () => {
				device.files.delete(jsonName);
				const file = device.files.openFile({ path:jsonName, mode:"w+", size:buffer.byteLength });
				file.write(buffer, 0);
				file.close();
				this.onStyleChanged(application, buffer);
			}
		});
		let data = this.data;
		let offset = 0;
		let behavior = this;
		let request = this.http.request({
			path: "/" + config.name,
			headersMask: ["content-length"],
			headers: new Map([
				["user-agent", "pebble test"]
			]),
			onHeaders(status, headers, statusText) {
				const length = parseInt(headers.get("content-length"));
				console.log("### onHeaders " + length);
			},
			onReadable() {
				const buffer = new Uint8Array(this.read());
				data.set(buffer, offset);
				offset += buffer.length;
				behavior.onDataChanged(application);
			},
			onDone: (/* error */) => {
				device.files.delete(config.name);
				const file = device.files.openFile({ path:config.name, mode:"w+", size:config.size });
				file.write(data, 0);
				file.close();
				this.onDataChanged(application);
			}
		});
	}
	onTimeChanged(application, date) {
		let hours = date.getHours();
		let minutes = date.getMinutes();
		let string = "";
		string += Math.idiv(hours, 10);
		string += hours % 10;
		string += ':';
		string += Math.idiv(minutes, 10);
		string += minutes % 10;
		application.last.string = string;
	}
}

const FaceApplication = Application.template($ => ({
	left:0, right:0, top:0, bottom:0, skin:backgroundSkin, Behavior:FaceApplicationBehavior,
	contents: [
		Content($, {}),
		Label($, { left:5, right:5, top:0, bottom:0, style:defaultStyle }),
	]
}));

export default new FaceApplication(null, { 
	displayListLength:2048, 
	touchCount:0, 
	pixels: screen.width * 4,
});
