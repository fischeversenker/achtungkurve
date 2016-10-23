/**
 * Created by salt on 02.09.2016.
 */
(function() {
	class BlinkPickup extends Game.classes.Pickup {
		constructor(...sup) {
			super("special", ...sup);
			this.maxDuration = 5000;
			this.color = 'blue';
            this.blinkPower = 0;
            
		}
		/**
		 * @param {Player} player
		 */
        tick(delta) {
            super.tick(delta);
            if (this.owner !== null) {
                console.log(this.duration);
            }
        }
		pickedUp(player) {
		}
		onMutate() {}
		OnUnMutate() {
            var scale = this.duration;
            this.owner.position = new Victor(this.owner.direction.clone()).multiply(new Victor(scale, scale));
		}
	}
	Game.register("Blink", BlinkPickup);
})();