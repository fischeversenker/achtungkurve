(function() {
	class TemplatePickup extends Game.classes.Pickup {
		constructor(...sup) {
			super("default", ...sup);
			//mutator properties
			this.owner = null;
			this.duration = 0;
			this.maxDuration = 3000;
			this.mutatorType = type || 'default';
			this.isMutated = false;
			//pickup properties
			this.ctx;
			this.radius = 20;
			this.color = 'yellow';
			this.target = 'player'; //, "enemies" or "all"
		}
		onMutate() {
			//change pr0perties
		}
		OnUnMutate() {
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
	//register pickup
	//Game.register("TemplatePickup", TemplatePickup);
})();