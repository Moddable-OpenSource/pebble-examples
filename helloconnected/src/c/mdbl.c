#include <pebble.h>

extern void action_bar_layer_legacy2_set_context(void *foo, void *bar);

int main(void) {
  Window *w = window_create();
  window_stack_push(w, true);

  action_bar_layer_legacy2_set_context(NULL, NULL);

  window_destroy(w);
}
