# Moddable SDK Examples for PebbleOS
Updated May 27, 2025

This repository hosts a collection of examples for working in Embedded JavaScript using the Moddable SDK on PebbleOS.

## Things your should know

- JavaScript is precompiled at build time to bytecode into a mod. See the Moddable SDK [documentation on mods](https://www.moddable.com/documentation/xs/mods) for details.
- The XS Mod is wrapped in a Pebble native application. The mod is stored as the first resource.
- The process of using `mcrun` to build the mod and then triggering the normal Pebble app build is taken care of by `setup.sh` in the examples. 
- All JavaScript executes in [strict mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode). You aren't still depending on sloppy mode?
- The XS engine in this build is stripped significantly to fit in the limited space, so many built-ins and methods are unavailable. If you try to invoke them, you will typically get a "dead strip" exception.

## Getting started

- The Pebble build depends on a tool called `rebble`. Install that following their [instructions](https://github.com/richinfante/rebbletool?tab=readme-ov-file#setup).
	- You don't need to do the steps after `rebble sdk install latest`
	- Absolutely ignore the note on "Prerequisites for Apple Silicon: Install Rosetta 2". 
	- Each time you start a new terminal session, be sure to activate its Python virtual environment and add it to your `$PATH`. That looks something like this:

		```
		cd ~/pebble/rebbletool/rebbletool
		source .env/bin/activate
		export PATH=~/pebble/rebbletool/rebbletool/bin:$PATH
		```

- You will need the Moddable SDK tools available to build the mod. To ensure they are synchronized with the version of the Moddable SDK used in PebbleOS, you can use the macOS binaries [attached to this repository](https://github.com/Moddable-OpenSource/pebble-examples/releases).

	To use these binaries, add `$MODDABLE` to your environment variables, pointing to the root of the Moddable SDK, and add `$MODDABLE/build/bin/mac/release` to your `$PATH`. 
	
	Alternatively, [full set-up instructions](https://www.moddable.com/documentation/Moddable%20SDK%20-%20Getting%20Started) are also available. But, only do this if you are also building the Pebble firmware yourself.

- Before building, get [QEMU with Pebble firmware](https://github.com/Moddable-OpenSource/pebble-examples/releases). Then, launch QEMU:

	```
	cd {{your QEMU directory}}
	./qemu-start.sh
	```

- These examples use `console.log()`. Its output is routed to App Lib's logging facility. To see the output, launch the Pebble log, after launching QEMU but before running the app:

	```
	rebble logs --qemu localhost:12344
	```

- To run `hellopebble`:

	```
	cd hellopebble
	./setup.sh
	```

## The examples

- `hellopebble` – The "hello, world" of this collection. One line. Perfect place to start.
- `hellotimer` – Demonstrates use of `setTimeout`.
- `hellomodule` – Mods can contain multiple modules. This is simple example of main loading another module from the mod.
