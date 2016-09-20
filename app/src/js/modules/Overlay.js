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
		}
		onGameInit() {

		}
		onRoundStart() {

		}
		onPostTick() {
			var conf = super.getConfig();
			this.overlayCtx.fillStyle = "rgba(0, 0, 0, 0)";
			this.overlayCtx.clearRect(0, 0, conf.width, conf.height);
			// draw player overlays
			this.overlayCtx.beginPath();
			for(var i = 0; i < conf.player.length; i++) {
				this.overlayCtx.beginPath();
				var player = conf.player[i];
				this.overlayCtx.fillStyle = (conf.player[i].dead)? "red" : "yellow";
				this.overlayCtx.arc(player.position.x, player.position.y, player.size + 1, 0, 2 * Math.PI);
				this.overlayCtx.fill();
				this.overlayCtx.closePath();

				for (var ii = 0; ii < player.activeMutator.length; ii++) {
					this.drawTimer(player.position, player.activeMutator[ii].duration / player.activeMutator[ii].maxDuration);
				}
			}
		}
		drawTimer(pos, time) {
			this.overlayCtx.beginPath();
			this.overlayCtx.fillStyle = "rgba(0, 0, 0, 0)";
			this.overlayCtx.strokeStyle = "#99CC33";
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