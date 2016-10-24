(function() {
	class TemplateMutator extends Game.classes.Mutator {
		constructor() {
			super();
			this.mutatorType = 'default';// or "special"
			this.owner = null;
			this.duration = 0;
			this.maxDuration = 3000;
			this.mutatorType = type || 'default';
			this.isMutated = false;
			this.color = 'yellow';
			this.target = 'player'; //, "enemies" or "all"
		}
		onMutate() {
			//change pr0perties
		}
		onUnMutate() {
			//restore properties
		}
		pickup(player) {
			//before mutator attached
			super.pickup(player);
			//after mutator attached
		}
		tick(delta) {
			super.tick(delta);
		}
		draw(delta) {
			super.tick(delta);
		}
	}
	//register mutator
	//Game.register("TemplateMutator", TemplateMutator);
})();