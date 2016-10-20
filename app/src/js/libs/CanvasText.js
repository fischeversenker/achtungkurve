(function() {
	"use strict";
	var drawables = [],
		run = false,
		lastUpdate = 0;

	function loop() {
		if (run) requestAnimationFrame(loop);
		var now = Date.now();
		var deltaTime = now - lastUpdate;
		lastUpdate = now;

		for(let i = 0; i < drawables.length; i++) {
			drawables[i].draw(deltaTime);
		}
		while(cleanup()) {}
		if (drawables.length === 0) run = false;
	}
	function cleanup() {
		for(var I = 0; I < drawables.length; I++) {
			if (drawables[I].kill) {
				drawables.splice(I, 1);
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
	function add(drawable) {
		if (drawables.indexOf(drawable) > -1) return;
		drawables.push(drawable);
		bootLoop();
	}
	function remove(drawable) {
		drawable.kill = true;
	}
	// function startAnimation(animation) {
	// 	animation.id = idCount++;
	// 	animations.push(animation);
	// 	bootLoop();
	// 	return animation.id;
	// }
	// function stopAnimation(id) {
	// 	getAnimation(id).kill = true;
	// }
	// function getAnimation(id) {
	// 	for(let I = 0; I < animations.length; I++) {
	// 		if (animations[I].id == id) return animations[I];
	// 	}
	// }
	/**
	 *
	 */
	class Text {
		constructor(textString, size, ctx, pos) {
			this.ctx 	= ctx;
			this.text 	= textString;
			this.stroke = false;
			this.size 	= size;
			this.pos 	= pos;
			this.angle 	= 45;
			this.alpha	= 1;
			this.font 				= "Arial";//"Comic Sans MS";
			this.fillStyle			= "red";
			this.strokeStyle		= "red";
			this.shadowColor 		= "lime";
			this.shadowBlur 		= 0;
			this.shadowOffsetX		= 0;
			this.shadowOffsetY		= 0;
			this.textAlign 			= "center";
			this.textBaseline 		= "middle";
			this.animations = [];
		}
		measureText() {
			this.ctx.font = this.size + "px " + this.font;
			return ctx.measureText(this.text);
		}
		attach(animation, _mode = false) {
			if (!(animation instanceof TextAnimation)) {
				console.error("First argument is not a instance of TextAnimation!" );
			}
			this.animations.push(animation);
			if (!_mode) {
				animation.attach(this, true);
			}
		}
		detach(animation) {
			var i = this.animations.indexOf(animation);
			if (i < 0) return false;
			animation.text = null;
			this.animations.splice(i, 1);
			return true;
		}
		setActive(bool = true) {
			return (bool)? add(this): remove(this);
		}
		draw(delta) {
			for(let i = 0; i < this.animations.length; i++) {
				if (this.animations[i].text != null)
					this.animations[i].animate(delta);
			}
			this.ctx.save();
			this.ctx.globalAlpha 	= this.alpha;
			this.ctx.font 			= this.size + "px " + this.font;
			this.ctx.fillStyle 		= this.fillStyle;
			this.ctx.strokeStyle 	= this.strokeStyle;
			this.ctx.shadowBlur 	= this.shadowBlur;
			this.ctx.shadowColor 	= this.shadowColor;
			this.ctx.shadowOffsetX	= this.shadowOffsetX;
			this.ctx.shadowOffsetY	= this.shadowOffsetY;
			this.ctx.textAlign 		= this.textAlign;
			this.ctx.textBaseline 	= this.textBaseline;
			this.ctx.translate(this.pos.x, this.pos.y);
			this.ctx.rotate(this.angle * Math.PI / 180);
			this.ctx[(this.stroke)? "strokeText": "fillText"](this.text, 0, 0);
			this.ctx.restore();
		}
	}
	/**
	 *	text animation base class
	 */
	class TextAnimation {
		constructor(fn = null, text = null) {
			this.text = text;
			this.onEnd = fn;
			if (text != null) text.attach(this);
		}
		attach(text, _mode = false) {
			this.text = text;
			if (!_mode) {
				text.attach(this, true);
			}
		}
		detach() {
			this.text.detach(this);
		}
		animate(delta) {}
	}
	/**
	 * FadeOut
	 */
	class FadeOut extends TextAnimation {
		/**
		 * @param duration
		 * @param fn
		 */
		constructor(duration, fn = null, text = null) {
			super(fn, text);
			this.time = 0;
			this.duration = duration;
		}
		animate(delta) {
			this.text.alpha = (1 / this.duration) * (this.duration - this.time);
			this.time += delta;
			if (this.time >= this.duration) {
				this.detach();
				if (typeof this.onEnd === "function"){
					this.onEnd();
				}
			}
		}
	}
	/**
	 * FadeSize
	 */
	class FadeSize extends TextAnimation {
		/**
		 * @param duration
		 * @param fn
		 */
		constructor(targetSize, duration, fn = null, text = null) {
			super(fn, text);
			this.time = 0;
			this.duration = duration;
			this.sizeDiff = 0;
			this.targetSize = targetSize;
			this.startSize = 0;
		}
		animate(delta) {
			this.text.size = (this.sizeDiff / this.duration) * this.time + this.startSize;
			this.time += delta;
			if (this.time >= this.duration) {
				this.detach();
				if (typeof fn === "function") this.onEnd();
			}
		}
		attach(text, _mode = false) {
			super.attach(text, _mode);
			this.sizeDiff = this.targetSize - text.size;
			this.startSize = text.size;
		}
	}

	/**
	 * Pulsate
	 */
	class Pulsate extends TextAnimation {
		/**
		 * @param speed
		 * @param fn
		 */
		constructor(speed, text = null) {
			super(null, text);
			this.time = 0;
			this.speed = speed;
		}
		animate(delta) {
			this.time += delta;
			var pos = (Math.sin(this.time / 1000 * this.speed) + 1) / 2;
			this.text.alpha = pos * 0.5 + 0.5;
		}
	}
	window.CanvasText = {
		Text: Text,
		animations: {
			/**
			 * @type FadeOut
			 */
			FadeOut: FadeOut,
			Pulsate: Pulsate,
			FadeSize: FadeSize,
			// stop: stopAnimation
		}
	}
})();