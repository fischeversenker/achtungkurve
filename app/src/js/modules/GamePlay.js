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
			this.partyCheck = null;
		}
		onGameInit() {
			this.startRound();
		}
		onRoundStart() {
			this.time = 0;
		}
		onPlayerDied(player) {
			var deadCount = 0;
			for (var i = 0; i < this.config.player.length; i++) {
				if (!this.config.player[i].dead) {
					this.config.player[i].points += 1;
				} else {
					deadCount++;
				}
			}
			if (deadCount >= this.config.player.length - 1) {
				this.config.inMatch = false;
				Game.Events.fire("onRoundEnd");
				this.startRound();
			}
		}
		onRoundEnd() {
			var winner = this.checkGameEnd();
			if (winner) {
				console.log("%s wins the Game!", winner.name);
			}
		}
		checkGameEnd() {
			var max = 0,
				player;

			for (var i = 0; i < this.config.player.length; i++) {
				if (max < this.config.player[i].points) {
					max = Math.max(max, this.config.player[i].points);
					player = this.config.player[i];
				}
			}
			if (max >= 3) return player;
			return false;
		}
		tick(delta) {
			if (this.config.inMatch) {
				this.time += delta;
				if (this.next < this.time) {
					this.next = Math.random() * 10000 + 7000 + this.time;
					this.placePickup();
				}
			} else if (this.partyCheck != null) {
				this.partyCheck.call(null, delta);
			}
		}
		placePickup() {
			Game.activateEntity(Game.pickupFactory());
		}

		clearField () {
			this.config.ctx.clearRect(0, 0, this.config.width, this.config.height);
			//@todo remove pickups and mutators
			//@todo call clear event (so that modules can also clear something)
		}
		startRound() {
			this.checkParty(function() {
				// window.setTimeout(function() {
				this.clearField();
				this.startCountDown(2250, function() {
					this.config.inMatch = true;
					Game.Events.fire("onRoundStart");
				}.bind(this));
				// }, config.startGameTime);
			}.bind(this));
		}
		checkParty(fn) {
			Game.Events.fire("onPartyCheck");
			if (this.partyCheck != null) return false;
			//check for all special keys
			this.partyCheck = function() {
				var sum = 0;
				for (var i = 0; i < this.config.player.length; i++) {
					sum += (this.config.player[i].specialIntent) ? 1 : 0;
				}
				if (sum >= this.config.player.length) {
					this.partyCheck = null;
					Game.Events.fire("onPartyReady");
					if (typeof fn === "function") fn.call();
				}
			}.bind(this);
		}
		startCountDown(time, fn) {
			var count = 0;
			var a = setInterval(function() {
				count += time / 3;
			}, time / 3);

			setTimeout(function() {
				clearInterval(a);
				fn.call();
			}, time + 1);
		}
	}
	Game.register("GamePlay", GamePlay);
})();
