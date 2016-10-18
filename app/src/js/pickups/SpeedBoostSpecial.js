/**
 * Created by salt on 02.09.2016.
 */
(function() {
	class SpeedBoostSpecialPickup extends Game.classes.Pickup {
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
		}
		/**
		 * @param {number} delta time
		 */
		tick(delta) {
			super.tick(delta);
			if(this.owner != null) {
				if(this.owner.specialIntent) {
					this.owner.speed = 1.5;
					this.duration += delta;
					if (this.duration >= this.maxDuration) {
						//reset value
						this.owner.speed = 1;
						this.owner.removeMutator(this);
						this.dispose();
					}
				} else {
					this.owner.speed = 1;
				}
			}
		}
	}
	Game.register("SpeedBoostSpecialPickup", SpeedBoostSpecialPickup);
})();