#include <pebble.h>
#include "xsffi.h"

int main(void) {
	Window *w = window_create();
	window_stack_push(w, true);

	moddable_createMachine(&(ModdableCreationRecord){
		.recordSize = sizeof(ModdableCreationRecord),
		.fxBuildFFI = fxBuildFFI,
	});

	window_destroy(w);
}
