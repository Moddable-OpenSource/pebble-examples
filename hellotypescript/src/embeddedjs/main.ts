import Button from "pebble/button";

type ButtonType = "select" | "up" | "down";

class PebbleApp {
	private buttonPresses: number = 0;
	private lastPress: string = "none";
	private readonly startTime: number = Date.now();

	constructor() {
		new Button({
			types: ["select", "up", "down"],
			onPush: (down: number, type: ButtonType): void => {
				if (down) {
					this.buttonPresses++;
					this.lastPress = type;
					console.log(`Button ${type} pressed (total: ${this.buttonPresses})`);
				}
			}
		});

		watch.addEventListener("secondchange", (): void => {
			this.updateStatus();
		});

		setTimeout((): void => {
			console.log("App initialized");
			this.updateStatus();
		}, 1000);
	}

	private updateStatus(): void {
		const uptime: number = Math.floor((Date.now() - this.startTime) / 1000);
		console.log(`Uptime: ${uptime}s | Presses: ${this.buttonPresses} | Last: ${this.lastPress} | Connected: ${JSON.stringify(watch.connected)}`);
	}
}

new PebbleApp;
