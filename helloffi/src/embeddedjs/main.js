console.log("Hello, FFI.");

try {	
	trace(`Natives.add(2, 3) = ${ Natives.add(2, 3) }\n`);
	trace(`Natives.addSquares(3, 4) = ${ Natives.addSquares(3, 4) }\n`);
	const bytes = new Uint8Array(5);
	Natives.hello("hello", bytes.buffer, bytes.length);
	trace(`bytes = ${ bytes }\n`);
	
	trace(`catenate("5", "6") = ${ Natives.catenate("5", "6") }\n`);
	
	const date = new Date();
	trace(`aujourd'hui = ${ Natives.nameDay(date.getDay()) }\n`);
	
	const buffer = new ArrayBuffer(12);
	const view = new DataView(buffer);
	view.setUint8(0, 1, true);
	view.setUint16(2, 2, true);
	view.setUint32(4, 4, true);
	trace(`${ Natives.abcToString(view.buffer) }\n`);
	
	trace(`${ view.getUint8(0, true) }, ${ view.getUint16(2, true) }, ${ view.getUint32(4, true) }\n`);
} 
catch(error) {
	console.log("FFI Error: " + error);
}
