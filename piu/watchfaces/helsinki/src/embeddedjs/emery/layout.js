const backgroundSkin = new Skin({ fill:"#005500" });
const barSkin = new Skin({ fill:"#AAFFAA" });
const digitsSkin = new Skin({ texture: new Texture(`digits.png`), width:33, height:55, variants:33, color:"#55FF55" });
const dateStyle = new Style({ font:"bold 18px Gothic", color:"black" });

const Layout = Container.template($ => ({
	left:0, right:0, top:0, bottom:0, skin:backgroundSkin,
	contents: [
		Content($, { left:9, skin:digitsSkin }),
		Content($, { left:52, skin:digitsSkin }),
		Content($, { left:85, skin:digitsSkin, variant:10 }),
		Content($, { left:118, skin:digitsSkin }),
		Content($, { left:160, skin:digitsSkin }),
		Label($, { left:0, right:0, top:0, skin:barSkin, style:dateStyle }),
		Label($, { left:0, right:0, bottom:0, skin:barSkin, style:dateStyle }),
	]
}));

export default Layout;
