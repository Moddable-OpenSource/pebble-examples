const backgroundSkin = new Skin({ fill:"black" });
const barSkin = new Skin({ fill:"white" });
const digitsSkin = new Skin({ texture: new Texture(`digits.png`), width:24, height:40, variants:24, color:"white" });
const dateStyle = new Style({ font:"bold 14px Gothic", color:"black" });

const Layout = Container.template($ => ({
	left:0, right:0, top:0, bottom:0, skin:backgroundSkin,
	contents: [
		Content($, { left:6, skin:digitsSkin }),
		Content($, { left:36, skin:digitsSkin }),
		Content($, { left:60, skin:digitsSkin, variant:10 }),
		Content($, { left:84, skin:digitsSkin }),
		Content($, { left:114, skin:digitsSkin }),
		Label($, { left:0, right:0, top:0, skin:barSkin, style:dateStyle }),
		Label($, { left:0, right:0, bottom:0, skin:barSkin, style:dateStyle }),
	]
}));

export default Layout;
