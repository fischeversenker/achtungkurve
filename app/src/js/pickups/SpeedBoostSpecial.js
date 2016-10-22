/**
 * Created by salt on 02.09.2016.
 */
(function() {
	class SpeedBoostSpecialPickup extends Game.classes.Pickup {
		constructor(...sup) {
			super("special", ...sup);
			this.maxDuration = 5000;
			this.color = 'yellow';
		}
		onMutate() {
			this.owner.speed += 1;
		}
		OnUnMutate() {
			this.owner.speed -= 1;
		}
	}
	Game.register("SpeedBoostSpecial", SpeedBoostSpecialPickup);
})();