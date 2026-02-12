#include <pebble.h>

int main(void) {
	Window *w = window_create();
	window_stack_push(w, true);
	
	moddable_createMachine(&(ModdableCreationRecord){
		.recordSize = sizeof(ModdableCreationRecord),
		.stack = 5120,
		.slot = 31744,
		.chunk = 19456
	});

	window_destroy(w);
}
