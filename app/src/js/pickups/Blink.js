/**
 * Created by salt on 02.09.2016.
 */
(function() {
	class BlinkPickup extends Game.classes.Pickup {
		constructor(...sup) {
			super("special", ...sup);
			this.maxDuration = 1000;
			this.color = 'blue';
            this.blinkPower = 0.4;
		}
		OnUnMutate() {
            var scale = this.duration * this.blinkPower;
			this.owner.position.add(this.owner.direction.clone().multiplyScalar(scale));
			this.detach();
		}
	}
	Game.register("Blink", BlinkPickup);
})();