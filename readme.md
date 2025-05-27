# Moddable SDK Examples for PebbleOS
Updated May 27, 2025

This repository hosts a collection of examples for working in Embedded JavaScript using the Moddable SDK on PebbleOS.

## Things to know

- JavaScript is precompiled at build time to bytecode into a mod. See the Moddable SDK [documentation on mods](https://www.moddable.com/documentation/xs/mods) for details.
- You will need the Moddable SDK tools available to build the mod. To ensure they are synchronized with the version of the Moddable SDK used in PebbleOS, you should build the tools from source at this point.

	```
	git clone https://github.com/Moddable-OpenSource/moddable.git
	cd moddable/build/make/mac
	make debug && make
	```
	Add `$MODDABLE` pointing to the root of the Moddable SDK to your environment and add `$MODDABLE/build/bin/mac/release` to your `$PATH`. [Full set-up instructions](https://www.moddable.com/documentation/Moddable%20SDK%20-%20Getting%20Started) are also available.

- The XS Mod is wrapped in a Pebble native application. It is stored as the first resource.
- The process of using `mcrun` to build the mod and then triggering the normal Pebble app build is taken care of by `setup.sh` in the examples. 
- To run `hellopebble`:

	```
	cd hellopebble
	./setup.sh
	```
- The example just logs to the Pebble console so run `./waf qemu_console` to see the output.
- All JavaScript executes in [strict mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode). You aren't still depending on sloppy mode?
- The XS engine in this build is stripped significantly to fit in the limited space, so many built-ins and methods are unavailable. If you try to invoke them, you will typically get a "dead strip" exception.

## The examples

- `hellopebble` – The "hello, world" of this collection. One line. Perfect place to start.
- `hellotimer` – Demonstrates use of `setTimeout`.
- `hellomodule` – Mods can contain multiple modules. This is simple example of main loading another module from the mod.
