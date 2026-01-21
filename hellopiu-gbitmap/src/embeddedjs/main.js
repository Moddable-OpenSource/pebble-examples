console.log("hello, Piu GBitmap");

const desktopSkin = new Skin({
	texture: new Texture(1),		// IMAGE_DESKTOP
	x: 0, y: 0, width: 40, height: 40,
	tiles: {left: 0, right: 0, top: 0, bottom: 0}
});

const application = new Application(null, {
	skin: desktopSkin
});

const sun = new Texture(2)			// IMAGE_SUN
application.add(new Content(null, { 
	skin: new Skin({
		texture: sun,
		width: sun.width, height: sun.height
	})
}));
