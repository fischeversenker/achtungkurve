/**
 * Created by salt on 02.09.2016.
 */
(function() {
	class BoldMutator extends Game.classes.Mutator {
		constructor() {
			super();
			this.mutatorType = 'default';
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
		onUnMutate() {
			this.owner.size -= 10;
		}
	}
	Game.register("Bold", BoldMutator);
})();