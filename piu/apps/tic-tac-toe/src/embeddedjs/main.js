const blackSkin = new Skin({ fill:"#0000AA" });
const graySkin = new Skin({ fill:"gray" });
const whiteSkin = new Skin({ fill:"white" });
const squareSkin = new Skin({ fill:["white","#AAAAFF"], stroke:"white", left:2, right:2, top:2, bottom:2 });
const glyphSkin = new Skin({ texture: new Texture(`glyph.png`), width:66, height:66, variants:66, color:["#0000AA", "#0000AA"] });

const combinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

class TTTApplicationBehavior {
	onCreate(application, $) {
		this.variant = 0;
	}
	onPressSelect(application) {
		let container = application.first.first;
		while (container) {
			container.active = true;
			container.first.visible = false;
			container = container.next;;
		}
		let shape = application.last.first;
		while (shape) {
			shape.visible = false;
			shape = shape.next;;
		}
		this.variant = 0;
	}
	onTap(application, container) {
		const squares = application.first;
		const shapes = application.last;
		container.active = false;
		const content = container.first;
		const variant = this.variant;
		content.variant = variant;
		content.visible = true;
		for (let i = 0; i < 8; i++) {
			let [ a, b, c ] = combinations[i];
			a = squares.content(a).first;
			b = squares.content(b).first;
			c = squares.content(c).first;
			if (a.visible && (a.variant == variant) && b.visible && (b.variant == variant) && c.visible && (c.variant == variant)) {
				shapes.content(i).visible = true;
				let container = squares.first;
				while (container) {
					container.active = false;
					container = container.next;;
				}
				break;
			}
		}
		this.variant = variant ? 0 : 1;
	}
}

class TTTSquareBehavior {
	onCreate(container, $) {
	}
	onTouchBegan(container) {
		container.state = 1;
	}
	onTouchEnded(container) {
		container.state = 0;
		container.bubble("onTap", container);
	}
}

const TTTSquare = Container.template($ => ({
	width:67, height:67, skin:squareSkin, active:true, Behavior:TTTSquareBehavior,
	contents: [
		Content($, { visible:false, left:0, top:0, skin:glyphSkin }),
	]
}));

const TTTApplication = Application.template($ => ({
	Behavior:TTTApplicationBehavior, skin:whiteSkin,
	contents: [
		Container($, {
			left:0, right:0, top:0, bottom:0,
			contents: [
				TTTSquare($, { left:0, top:14 }),
				TTTSquare($, { left:67, top:14 }),
				TTTSquare($, { left:134, top:14 }),
				TTTSquare($, { left:0, top:81 }),
				TTTSquare($, { left:67, top:81 }),
				TTTSquare($, { left:134, top:81 }),
				TTTSquare($, { left:0, top:148 }),
				TTTSquare($, { left:67, top:148 }),
				TTTSquare(1, { left:134, top:148 }),
			]
		}),
		SVGImage($, { left:0, width:200, top:14, height:200, path:`grid.pdc` }),
		Container($, {
			left:0, right:0, top:0, bottom:0,
			contents: [
				SVGImage($, { left:0, width:200, top:14, height:66, visible:false, path:`lr.pdc` }),
				SVGImage($, { left:0, width:200, top:81, height:66, visible:false, path:`lr.pdc` }),
				SVGImage($, { left:0, width:200, top:148, height:66, visible:false, path:`lr.pdc` }),
				SVGImage($, { left:0, width:66, top:14, height:200, visible:false, path:`tb.pdc` }),
				SVGImage($, { left:67, width:66, top:14, height:200, visible:false, path:`tb.pdc` }),
				SVGImage($, { left:134, width:66, top:14, height:200, visible:false, path:`tb.pdc` }),
				SVGImage($, { left:0, width:200, top:14, height:200, visible:false, path:`tlbr.pdc` }),
				SVGImage($, { left:0, width:200, top:14, height:200, visible:false, path:`trbl.pdc` }),
			]
		}),
	]
}));

const application = new TTTApplication({}, { displayListLength:2048, touchCount:1, pixels: screen.width * 4,  });

export default application;
 
