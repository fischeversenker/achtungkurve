/**
 * Created by salt on 03.09.2016.
 */
(function() {
	"use strict";

	class GamePlay extends Game.classes.Module {
		constructor() {
			super();
			this.config = super.getConfig();
			this.doPartyCheck = false;

			//this.party
		};
		onGameInit() {
			//show welcome msg
			//startRound
		};
		onRoundStart() {
			Game.activateEntity(new Game.modules["SpeedBoostSpecialPickup"](new Victor(150, 350)));
		};
		onPlayerDied(player) {
			//set points
		};
		onRoundEnd() {
			//partyCall
				//start new round
		};
		tick() {
			if (this.doPartyCheck) {
				//check all player
			}
		};
	}
	Game.register("GamePlay", GamePlay);
})();
