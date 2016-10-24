/**
 * Created by salt on 02.09.2016.
 */
(function() {
	class SpeedBoostMutator extends Game.classes.Mutator {
		constructor() {
			super();
			this.mutatorType = 'default';
			this.maxDuration = 5000;
			this.color = 'green';
		}
		onMutate() {
			this.owner.speed += 1;
		}
		onUnMutate() {
			this.owner.speed -= 1;
		}
	}
	Game.register("SpeedBoost", SpeedBoostMutator);
})();