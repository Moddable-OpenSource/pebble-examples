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

const blackSquare = new Square("black", { left: 20, top: 20 });
const graySquare = new Square("gray");
const anotherBlackSquare = new Square("black", { right: 20, bottom: 20 });

application.add(blackSquare);
application.add(graySquare);
application.add(anotherBlackSquare);
