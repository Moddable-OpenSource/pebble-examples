console.log("hello, Piu Colored Squares");

const application = new Application(null, {
	skin: new Skin({
		fill: "white"
	})
});

const Square = Content.template($ => ({
	width: 80, height: 80,
	skin: new Skin({ fill: $ })
}));

const lightGraySquare = new Square("#8CC", { left: 20, top: 20 });
const graySquare = new Square("gray");
const darkGraySquare = new Square("#800", { right: 20, bottom: 20 });

application.add(lightGraySquare);
application.add(graySquare);
application.add(darkGraySquare);
