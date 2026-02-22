import parseRLE from "commodetto/parseRLE";

const image = {
	"size": 3368,
	"header": [109,100,0,21,0,144,0,168]
};

export default class {
	onCreate(application, $) {
		this.$ = $;
		
		this.platform = "flint";
		this.serialNumber = encodeURIComponent(device.info.serialNumber ?? "qemu0123456789");
		
		this.data = new Uint8Array(new SharedArrayBuffer(image.size));
		this.data.set(image.header, 0);
		const bitmap = parseRLE(this.data.buffer);
		const texture = new Texture(null, null, bitmap);
		const skin = new Skin({ texture, width:texture.width, height:texture.height });
		application.first.skin = skin;
		
		this.fonts = {
			"large": "bold 48px OpenSans",
			"medium": "bold 40px OpenSans",
			"small": "bold 32px OpenSans",
		};
		
	}
	onDataChanged(application) {
	}
}