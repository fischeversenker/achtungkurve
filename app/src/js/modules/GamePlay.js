/**
 * Created by salt on 03.09.2016.
 */
(function() {
	"use strict";

	class GamePlay extends Game.classes.Module {
		constructor() {
			super();
			this.config = super.getConfig();
			this.time = 0;
			this.next = Math.random() * 2000 + 1000;
		};
		onGameInit() {};
		onRoundStart() {
		};
		onPlayerDied(player) {};
		onRoundEnd() {};
		tick(delta) {
			this.time += delta;
			if (this.next < this.time) {
				this.next = Math.random() * 20000 + 7000 + this.time;
				this.placePickup();
			}
		}
		placePickup() {
			Game.activateEntity(new Game.modules["SpeedBoostSpecialPickup"](this.getRandomPosition(50)));
		}
		getRandomPickup() {

		}
		getRandomPosition(borderWidth) {
			//@todo move to better place
			return new Victor(
				Math.random() * (this.config.width - borderWidth) + borderWidth,
				Math.random() * (this.config.height - borderWidth) + borderWidth
			);
		}
	}
	Game.register("GamePlay", GamePlay);
})();
