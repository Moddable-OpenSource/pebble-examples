# Moddable SDK Examples for PebbleOS
Updated May 27, 2025

This repository hosts a collection of examples for working in Embedded JavaScript using the Moddable SDK on PebbleOS.

## Things your should know

- JavaScript is precompiled at build time to bytecode into a mod. See the Moddable SDK [documentation on mods](https://www.moddable.com/documentation/xs/mods) for details.
- The XS Mod is wrapped in a Pebble native application. The mod is stored as the first resource.
- The `setup.sh` script in each example builds the mod with `mcrun` and then triggers the normal Pebble app build with `rebble`.
- All JavaScript executes in [strict mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode). You aren't still depending on sloppy mode?
- All modules as standard ECMAScript modules, not CommonJS modules.
- Execution is performed under [Hardened JavaScript](https://hardenedjs.org). The primary observable consequence is that all primordials are immutable, which removes the possibility of [monkey patches](https://en.wikipedia.org/wiki/Monkey_patch). Note that the Hardened JavaScript restrictions on `Date` and `Math.random()` are not applied.
- The XS engine in this build is configured to eliminate features to fit in the limited space. Therefore, many built-ins and methods are unavailable. If you try to invoke them, you will typically get a "dead strip" exception.

## Getting started

- The Pebble build depends on a tool called `rebble`. Install that following their [instructions](https://github.com/richinfante/rebbletool?tab=readme-ov-file#setup).
	- You don't need to do the steps after `rebble sdk install latest`
	- Absolutely ignore the note on "Prerequisites for Apple Silicon: Install Rosetta 2". 
	- Each time you start a new terminal session, be sure to activate Rebble's Python virtual environment and add it to your `$PATH`. That looks something like this:

		```
		cd ~/pebble/rebbletool/rebbletool
		source .env/bin/activate
		export PATH=~/pebble/rebbletool/rebbletool/bin:$PATH
		```

- You will need the Moddable SDK tools available to build the mod. To ensure they are synchronized with the version of the Moddable SDK used in PebbleOS firmware, you can use the macOS binaries [attached to this repository](https://github.com/Moddable-OpenSource/pebble-examples/releases).

	To use these binaries, add `$MODDABLE` to your environment variables, pointing to the root of the Moddable SDK, and add `$MODDABLE/build/bin/mac/release` to your `$PATH`. 
	
	Alternatively, [full set-up instructions](https://www.moddable.com/documentation/Moddable%20SDK%20-%20Getting%20Started) are also available. But, only do this if you are also building the Pebble firmware yourself.

- Before building, get [QEMU with Pebble firmware](https://github.com/Moddable-OpenSource/pebble-examples/releases). Then, launch QEMU:

	```
	cd {{your QEMU directory}}
	./qemu-start.sh
	```

- These examples use `console.log()`. Its output is routed to App Lib's logging facility. To see the output, launch the Pebble log viewer, after launching QEMU but before running the app:

	```
	rebble logs --qemu localhost:12344
	```

- Finally, run `hellopebble`:

	```
	cd hellopebble
	./setup.sh
	```
	The screen will be blank in QEMU as hellopebble has no user interface. The log viewer will show:

	```
	(.env) hoddie@jphAir2022 hellopebble % rebble logs --qemu localhost:12344        
	[15:46:30] xsHost.c:130> unimplemented: xSemaphoreCreateMutex
	[15:46:30] xsHost.c:130> unimplemented: xQueueCreate
	[15:46:30] xsHost.c:130> Found mod "hellopebble.moddable.tech"
	[15:46:30] xsHost.c:130> Hello, Pebble.
	```

## Using QEMU

If you have never used QEMNU before, it is not entirely obvious.

When you launch QEMU, it shows the QEMU console in addition to the emulator window for the display. The console is more-or-less useless for JavaScript developers.

However, exiting QEMU is more difficult that you might imagine. The easiest way to kill it is to press Control C in the QEMU console. (Don't ask where your mouse cursor went...)

These are the Pebble button mappings:
	- Up - up arrow
	- Down - down arrow
	- Back - left arrow
	- Select - right arrow

When QEMU first starts, PebbleOS shows an alert about having not been properly shut down. This will stay up until dismissed (press Back). You want to dismiss it because it will prevent your application from displaying on the screen.

## The examples

- `hellopebble` – The "hello, world" of this collection. One line. Perfect place to start.
- `hellotimer` – Demonstrates use of `setTimeout`.
- `hellomodule` – Mods can contain multiple modules. This is simple example of main loading another module from the mod.
