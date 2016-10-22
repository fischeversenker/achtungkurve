(function() {
	class Rocket extends Game.classes.Entity {
		constructor(direction, ...sup) {
			super(...sup);
			this.direction = direction;
			this.direction.x *= 5;
			this.direction.y *= 5;
			this.detonationRadius = 30;
			this.config = super.getConfig();
			this.ctx = this.config.ctx;
			this.underlayCtx = this.config.underlayCtx;
			this.detonated = false;
		}
		tick() {
			if (this.detonated) return;
			this.position.add(this.direction);
			if (this.checkCollision()) this.explode();
		}
		draw() {
			if (this.detonated) return; //@todo draw detonation
			this.underlayCtx.save();
			this.underlayCtx.moveTo(this.position.x, this.position.y);
			this.underlayCtx.beginPath();
			this.underlayCtx.fillStyle = 'red';
			this.underlayCtx.arc(this.position.x, this.position.y, 10, 0, Math.PI * 2);
			this.underlayCtx.closePath();
			this.underlayCtx.fill();
			this.underlayCtx.restore();
		}
		checkCollision() {
			var checkPoint = this.direction.clone().add(this.position);
			var imgd = this.ctx.getImageData(Math.round(checkPoint.x), Math.round(checkPoint.y), 1, 1);
			if (imgd.data[3] !== 0) return true;
			return false;
		}
		explode() {
			var pos = this.position;
			this.ctx.save();
			this.ctx.globalCompositeOperation = 'destination-out';
			this.ctx.arc(pos.x, pos.y, this.detonationRadius, 0, Math.PI * 2, true);
			this.ctx.fill();
			this.ctx.restore();
			this.detonated = true;
		}
	}
	class Bazuka extends Game.classes.Pickup {
		constructor(...sup) {
			super("special", ...sup);
			this.rockets = Math.ceil(Math.random() * 3);
			this.maxDuration = this.rockets * 1000;
			this.color = 'red';
		}
		onMutate() {
			//fire
			var rocket = new Rocket(this.owner.direction.clone(), this.owner.position.clone());
			Game.activateEntity(rocket);
			this.rockets--;
			this.maxDuration -= 1000;
			if (this.rockets === 0) {
				this.detach();
			}
		}
		OnUnMutate() {}
		fire() {
		}
	}
	Game.register("Bazuka", Bazuka);
})();
