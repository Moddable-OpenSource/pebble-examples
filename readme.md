# Moddable SDK Examples for Pebble OS
Updated May 14, 2026

This repository contains a collection of examples for working in Embedded JavaScript using the Moddable SDK on Pebble OS.

## The examples

### Fundamentals
- `hellopebble` – The "hello, world" of this collection. One line. Perfect place to start.
- `hellotimer` – Demonstrates use of `setTimeout`.
- `hellomodule` – Applications can contain multiple modules. This is a simple example of the main module loading another module.
- `helloffi` – Shows how to call C functions from JavaScript using the [Foreign Function Interface](https://www.moddable.com/documentation/xs/XS%20FFI).

### Storage
- `hellokeyvalue` - Uses ECMA-419 Key-Value Storage to access Pebble Settings files for persistent storage. Supports storing binary data and strings; integer support is future work. Special mode option to open Pebble settings files created by built-in applications.
- `hellolocalstorage` – Uses [the `localStorage` global](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) from the Web standard to persist strings. This is implemented using ECMA-419 Key-Value Storage. Each application has its own local storage.

### Sensors
All sensors modules follow the [Sensor Class Pattern API](https://419.ecma-international.org/#-13-sensor-class-pattern) from the ECMA-419 standard.

- `helloaccelerometer` – Subscribes to accelerometer readings.
- `hellobattery` – Subscribes to battery and "plugged in" readings. 
- `hellolocation` – Subscribes to location service (uses your phone's GPS).
- `piu/apps/compass` – Visualizes compass readings using Piu. (Emery devices only)
- `piu/apps/gravity` – Visualizes accelerometer readings using Piu. (Emery devices only)

### User input
- `hellobutton` – Subscribes to Pebble button events.
- `hellopoco-drag` – Touch events using the ECMA-419 touch driver.
- `hellodictation` – Receives text transcription of user's spoken words.

### Watch
- `helloinfo` – Displays information about the display, watch model, and application launch reason.
- `helloappevents` - Displays notifications for app focus and resize events.
- `hellovibes` - Triggers various vibration pattens.
- `hellolight` - Control's the backlight on the watch display.
- `hellowakeup` - Manages wakeup notifications to automatically launch app at some time in the future.

### Piu user interface framework
Piu is a high level user interface framework for building embedded applications. Piu uses Pebble OS APIs for all rendering.

#### Piu Fundamentals
- `hellopiu-balls` – The classic Moddable SDK [piu/balls](https://github.com/Moddable-OpenSource/moddable/blob/public/examples/piu/balls/main.js) example for Pebble. The balls have been changed to 1-bit.
- `hellopiu-coloredsquares` – Draws three colored squares. From the Piu chapter of [our book](https://www.moddable.com/book).
- `hellopiu-gbitmap` – Draws a Pebble `GBitmap` PNG image using a Piu texture.
- `hellopiu-jsicon` – Draws a Moddable SDK Bitmap using a Piu texture
- `hellopiu-port` – Draws an animated graph using a Piu Port. From the Piu chapter of [our book](https://www.moddable.com/book).
- `hellopiu-text` – The classic Moddable SDK [piu/text](https://github.com/Moddable-OpenSource/moddable/blob/public/examples/piu/text/main.js) example for Pebble. Demonstrates dynamic layout with different fonts and sizes. Fonts are generated using [`bmfont`](https://www.moddable.com/blog/fonts/) to make resizing easy.
- `hellopiu-pebbletext` – The classic Moddable SDK [piu/text](https://github.com/Moddable-OpenSource/moddable/blob/public/examples/piu/text/main.js) example rendered using Pebble built-in fonts.
- `hellopiu-timeline` – Shows various easing equations using `Timeline` animation. Lightly revised version of [piu/easing-equations](https://github.com/Moddable-OpenSource/moddable/blob/public/examples/piu/easing-equations/main.js) example for Pebble display.
- `piu/apps/pdc-images` – Shows moving and rotating of PDC (SVG) images.
- `piu/apps/pdc-sequences` – Shows playback of PDC (SVG) sequences.
- `piu/apps/tic-tac-toe` – Simple game using the Pebble touch screen through a Piu `Behavior`.

#### Piu Watchfaces
This suite of city-inspired watchfaces demonstrates many different rendering techniques available from Piu.

- The examples use both bitmaps and Pebble SVG images (PDC). The bitmaps are generally used for background images, and the SVG images for the rotating clock hands.
- The Redmond watchface has two sets of graphical assets – one for color watches and the other for black and white watches.
- The Helsinki watchface shows how to have different implementations of a JavaScript module, depending on the watch model. This can be more efficient than a single module that handles all watch models.

- `piu/watchfaces/cupertino` - The classic macOS watch cursor as a... watchface.
- `piu/watchfaces/london` - Big Ben, [after restoration](https://apnews.com/article/big-ben-tower-architecture-prize-41d07cdd9a2d98d116887bbacad4d759). For color watches only.
- `piu/watchfaces/helsinki` - So minimal.
- `piu/watchfaces/redmond` - The original Windows clock, now on your wrist.
- `piu/watchfaces/zurich` – No need to visit a train platform in Switzerland to check out this iconic clock.

### Poco renderer
Poco is a lightweight graphics API. Poco renders using Pebble OS APIs.

#### Poco fundamentals
- `hellopoco-gbitmap` – Renders bitmaps stored in `GBitmap` resources using Poco.
- `hellopoco-qrcode` - Dynamically generates a [QR code](https://en.wikipedia.org/wiki/QR_code) and displays it using Poco.
- `hellopoco-text` – Example of rendering text with Poco using Moddable SDK fonts. Includes Japanese text to demonstrate UTF-8 multibyte support.
- `hellopoco-pebbletext` – Example of rendering text with Poco using Pebble built-in fonts.
- `hellopoco-pebblegraphics` – Use Pebble's line, round rectangle, and circle graphics operations.
- `hellowatchface` – Simple watchface app.

#### PDC resources (SVG)
- `hellopoco-pdc` – Renders PDC images.
- `hellopoco-rotate` – Spins a PDC image.
- `hellopoco-scale` – Animates a PDC image using image scaling controlled by the elastic easing equation.
- `hellopoco-pdc-sequence` – Renders a continuous PDC image sequence (animation).

### Communication
Pebble App Messages communicate between the watch and phone. HTTP requests and WebSocket connections are also available. HTTP and WebSocket require the `@moddable/proxy` package be added as a dependency to your project along with some support in your `index.js`. See the HTTP and WebSocket examples for details.

#### App Messages
- `hellomessage` - An [ECMA-419 IO Class Pattern](https://419.ecma-international.org/#-9-io-class-pattern) style API to access Pebble's `app_message` API for communication between the watch and PebbleKit JS.

> **Note**: The `Messages` class on Pebble OS allows sending messages from the watch to the phone only after receiving a message from the phone. This is to ensure that the PKJS code is running. The proxy used for HTTP and WebSocket does this automatically. If you implement the PKJS code yourself, be sure to send a message when your PKJS code receives the `ready` event.

- `helloconnected` – Subscribes to notifications that indicate when the watch is connected to the phone app and it's PebbleKit JS app.

#### HTTP
- `hellohttpclient` - Uses the standard [ECMA-419 HTTP Client](https://419.ecma-international.org/#-20-http-client-class-pattern) to make HTTP requests. The HTTP Client implementation uses `app_message` to communicate with PebbleKit JS which uses `XMLHttpRequest` to make the actual request.
- `hellofetch` - Uses the [web standard `fetch()` API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) to make HTTP requests. The implementation is a subset of `fetch()`; specifically, it excludes features which require Web Streams. The `fetch()` implementation is built on the HTTP Client.

> **Note**: For most developers, `fetch()` is the right API for HTTP requests. The httpclient API is more memory efficient because it supports sending the request body in fragments, receiving the response body in fragment, and uses callbacks instead of promises. Naturally, as a more powerful low level API it is less convenient to use.

#### WebSocket
- `hellowebsocketclient` - Uses the standard [ECMA-419 WebSocket Client](https://419.ecma-international.org/#-24-websocket-client-class-pattern) for WebSocket sessions. The WebSocket Client implementation uses `app_message` to communicate with PebbleKit JS which uses `WebSocket` to make the actual request.
- `hellowebsocket` - Uses the [web standard `WebSocket()` API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/WebSocket) for WebSocket sessions. The implementation is a subset of `WebSocket()`. The `WebSocket()` implementation is built on the WebSocket Client.

> **Note**: For most developers, `WebSocket()` is the right API for WebSocket requests. The WebSocket Client API is more memory efficient because it supports sending the messages in fragments, and receiving the messages in fragment. Naturally, as a more powerful low level API it is less convenient to use.

### TypeScript
TypeScript development is supported. The TypeScript compiler (`tsc`) is automatically invoked by the build to convert TypeScript source code to standard JavaScript. Type declarations for Pebble are provided in `$MODDABLE/typings`. Note that you must add include "manifest_typings.json" in `src/embeddedjs/manifest.json` as shown in the example.

- `hellotypescript` – A TypeScript example using the Pebble `Button` class.

<a id="know"></a>
## Things you should know
- The XS JavaScript engine configuration eliminates language features unlikely to be useful on Pebble. If you try to invoke them, you will typically get a "dead strip" exception. Details of the omitted features are [below](#omitted).
- Top-level-await is supported.
- Apps launch instantly because JavaScript is precompiled at build time to bytecode and stored as a mod. See the Moddable SDK [documentation on mods](https://www.moddable.com/documentation/xs/mods) for details.
- The **mod** is wrapped in a Pebble native application (see `src/c/mbdl.c`). The mod is the last resource id, following the application resources.
- All JavaScript executes in [strict mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode). You aren't still depending on sloppy mode?
- Modules are standard ECMAScript modules. CommonJS modules are not supported. This is 2026.
- Each module has some memory overhead, so minimize the number of modules to avoid exhausting memory.
- Execution is performed under [Hardened JavaScript](https://hardenedjs.org). The primary observable consequence is that all primordials are immutable, which removes the possibility of [monkey patches](https://en.wikipedia.org/wiki/Monkey_patch). Note that `Date` and `Math.random()` behave normally, forgoing the strict determinism of Hardened JavaScript.
- Applications can override the default memory configuration for JavaScript code when calling `moddable_createMachine()` from the application's `mdbl.c`.

<a id="omitted"></a>
## Omitted JavaScript features
The Pebble build of XS omits features of JavaScript that are unlikely to be useful on Pebble. This saves flash space. When a script invokes a feature that has been omitted, a "dead strip" exception is thrown. These features are stripped:

- `Proxy` and `Reflect` – primarily used for test frameworks and meta-programming techniques
- `Atomics` – meaningless without Web Workers (which is not currently available on Pebble OS)
- `WeakMap` and `WeakSet` – used for tracking objects in JavaScript patches which isn't necessary on Pebble
- `BigInt` – IEEE-754 double precision floating point is already a stretch on Pebble; let's not multiply 1024-bit integers too
- `eval`, `Function` and `Generator` – JavaScript source code is compiled to bytecode at build time, so the parser is unnecessary at runtime. Details on the [blog](https://www.moddable.com/blog/eval/).

To be clear, these features could be made available on Pebble, they just aren't at this time.

On the other hand, because JavaScript developers can't seem to live without `RegExp` that is fully supported, as is `JSON` along with most everything else in the ES2025 edition of the JavaScript standard.

<a id="notes"></a>
## Notes

### Piu
The [Piu](https://www.moddable.com/documentation/piu/piu) user interface framework on Pebble OS provides the following standard classes as globals:

- `Application`
- `Behavior`
- `Column`
- `Container`
- `Content`
- `Label`
- `Layout`
- `Link`
- `Port`
- `Row`
- `Scroller`
- `Skin`
- `Style`
- `Text`
- `Texture`
- `Transition`

The following Pebble specific Piu classes are available as globals:

- `Inverter`
- `RoundRect`
- `SVGImage`
- `ScreenBuffer`

The following functions are available as globals:

- `blendColors`
- `hsl`
- `hsla`
- `rgb`
- `rgba`

The `Timeline` module is available by `import`, as usual.

To work with Pebble bitmaps as textures, `Texture` extends the `path` property of its dictionary. As before, if `path` is a string, it refers to a Moddable SDK resource; if a number, it refers to a Pebble resource.

<a id="web-apis"></a>
### Web Platform APIs
The following Web Platform APIs are available. In most cases, the implementations are an embedded-friendly subset of the standard APIs.

- `fetch`
- `WebSocket`
- `URL`
- `URLSearchParams`
- `Headers`
- `localStorage`
- `clearImmediate`
- `clearInterval`
- `clearTimeout`
- `setImmediate`
- `setInterval`
- `setTimeout`
- `console.log`

<a id="fonts"></a>
### Pebble built-in fonts
Pebble's built-in fonts may be used from both Piu and Poco. These fonts are currently available:

| Family Name       | Style     | Sizes           |
|-------------------|-----------|-----------------|
| Bitham            | Black     | 30              |
| Bitham            | Bold      | 42              |
| Bitham            | Light     | 18, 34, 42      |
| Bitham            | Medium    | 34, 42          |
| Droid Serif       | Bold      | 28              |
| Gothic            | Bold      | 14, 18, 24, 28, 36 |
| Gothic            | Regular   | 9, 14, 18, 24, 28, 36 |
| Leco              | Bold      | 20, 26, 32, 36, 38 |
| Leco              | Light     | 28              |
| Leco              | Regular   | 42              |
| Roboto            | Bold      | 49              |
| Roboto Condensed  | Regular   | 21              |

> **Note**: Some built-in fonts, such as Leco, include only a subset of glyphs.
