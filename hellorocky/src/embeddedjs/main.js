import Button from "pebble/button"
import Time from "time"
import Timer from "timer"

globalThis.Date = class extends Date {		// hack around unfinished RTC
	constructor(...args) {
		super(...args);
		if (0 == args.length)
			this.setTime(1_746_480_415_759 + Time.ticks);
	}
};

console.log(`TicToc running under Moddable SDK`);

let mode = 0;	// 0 = no seconds, 1 = seconds as text, 2 = second hand, 3 = continuous second hand
let status = "";
let statusTimer;

new Button({
	type: "select",
	onPush(down) {
		if (down) {
			mode = (mode + 1) % 4;
			rocky.requestDraw();

			status = ["No seconds", "Seconds as text", "Second hand", "Continuous seconds"][mode];
			Timer.clear(statusTimer);
			statusTimer = Timer.set(() => {status = ""; rocky.requestDraw(); statusTimer = undefined}, 2500);
			console.log(`Rendering mode: ${status}`);
		}
	}
});

var WatchfaceHelper = function(date = new Date) {
	function clockwiseRad(fraction) {
	  // TODO: figure out if this is actually correct orientation for Canvas APIs
	  return (1.5 - fraction) * 2 * Math.PI;
	}
 
	var secondFraction = date.getSeconds() / 60;
	if (3 === mode)
		secondFraction += (date.getMilliseconds() / 1000) / 60;
	var minuteFraction = (date.getMinutes()) / 60;
	var hourFraction = (date.getHours() % 12 + minuteFraction) / 12;
	this.secondAngle = clockwiseRad(secondFraction);
	this.minuteAngle = clockwiseRad(minuteFraction);
	this.hourAngle = clockwiseRad(hourFraction);
 };
 
 // book keeping so that we can easily animate the two hands for the watchface
 // .scale/.angle are updated by tween/event handler (see below)
 var renderState = {
	seconds: 0,
	second: {style: 'black', scale: 0.80, angle: 0, lineWidth: 3},
	minute: {style: 'black', scale: 0.80, angle: 0},
	hour: {style: 'black', scale: 0.51, angle: 0}
 };
 
 // helper function for the draw function (see below)
 // extracted as a standalone function to satisfy common believe in efficient JS code
 // TODO: verify that this has actually any effect on byte code level
 var drawHand = function(handState, ctx, cx, cy, maxRadius) {
	ctx.lineWidth = handState.lineWidth ?? 8;
	ctx.strokeStyle = handState.style;
	ctx.beginPath();
	ctx.moveTo(cx, cy);
	ctx.lineTo(cx + Math.sin(handState.angle) * handState.scale * maxRadius,
				  cy + Math.cos(handState.angle) * handState.scale * maxRadius);
	ctx.stroke();
 };
 
 // the 'draw' event is being emitted after each call to rocky.requestDraw() but
 // at most once for each screen update, even if .requestDraw() is called frequently
 // the 'draw' event might also fire at other meaningful times (e.g. upon launch)
 rocky.on('draw', function(drawEvent) {
	if (3 === mode) {
		var wfh = new WatchfaceHelper;
		renderState.second.angle = wfh.secondAngle;
		Timer.set(() => rocky.requestDraw());		// requestDraw ignored if called from draw event
	}
	var ctx = drawEvent.context;
	var w = ctx.canvas.clientWidth;
	var h = ctx.canvas.clientHeight;
	// clear canvas on each render
	ctx.fillStyle = 'white';
	ctx.fillRect(0, 0, w, h);
 
	// center point
	var cx = w / 2;
	var cy = h / 2;
	var maxRadius = Math.min(w, h - 2 * 10) / 2;
	drawHand(renderState.minute, ctx, cx, cy, maxRadius);
	drawHand(renderState.hour, ctx, cx, cy, maxRadius);
	if ((2 === mode) || (3 === mode))
		drawHand(renderState.second, ctx, cx, cy, maxRadius);
	// overdraw center so that no white part of the minute hand is visible
	drawHand({style: 'black', scale: 0, angle: 0}, ctx, cx, cy, 0);
 
	if (status) {
		ctx.font = '14px bold Gothic';
		ctx.textAlign = 'center';
		ctx.fillStyle = 'black';
		ctx.fillText(status, cx, 0, w);
	}
	else {
		// Draw a 12 o clock indicator
		drawHand({style: 'black', scale: 0, angle: 0}, ctx, cx, 8, 0);
	}
 
	if (1 === mode) {
		ctx.font = '20px bold Leco-numbers';
		ctx.textAlign = 'center';
		ctx.fillStyle = 'black';
		ctx.fillText(renderState.seconds.toString().padStart(2, "0"), cx, h - 23, w);
	}
});
 
 // listener is called on each full minute and once immediately after registration
 rocky.on('minutechange', function(e) {
	// WatchfaceHelper will later be extracted as npm module
	var wfh = new WatchfaceHelper(e.date);
	renderState.minute.angle = wfh.minuteAngle;
	renderState.hour.angle = wfh.hourAngle;
	if (mode === 0)
		rocky.requestDraw();
});
 
 rocky.on('secondchange', function(e) {
	var wfh = new WatchfaceHelper(e.date);
	renderState.seconds = e.date.getSeconds();
	renderState.second.angle = wfh.secondAngle;
	if (0 !== mode) 
		rocky.requestDraw();
});
