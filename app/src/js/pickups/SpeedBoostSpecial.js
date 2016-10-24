/**
 * Created by salt on 02.09.2016.
 */
(function() {
	class SpeedBoostSpecialMutator extends Game.classes.Mutator {
		constructor() {
			super();
			this.mutatorType = 'special';
			this.maxDuration = 5000;
			this.color = 'yellow';
		}
		onMutate() {
			this.owner.speed += 1;
		}
		onUnMutate() {
			this.owner.speed -= 1;
		}
	}
	Game.register("SpeedBoostSpecial", SpeedBoostSpecialMutator);
})();