console.log("hello, files");

const jsonData = {
	boolean: true,
	number: 20.26,
	string: "Pebble",
	object: {
		happy: "😀",
		array: [1, 2, 3]
	}
};

const path = "example.json";

device.files.delete(path);

let data = ArrayBuffer.fromString(JSON.stringify(jsonData));
let save = device.files.openFile({path, mode: "r+", size: data.byteLength});
save.write(data, 0);
save.close();

let load = device.files.openFile({path});
let loaded = load.read(load.status().size, 0);
load.close();

loaded = JSON.parse(String.fromArrayBuffer(loaded)); 
console.log(JSON.stringify(loaded, undefined, "  "));
