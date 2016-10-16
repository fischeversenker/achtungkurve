(function() {
	"use strict";
	class Text {
		constructor(textString, size, ctx, pos) {
			this.ctx 	= ctx;
			this.text 	= textString;
			this.size 	= size;
			this.pos 	= pos;
			this.angle 	= 0;
			this.alpha	= 1;
			this.font 	= "Arial";//"Comic Sans MS";
		}
		draw() {
			this.ctx.save();
			this.ctx.globalAlpha = this.alpha;
			this.ctx.font = this.size + "px " + this.font;
			this.ctx.fillStyle = "red";
			this.ctx.textAlign = "center";
			this.ctx.fillText(this.text, this.pos.x, this.pos.y);
			this.ctx.restore();
		}
	}

	var animations = [],
		idCount = 0,
		run = false,
		lastUpdate = 0;

	function loop() {
		if (run) requestAnimationFrame(loop);
		var now = Date.now();
		var deltaTime = now - lastUpdate;
		lastUpdate = now;

		for(let i = 0; i < animations.length; i++) {
			let anim = animations[i];
			anim.fn.call(anim, deltaTime);
		}
		for(let i = 0; i < animations.length; i++) {
			animations[i].text.draw();
		}
		while(remove()) {}
		if (animations.length === 0) run = false;
	}
	function remove() {
		for(var I = 0; I < animations.length; I++) {
			if (animations[I].kill) {
				animations.splice(I, 1);
				return true;
			}
		}
		return false;
	}
	function bootLoop() {
		if (run) return;
		lastUpdate = Date.now();
		run = true;
		loop.call();
	}
	function startAnimation(animation) {
		animation.id = idCount++;
		animations.push(animation);
		bootLoop();
		return animation.id;
	}
	function stopAnimation(id) {
		getAnimation(id).kill = true;
	}
	function getAnimation(id) {
		for(let I = 0; I < animations.length; I++) {
			if (animations[I].id == id) return animations[I];
		}
	}

	window.CanvasText = {
		Text: Text,
		animations: {
			fadeOut: function(text, duration, fn) {
				return startAnimation({
					type: "fadeOut",
					text: text,
					time: 0,
					duration: duration,
					fn: function(delta) {
						this.text.alpha = (1 / duration) * (duration - this.time);
						this.time += delta;
						if (this.time >= this.duration) {
							stopAnimation(this.id);
							if (typeof fn === "function") fn();
						}
					}
				});
			},
			fadeSize: function(text, targetSize, duration, fn) {
				var sizeDiff = targetSize - text.size;
				return startAnimation({
					type: "fadeSize",
					text: text,
					beginSize: text.size,
					targetSize: targetSize,
					time: 0,
					duration: duration,
					fn: function(delta) {
							this.text.size = (sizeDiff / duration) * (duration - this.time);
						//this.text.size = (1 / duration) * (duration - this.time);
						this.time += delta;
						if (this.time >= this.duration) {
							stopAnimation(this.id);
							if (typeof fn === "function") fn();
						}
					}
				});

			},
			stop: stopAnimation
		}
	}
})();