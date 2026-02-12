const BLACK = "black";
const GRAY = "gray";
const WHITE = "white";
const TRANSPARENT = "transparent";

const assets = {
	colors: {
		BLACK, GRAY, WHITE, TRANSPARENT,
	},
	skins: {
		selection: { fill:"#AAAAAA" },
		black: { fill:BLACK },
		gray: { fill:GRAY },
		white: { fill:WHITE },
		actionMenuDot: { texture: new Texture(`dot.png`), width:5, height:5, color:[BLACK,WHITE] },
		actionMenuItem: { fill:[BLACK,WHITE] },
	},
	styles: {
		menuItem: { font:"bold 24px Gothic", color:BLACK, horizontal:"left", left:8, top:6, bottom:6 },
		actionMenuItem: { font:"bold 24px Gothic", color:[WHITE,BLACK], horizontal:"left", left:8, top:9, bottom:9 },
	},
	fonts: [
		"bold 36px RobotoCondensed",
		"italic bold 36px ArialNarrow",
		"42px BrushScript",
		"bold 28px DroidSerif",
		"bold 36px Gothic",
	],
};

export default Object.freeze(assets, true);
