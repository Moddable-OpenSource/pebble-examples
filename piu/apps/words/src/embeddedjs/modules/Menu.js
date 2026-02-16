import assets from "assets";
import Timeline from "piu/Timeline";
import Timer from "timer";
import View from "piu/View";

class MenuBehavior extends View.Behavior {
	computeTweens(menu, selection, limit, direction) {
		const bounce = 8;
		const column = screen.color ? menu.last : menu.first;
		const inverter = screen.color ? column.previous : column.next;
		const item = column.content(selection);
		const offset = item.y - column.y;
		const delta = Math.max(0, Math.min(column.height - menu.height,  offset - ((menu.height - item.height) >> 1)));
		{
			let { from, on, to } = this.columnTween;
			from.y = column.y;
			to.y = menu.y - delta;
			if (direction) {
				on.y = to.y;
				if (direction < 0) {
					if (selection == 0)
						on.y = to.y + bounce;
				}
				else {
					if ((selection > 0) && (selection == limit))
						on.y = to.y - bounce;
				}
			}
		}
		{
			let { from, on, to } = this.inverterTween;
			from.y = inverter.y;
			from.height = inverter.height;
			to.y = menu.y + offset - delta;
			to.height = item.height;
			if (direction) {
				on.y = to.y;
				if (direction < 0) {
					if (selection > 0)
						on.y = to.y - bounce;
				}
				else {
					if ((selection > 0) && (selection == limit))
						on.y = to.y - bounce;
				}
				on.height = to.height + bounce;
			}
		}
	}
	onPressSelect(menu) {
		const column = screen.color ? menu.last : menu.first;
		const selection = this.view.selection = this.selection;
		const item = column.content(selection);
		menu.bubble("onSelect", selection, item.behavior.$);
	}
	onCreate(menu, $) {
		super.onCreate(menu, $);
		this.columnTween = {
			from: { y:0 },
			on: { y:0 },
			to: { y:0 },
		}
		this.inverterTween = {
			from: { y:0, height:0 },
			on: { y:0, height:0 },
			to: { y:0, height:0 },
		}
		this.selection = $.selection ?? 0;
	}
	onDisplaying(menu) {
		this.computeTweens(menu, this.selection);
		const column = screen.color ? menu.last : menu.first;
		const inverter = screen.color ? column.previous : column.next;
		column.y = this.columnTween.to.y;
		inverter.y = this.inverterTween.to.y;
		inverter.height = this.inverterTween.to.height;
	}
	onPress(menu, direction) {
		this.onStep(menu, direction);
		this.timer = Timer.set(() => {
			this.onStep(menu, direction);
		}, 400, 100);
	}
	onPressDown(menu) {
		this.onPress(menu, 1);
	}
	onPressUp(menu) {
		this.onPress(menu, -1);
	}
	onRelease(menu) {
		Timer.clear(this.timer);
		delete this.timer;
	}
	onReleaseDown(menu) {
		this.onRelease(menu, 1);
	}
	onReleaseUp(menu) {
		this.onRelease(menu, -1);
	}
	onStep(menu, direction) {
		if (menu.running) {
			menu.stop();
			menu.time = menu.duration;
		}
		const column = screen.color ? menu.last : menu.first;
		let selection = this.selection;
		let limit = column.length - 1;
		selection += direction;
		if (selection < 0)
			selection = 0;
		else if (selection > limit)
			selection = limit;
		this.selection = selection;
		this.computeTweens(menu, selection, limit, direction);		
		menu.duration = 250;
		menu.time = 0;
		menu.start();
	}
	onTimeChanged(menu) {
		const column = screen.color ? menu.last : menu.first;
		const inverter = screen.color ? column.previous : column.next;
		let fraction = Math.quadEaseOut(menu.fraction);
		fraction *= 4;
		if (fraction < 3) {
			fraction /= 3;
			{
				let { from, on } = this.columnTween;
				column.y = from.y + Math.round(((on.y - from.y ) * fraction));
			}
			{
				let { from, on } = this.inverterTween;
				inverter.y = from.y + Math.round(((on.y - from.y) * fraction));
				inverter.height = from.height + Math.round(((on.height - from.height) * fraction));
			}
		}
		else {
			fraction -= 3;
			{
				let { on, to } = this.columnTween;
				column.y = on.y + Math.round(((to.y - on.y) * fraction));
			}
			{
				let { on, to } = this.inverterTween;
				inverter.y = on.y + Math.round(((to.y - on.y) * fraction));
				inverter.height = on.height + Math.round(((to.height - on.height) * fraction));
			}
		}
		
	}
}

class MenuItemBehavior extends Behavior {
	onCreate(row, $) {
		this.$ = $;
	}
}

const MenuContainer = Container.template($ => ({
	skin:assets.skins.white, Behavior:$.constructor.Behavior,
	contents: [
		screen.color ? Content($, { left:0, right:0, top:0, height:0, skin:assets.skins.selection }) : null,
		Column($, { 
			left:0, right:0, top:0,
			contents: $.data.items.map($$ => new $.constructor[$$.Item ?? "Item"]($$))
		}),
		screen.color ? null : Inverter($, { left:0, right:0, top:0, height:0 }),
	]
}));

const MenuItemRow = Container.template($ => ({
	left:0, right:0, Behavior:MenuItemBehavior,
	contents: [
		Text($, { left:6, right:0, style:assets.styles.menuItem, string:$.title }),
	],
}));

export default class extends View {
	static get Behavior() { return MenuBehavior }
	static get ItemBehavior() { return MenuItemBehavior }
	static get Item() { return MenuItemRow }
	
	constructor(data) {
		super(data);
		this.selection = 0;
	}
	select(selection) {
		this.selection = selection;
	}
	get Template() { return MenuContainer }
};
