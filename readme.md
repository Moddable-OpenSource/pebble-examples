# Moddable SDK Examples for PebbleOS
Updated June 8, 2025

This repository hosts a collection of examples for working in Embedded JavaScript using the Moddable SDK on PebbleOS.

## Things you should know

- JavaScript is precompiled at build time to bytecode into a mod. See the Moddable SDK [documentation on mods](https://www.moddable.com/documentation/xs/mods) for details.
- The XS Mod is wrapped in a Pebble native application. The mod is stored as the first resource.
- The `setup.sh` script in each example builds the mod with `mcrun` and then triggers the normal Pebble app build with `rebble`.
- All JavaScript executes in [strict mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode). You aren't still depending on sloppy mode?
- All modules are standard ECMAScript modules, not CommonJS modules.
- Execution is performed under [Hardened JavaScript](https://hardenedjs.org). The primary observable consequence is that all primordials are immutable, which removes the possibility of [monkey patches](https://en.wikipedia.org/wiki/Monkey_patch). Note that the Hardened JavaScript restrictions on `Date` and `Math.random()` are not applied.
- The XS engine in this build is configured to eliminate language features unlikely to be useful on Pebble. If you try to invoke them, you will typically get a "dead strip" exception. Details of the omitted features are [below](#omitted).

## Getting started

> **Note**: These instructions are for macOS only.

- The Pebble build depends on a tool called `rebble`. Install that following their [instructions](https://github.com/richinfante/rebbletool?tab=readme-ov-file#setup).
	- You don't need to do the steps after `rebble sdk install latest`
	- Absolutely ignore the note on "Prerequisites for Apple Silicon: Install Rosetta 2". 
	- Each time you start a new terminal session, be sure to activate Rebble's Python virtual environment and add it to your `$PATH`. That looks something like this:

		```console
		cd ~/pebble/rebbletool/rebbletool
		source .env/bin/activate
		export PATH=~/pebble/rebbletool/rebbletool/bin:$PATH
		```

- You will need the Moddable SDK tools available to build the mod. To ensure they are synchronized with the version of the Moddable SDK used in PebbleOS firmware, you can use the macOS binaries [attached to this repository](https://github.com/Moddable-OpenSource/pebble-examples/releases).

	To use these binaries, add `$MODDABLE` to your environment variables, pointing to the root of the Moddable SDK, and add `$MODDABLE/build/bin/mac/release` to your `$PATH`. 
	
	Alternatively, [full set-up instructions](https://www.moddable.com/documentation/Moddable%20SDK%20-%20Getting%20Started) are also available. But, only do this if you are also building the Pebble firmware yourself.

- Before building, get [QEMU with Pebble firmware](https://github.com/Moddable-OpenSource/pebble-examples/releases). Then, launch QEMU:

	```console
	cd {{your QEMU directory}}
	xattr -d com.apple.quarantine qemu-system-arm
	./qemu-start.sh
	```

- Finally, run `hellopebble`:

	```console
	cd hellopebble
	./setup.sh
	```

	The screen in QMEU is blank because `hellopebble` has no user interface. The log viewer shows:

	```console
	(.env) hoddie@jphAir2022 hellopebble % rebble logs --qemu localhost:12344        
	[15:46:30] xsHost.c:130> unimplemented: xSemaphoreCreateMutex
	[15:46:30] xsHost.c:130> unimplemented: xQueueCreate
	[15:46:30] xsHost.c:130> Found mod "hellopebble.moddable.tech"
	[15:46:30] xsHost.c:130> Hello, Pebble.
	```

## Using QEMU

If you have never used QEMU before, it is not entirely obvious.

When you launch QEMU, the terminal shows the QEMU console and a separate emulator window is launched for the display. The console is more-or-less useless for JavaScript developers.

However, exiting QEMU is more difficult that you might imagine. The easiest way to exit is to press Control C in the QEMU console. (Don't ask where your mouse cursor went...)

These are the Pebble button mappings:

- Up - up arrow
- Down - down arrow
- Back - left arrow
- Select - right arrow

When QEMU first starts, PebbleOS shows an alert about having not been properly shut down. This will stay up until dismissed (press Back). You want to dismiss it because it will prevent your application from displaying on the screen.

## The examples

### Basics
- `hellopebble` – The "hello, world" of this collection. One line. Perfect place to start.
- `hellotimer` – Demonstrates use of `setTimeout`.
- `hellomodule` – Mods can contain multiple modules. This is a simple example of the mod's main module loading another module.

### Storage
- `hellokeyvalue` - Uses ECMA-419 Key-Value Storage to access Pebble Settings files for persistent storage. Supports storing binary data and strings. Future work to support integers. Special mode option to open Pebble settings files  created by built-in applications.
- `hellolocalstorage` – Uses [the `localStorage` global](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) from the Web standard to persist strings. This is implemented using ECMA-419 Key-Value Storage. Each application has its own local storage.

### Sensors
All sensors modules follow the [Sensor Class Pattern API](https://419.ecma-international.org/#-13-sensor-class-pattern) from the ECMA-419 standard.

- `helloaccelerometer` – Subscribes to accelerometer readings.
- `hellobattery` – Subscribes to battery and "plugged in" readings. 

> **Note**: The compass has also been implemented but there's not currently a good way to test that, so it is not included here.

### User experience
The APIs used here are a little rougher as the runtime simultaneously supports APIs from RockyJS, Pebble native graphics, and Moddable's Poco. This will get ironed out.

- `hellobutton` – Subscribes to Pebble button events.
- `hellopoco-gbitmap` – Renders bitmaps stored in `GBitmap` resources using Poco.
- `hellopiu-balls` – The classic Moddable SDK [piu/balls](https://github.com/Moddable-OpenSource/moddable/blob/public/examples/piu/balls/main.js) example for Pebble. The balls have been changed to 1-bit.- `hellopiu-coloredsquares` – Draws three colored squares. Take from the Piu chapter of [our book](https://www.moddable.com/book).- `hellopiu-gbitmap` – Draws a Pebble GBitmap PNG image using a Piu texture.- `hellopiu-jsicon` – Draws a Moddable SDK Bitmap using a Piu texture- `hellopiu-text` – The classic Moddable SDK [piu/text](https://github.com/Moddable-OpenSource/moddable/blob/public/examples/piu/text/main.js) example for Pebble. Demonstrates dynamic layout with different fonts and sizes. Ffonts are generated with `bmfont` to make resizing easy.hellopoco-gbitmap- `hellopoco-text` – Example of rendering text with Poco. Includes Japanese text to demonstrate UTF-8 multibyte suppport.
- `hellorocky` – The classic RockyJS watchface demo. Enhanced to change display modes with the Select button.
- `hellowatchface` – An example watchface app in JavaScript.

### Communication
These examples are the most challenging to run because they communicate with PebbleKit JS. The `./setup` script has been modified to launch PebbleKit JS. This uses `rebble` which means `rebble` is unavailable to display logs from the watch (QEMU). There must be a solution for this....

- `hellomessage` - An [ECMA-419 IO Class Pattern](https://419.ecma-international.org/#-9-io-class-pattern) style API to access Pebble's `app_message` API for communication between the watch and PebbleKit JS. 
- `hellohttpclient` - Uses the standard [ECMA-419 HTTP Client](https://419.ecma-international.org/#-20-http-client-class-pattern) to make HTTP requests. The HTTP Client implementation uses `app_message` to communicate with PebbleKit JS which uses XMLHttpRequest to make the actual request.
- `hellofetch` - Uses the [web standard `fetch()` API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) to make HTTP requests. The implementation is a subset of `fetch()`; specifically, it excludes features which require Web Streams. The `fetch()` implementation is built on the HTTP Client.

> **Note 1**: For most developers, `fetch()` is the right API for HTTP requests. The httpclient API is more memory efficient because it supports sending the request body in fragments, receiving the response body in fragment, and uses callbacks instead of promises. Naturally, as a more powerful low level API it is less convenient to use.

> **Note 2**: Copying the HTTP proxy for PebbleKit JS into each application is a bad idea. The HTTPClient proxy for PebbleKit JS should probably be rolled into an npm package so it can be managed and installed through the app's `package.json`: `@moddable/pkjs` on npm awaits!

<a id="omitted"></a>
## Omitted JavaScript features
This build of XS intentionally omits features of JavaScript that are unlikely to be useful on Pebble. This saves flash space. When a script invokes a feature that has been omitted, a "dead strip" exception is thrown. These features are stripped:

- `Proxy` and `Reflect` – primarily used for test frameworks and meta-programming techniques
- `Atomics` and `SharedArrayBuffer` – meaningless without Web Workers (which is not currently available on PebbleOS)
- `WeakMap`, `WeakRef`, `WeakSet` – used for tracking objects in JavaScript patches which isn't necessary on Pebble
- `BigInt` – IEEE-754 double precision floating point is already a stretch on Pebble; let's not multiply 1024-bit integers too
- `eval`, `Function` and `Generator` – JavaScript source code is compiled to bytecode at build time, so the parser is unnecessary at runtime. Details on the [blog](https://www.moddable.com/blog/eval/).

To be clear, these features could be made available on Pebble, they just aren't at this time.

On the other hand, because JavaScript developers can't seem to live without `RegExp` that is fully supported, as is `JSON` along with most everything else in the ES2025 edition of the JavaScript standard.

<a id="api-notes"></a>
## API notes

### Piu
Piu is partially enabled in this release. There are no known issues but the API is large. Only classes that have been tested are enabled. At this time, the available classes are:

- `Application`
- `Behavior`
- `Container`
- `Content`
- `Link`
- `Skin`
- `Style`
- `Text`
- `Texture`

To work with Pebble bitmaps as textures,  `Texture`  extends the `path` property of its dictionary. As before, if `path` is a string, it refers to a Moddable SDK resource; if it is a number, it refers to a Pebble resource.

