/**
 * Created by salt on 01.09.2016.
 */
(function() {
	class Overlay extends Game.classes.Module {
		constructor() {
			super();
			var conf = super.getConfig();
			//create overlay canvas
			var $overlay = $('<canvas/>', {id: "canvas-underlay"})
				.prop({
					width: conf.width,
					height: conf.height,
					style: "z-index: 10"
				})
				.appendTo(conf.dom);
			this.overlayCtx = $overlay[0].getContext("2d");
			this.msg = null;
		}
		onGameInit() {

		}
		onPartyCheck() {
			//show text  "Press Special Key"
			this.msg = new CanvasText.Text("Press Special Key", 30, this.overlayCtx, new Victor(200, 200), 0);
			this.msg.setActive();
			var a = new CanvasText.animations.Pulsate(5);
			a.attach(this.msg);
		}
		onPartyReady() {
			//show countdown
			this.msg.setActive(false);
			this.msg = null;
			var ctx = this.overlayCtx;
			var text = new CanvasText.Text("3", 30, ctx, new Victor(200, 200), 0);
				text.alpha = 1;
				text.size = 60;
			text.setActive();
			text.attach(new CanvasText.animations.FadeOut(750, function() {
				text.text = "2";
				text.alpha = 1;
				text.size = 60;
				text.attach(new CanvasText.animations.FadeOut(750, function() {
					text.text = "1";
					text.alpha = 1;
					text.size = 60;
					text.attach(new CanvasText.animations.FadeOut(750, function() {
						text.text = "GO!";
						text.alpha = 1;
						text.size = 20;
						text.attach(new CanvasText.animations.FadeOut(750));
						text.attach(new CanvasText.animations.FadeSize(120, 750));
					}));
					text.attach(new CanvasText.animations.FadeSize(20, 750));
				}));
				text.attach(new CanvasText.animations.FadeSize(20, 750));
			}));
			text.attach(new CanvasText.animations.FadeSize(20, 750));
		}
		onRoundStart() {

		}
		onPostTick() {
			var conf = super.getConfig();
			this.overlayCtx.save();
			this.overlayCtx.restore();
			this.overlayCtx.fillStyle = "rgba(0, 0, 0, 0)";
			this.overlayCtx.clearRect(0, 0, conf.width, conf.height);
			// draw player overlays
			this.overlayCtx.beginPath();
			for(let i = 0; i < conf.player.length; i++) {
				this.overlayCtx.beginPath();
				var player = conf.player[i];
				this.overlayCtx.fillStyle = (conf.player[i].dead)? "red" : "yellow";
				this.overlayCtx.arc(player.position.x, player.position.y, player.size + 1, 0, 2 * Math.PI);
				this.overlayCtx.fill();
				this.overlayCtx.closePath();

				for (let ii = 0; ii < player.activeMutator.length; ii++) {
					let mutator = player.activeMutator[ii]
					this.drawTimer(player.position, mutator.duration / mutator.maxDuration, mutator.color);
					break;
				}
			}
			this.overlayCtx.restore();
		}
		drawTimer(pos, time, color) {
			this.overlayCtx.beginPath();
			this.overlayCtx.fillStyle = "rgba(0, 0, 0, 0)";
			this.overlayCtx.strokeStyle = color;
			this.overlayCtx.lineCap = "square";
			this.overlayCtx.lineWidth = 5.0;

			var startAngle = Math.PI / 2;
			this.overlayCtx.arc(pos.x, pos.y, 30, -startAngle, (Math.PI * 2 * time) - startAngle, false);
			this.overlayCtx.stroke();
			this.overlayCtx.closePath();
		}
	}
	Game.register("Overlay", Overlay);
})();