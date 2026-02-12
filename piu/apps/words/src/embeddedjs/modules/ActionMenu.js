import assets from "assets";
import Timeline from "piu/Timeline";
import Timer from "timer";
import View from "piu/View";

class ActionMenuBehavior extends View.Behavior {
	computeTweens(menu, selection, limit, direction) {
		const bounce = 8;
		const column = menu.first;
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
	}
	onCreate(menu, $) {
		super.onCreate(menu, $);
		this.columnTween = {
			from: { y:0 },
			on: { y:0 },
			to: { y:0 },
		}
		this.selection = $.selection ?? 0;
	}
	onDisplaying(menu) {
		const column = menu.first;
		const current = column.content(this.selection);	
		current.behavior.onSelected(current, 1);
		this.computeTweens(menu, this.selection);
		column.y = this.columnTween.to.y;
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
	onPressSelect(menu) {
		const column = menu.first;
		const selection = this.view.selection = this.selection;
		const item = column.content(selection);
		menu.bubble("onSelect", selection, item.behavior.$);
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
	onSelect(menu, selection, item) {
		controller.goWith(item);
	}
	onStep(menu, direction) {
		if (menu.running) {
			menu.stop();
			menu.time = menu.duration;
		}
		const column = menu.first;
		let selection = this.selection;
		let limit = column.length - 1;
		selection += direction;
		if (selection < 0)
			selection = 0;
		else if (selection > limit)
			selection = limit;
		if (this.selection != selection) {
			const former = column.content(this.selection);	
			const current = column.content(selection);	
			this.selection = selection;
			former.behavior.onSelected(former, 0);
			current.behavior.onSelected(current, 1);
		}
		this.computeTweens(menu, selection, limit, direction);		
		menu.duration = 250;
		menu.time = 0;
		menu.start();
	}
	onTimeChanged(menu) {
		const column = menu.first;
		let fraction = Math.quadEaseOut(menu.fraction);
		fraction *= 4;
		if (fraction < 3) {
			fraction /= 3;
			{
				let { from, on } = this.columnTween;
				column.y = from.y + Math.round(((on.y - from.y ) * fraction));
			}
		}
		else {
			fraction -= 3;
			{
				let { on, to } = this.columnTween;
				column.y = on.y + Math.round(((to.y - on.y) * fraction));
			}
		}
		
	}
}

class ActionMenuItemBehavior extends Behavior {
	onCreate(row, $) {
		this.$ = $;
	}
	onSelected(row, state) {
		let content = row.first;
		while (content) {
			content.state = state;
			content = content.next;
		}
		row.state = state;
	}
}

const ActionMenuContainer = Container.template($ => ({
	skin:assets.skins.black, Behavior:$.constructor.Behavior,
	contents: [
		Column($, { 
			left:15, right:0, top:0,
			contents: $.data.items.map($$ => new ActionMenuItemRow($$, { }))
		}),
		Container($, { 
			left:0, width:15, top:0, bottom:0, skin:assets.skins.gray,
			contents: [
				Content($, { left:5, top:5, skin:assets.skins.actionMenuDot }),
			]
		}),
	]
}));

const ActionMenuItemRow = Container.template($ => ({
	left:0, right:0, Behavior:ActionMenuItemBehavior,
	contents: [
		RoundRect($, { left:6, right:6, top:6, bottom:6, skin:assets.skins.actionMenuItem, radius:6 }),
		Text($, { left:6, right:6, style:assets.styles.actionMenuItem, string:$.title }),
	],
}));

export default class extends View {
	static get Behavior() { return ActionMenuBehavior }
	static get ItemBehavior() { return ActionMenuItemBehavior }
	
	constructor(data) {
		super(data);
		this.selection = 0;
	}
	get Template() { return ActionMenuContainer }
};
