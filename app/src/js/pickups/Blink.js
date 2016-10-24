/**
 * Created by salt on 02.09.2016.
 */
(function() {
	class BlinkMutator extends Game.classes.Mutator {
		constructor() {
			super();
			this.mutatorType = 'special';
			this.maxDuration = 1000;
			this.color = 'blue';
            this.blinkPower = 0.4;
		}
		onUnMutate() {
            var scale = this.duration * this.blinkPower;
			this.owner.position.add(this.owner.direction.clone().multiplyScalar(scale));
			this.detach();
		}
	}
	Game.register("Blink", BlinkMutator);
})();