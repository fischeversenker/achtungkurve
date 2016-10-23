/**
 * Created by salt on 02.09.2016.
 */
(function() {
	class BoldPickup extends Game.classes.Pickup {
		constructor(...sup) {
			super("default", ...sup);
			this.maxDuration = 5000;
			this.color = 'orange';
		}
		/**
		 * @param {Player} player
		 */
		pickedUp(player) {
		}
		onMutate() {
			this.owner.size += 10;
		}
		OnUnMutate() {
			this.owner.size -= 10;
		}
	}
	Game.register("Bold", BoldPickup);
})();