/**
 * Created by salt on 02.09.2016.
 */
(function() {
	class SpeedBoostPickup extends Game.classes.Pickup {
		constructor(...sup) {
			super("default", ...sup);
			this.maxDuration = 5000;
			this.color = 'green';
		}
		onMutate() {
			this.owner.speed += 1;
		}
		OnUnMutate() {
			this.owner.speed -= 1;
		}
	}
	Game.register("SpeedBoost", SpeedBoostPickup);
})();