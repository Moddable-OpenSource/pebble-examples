#include <pebble.h>

int main(void) {
  Window *w = window_create();
  window_stack_push(w, true);

#ifdef PBL_DEBUG
  ModdableCreationRecord creation = {
    .recordSize = sizeof(creation),
    .flags = kModdableCreationFlagDebug
  };
  moddable_createMachine(&creation);
#else
  moddable_createMachine(NULL);
#endif

  window_destroy(w);

  return 0;
}
