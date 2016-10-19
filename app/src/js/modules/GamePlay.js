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
		onRoundEnd() {
			//@todo remove all pickups
		};
		tick(delta) {
			this.time += delta;
			if (this.next < this.time) {
				this.next = Math.random() * 10000 + 7000 + this.time;
				this.placePickup();
			}
		}
		placePickup() {
			Game.activateEntity(this.getRandomPickup());
		}
		getRandomPickup() {
			var pickupName = this.config.pickups[Math.floor(Math.random() * this.config.pickups.length)];
			return new Game.pickups[pickupName](this.getRandomPosition(350));
		}
		getRandomPosition(borderWidth) {
			//@todo move to better place
			return new Victor(
				Math.random() * (this.config.width - borderWidth * 2) + borderWidth,
				Math.random() * (this.config.height - borderWidth * 2) + borderWidth
			);
		}
	}
	Game.register("GamePlay", GamePlay);
})();
