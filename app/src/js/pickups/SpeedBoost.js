/**
 * Created by salt on 02.09.2016.
 */
(function() {
	class SpeedBoostPickup extends Game.classes.Pickup {
		constructor(...sup) {
			super(...sup);
			this.maxDuration = 5000;
			this.owner = null;
		}
		dispose() {
			this.owner.speed = 1;
			super.dispose();
		}
		/**
		 * @param {Player} player
		 */
		pickedUp(player) {
			player.speed += 0.5;
		}
		/**
		 * @param {number} delta time
		 */
		tick(delta) {
			super.tick(delta);
			if(this.owner != null) {
				this.duration += delta;
				if(this.duration >= this.maxDuration) {
					//reset value
					this.owner.speed = 1;
					this.owner.removeMutator(this);
					this.dispose();
				}
			}
		}
	}
	Game.register("SpeedBoostPickup", SpeedBoostPickup);
})();