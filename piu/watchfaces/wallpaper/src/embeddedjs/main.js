const baseURL = "ws://localhost:8080/";
// const baseURL = "ws://moddable.com/ps/";

import Accelerometer from "embedded:sensor/Accelerometer"
import KV from "embedded:storage/key-value"

import Behavior from "behavior";

const backgroundSkin = new Skin({ fill:"black" });

const setupSkin = new Skin({ fill:"white" });
const setupStyle = new Style({ font:"bold 18px Gothic", color:"black" });

class FaceApplicationBehavior extends Behavior {
	onCreate(application, $) {
		super.onCreate(application, $);
		$.CLOCK.style = new Style({ font:this.fonts.large, horizontal:"center", vertical:"top", color:"white" });
		$.QRCODE.string = `${baseURL}${this.platform}/${this.serialNumber}/index.html`;
		
		this.accelerometer = new Accelerometer({
			onTap: (direction) => {
				application.defer("onTap", direction);
			}
		});

		this.buffers = [];	
		const url = new URL(`${baseURL}${this.platform}/${this.serialNumber}`);
		const which = device.network[url.protocol.slice(0, -1)];
		this.imageName = this.platform + ".bm4";
		this.styleName = this.platform + ".json";
		let dataOffset = 0;
		let jsonBuffer = null;
		const ws = new which.io({
			...which,
			host: url.hostname,
			port: url.port || (which.secure ? 443 : 80),
			path: url.pathname,
			onReadable: (count, options) => {
// 				console.log(`onReadable ${count} bytes, binary ${options.binary}, more ${options.more}`);
				if (options.binary) {
					const buffer = new Uint8Array(ws.read(count));
					this.data.set(buffer, dataOffset);
					dataOffset += buffer.length;
					this.onDataChanged(application);
					if (options.more)
						return;
					device.files.delete(this.imageName);
					const file = device.files.openFile({ path:this.imageName, mode:"w+", size:this.data.byteLength });
					file.write(this.data, 0);
					file.close();
					dataOffset = 0;
				}
				else {
					if (jsonBuffer)
						jsonBuffer = jsonBuffer.concat(ws.read(count));
					else
						jsonBuffer = ws.read(count);
					if (options.more)
						return;
					device.files.delete(this.styleName);
					const file = device.files.openFile({ path:this.styleName, mode:"w+", size:jsonBuffer.byteLength });
					file.write(jsonBuffer, 0);
					file.close();
					this.onStyleChanged(application, jsonBuffer);
					jsonBuffer = null;
				}
			},
			onWritable: (count) => {
				let buffers = this.buffers;
				while (buffers.length) {
					let buffer = buffers[0];
					const size = buffer.size - buffer.offset;
					if (size <= count) {
						const view = new Uint8Array(buffer.data, buffer.offset, size);
						const tmp = new Uint8Array(size);
						tmp.set(view);
						count = ws.write(tmp.buffer, { binary: buffer.binary });
						buffers.shift();
					}
					else if (0 < count) {
						const view = new Uint8Array(buffer.data, buffer.offset, count);
						const tmp = new Uint8Array(count);
						tmp.set(view);
						buffer.offset += count;
						count = ws.write(tmp.buffer, { binary: buffer.binary, more:true });
						break;
					}
					else
						break;
				}
			},
			onClose() {
				console.log("** Connection Closed **");
			},
			onError() {
				console.log("** Connection Error **");
			}
		});
		this.path = url.pathname;
	}
	onDataChanged(application) {
		super.onDataChanged(application);
		application.first.visible = false;
		application.first.visible = true;
	}
	onDisplaying(application) {
		let buffer;
		try {
			const file = device.files.openFile({ path:this.styleName });
			buffer = file.read(file.status().size, 0);
			file.close();
		}
		catch {
			buffer = ArrayBuffer.fromString(`{"size":"medium","horizontal":"center","vertical":"middle","color":"#ffffff"}`);
		}
		this.onStyleChanged(application, buffer);
		this.buffers.push({
			data: buffer,
			offset: 0,
			size: buffer.byteLength,
			binary: false,
		});
		try {
			const file = device.files.openFile({ path:this.imageName });
			file.read(this.data, 0);
			file.close();
		}
		catch {
		}
		this.onDataChanged(application);
		this.buffers.push({
			data: this.data.buffer,
			offset: 0,
			size: this.data.byteLength,
			binary: true,
		});
		watch.addEventListener('minutechange', e => this.onTimeChanged(application, e.date));
	}
	onStyleChanged(application, buffer) {
		const string = String.fromArrayBuffer(buffer);
		console.log(string);
		const json = JSON.parse(string);
		const color = json.color;
		const style = new Style({ font:this.fonts[json.size], horizontal:json.horizontal, vertical:json.vertical, color });
		this.$.CLOCK.style = style;
	}
	onTap(application, direction) {
		const qrCode = application.last;
		qrCode.visible = !qrCode.visible;
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
		this.$.CLOCK.string = string;
	}
}

const FaceApplication = Application.template($ => ({
	left:0, right:0, top:0, bottom:0, skin:backgroundSkin, Behavior:FaceApplicationBehavior,
	contents: [
		Content($, {}),
		Label($, { anchor:"CLOCK", left:5, right:5, top:0, bottom:0 }),
		Container($, {
			left:0, right:0, top:0, bottom:0, visible:false, skin:setupSkin,
			contents: [
				Label($, { left:0, right:0, top:0, height:screen.height - screen.width, style:setupStyle, string:"SETUP" }),
				QRCode($, { anchor:"QRCODE", width:screen.width, height:screen.width, bottom:0, }),
			]
		})
		
	]
}));

export default new FaceApplication({}, { 
	displayListLength:2048, 
	touchCount:0, 
	pixels: screen.width * 4,
});
