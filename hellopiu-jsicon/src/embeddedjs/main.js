console.log("hello, Piu JS-Icon");

const application = new Application(null, {
	skin: new Skin({
		fill: "white"
	})
});

const jsLogoSkin = new Skin({
	texture: new Texture({
		path: "js.png"
	}),
	height: 100, width: 100
});

application.add(new Content(null, { 
	skin: jsLogoSkin
}));
