import parseRLE from "commodetto/parseRLE";

const image = {
	"size": 45608,
	"header": [109,100,0,23,0,200,0,228]
};

export default class {
	onCreate(application, $) {
		this.$ = $;
		
		this.platform = "emery";
		this.serialNumber = encodeURIComponent(device.info.serialNumber ?? "qemu0123456789");
		
		this.data = new Uint8Array(new SharedArrayBuffer(image.size));
		this.data.set(image.header, 0);
		const bitmap = parseRLE(this.data.buffer);
		const texture = new Texture(null, null, bitmap);
		const skin = new Skin({ texture, width:texture.width, height:texture.height });
		application.first.skin = skin;
		
		this.fonts = {
			"large": "bold 64px OpenSans",
			"medium": "bold 56px OpenSans",
			"small": "bold 48px OpenSans",
		};
		
	}
	onDataChanged(application) {
	}
}